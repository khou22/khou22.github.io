import { NextRequest } from "next/server";
import Stripe from "stripe";
import { EmailServiceFactory } from "@/services/email/EmailServiceFactory";

/**
 * Stripe webhook. On a paid Checkout Session, sends an order notification
 * email so fulfillment can be handled manually (order history lives in the
 * Stripe Dashboard — no database).
 */
export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Stripe webhook env vars missing");
    return new Response("Stripe is not configured", { status: 500 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // The raw body is required for signature verification.
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    try {
      // Event payloads follow the webhook endpoint's configured API version,
      // not the SDK's — re-retrieve the session so the shape (eg.
      // `collected_information`) always matches the SDK's pinned version.
      const session = await stripe.checkout.sessions.retrieve(
        event.data.object.id,
      );

      // Delayed-notification payment methods (eg. ACH) fire
      // `checkout.session.completed` while `payment_status` is still
      // "unpaid"; the `async_payment_succeeded` event arrives once the
      // payment actually clears and triggers the email instead.
      if (session.payment_status !== "paid") {
        return new Response("ok (payment not yet complete)");
      }

      await sendOrderNotification(stripe, session);
    } catch (error) {
      // Return 500 so Stripe retries the webhook until the email succeeds.
      console.error("Failed to send order notification:", error);
      return new Response("Failed to send order notification", {
        status: 500,
      });
    }
  }

  if (event.type === "checkout.session.async_payment_failed") {
    // No email — the order never happened. Logged for visibility only.
    console.warn("Async payment failed for session:", event.data.object.id);
  }

  return new Response("ok");
}

const sendOrderNotification = async (
  stripe: Stripe,
  session: Stripe.Checkout.Session,
) => {
  if (!process.env.ORDER_NOTIFICATION_EMAIL) {
    throw new Error("No order notification email found");
  }

  // Line items are not included on the session; fetch them (with the inline
  // product expanded so the exact photoID is available) so each order email
  // is self-describing for fulfillment.
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
    expand: ["data.price.product"],
  });
  const itemSummary = lineItems.data
    .map((item) => {
      const product = item.price?.product;
      const photoID =
        product && typeof product !== "string" && !product.deleted
          ? product.metadata.photoID
          : undefined;
      return `- ${item.quantity}× ${item.description}${
        photoID ? ` (photoID: ${photoID})` : ""
      }`;
    })
    .join("\n");

  const shipping = session.collected_information?.shipping_details;
  const address = shipping?.address;
  const shippingSummary = shipping
    ? `${shipping.name}
${address?.line1 ?? ""}${address?.line2 ? `\n${address.line2}` : ""}
${address?.city ?? ""}, ${address?.state ?? ""} ${address?.postal_code ?? ""}
${address?.country ?? ""}`
    : "(no shipping address collected)";

  const total = ((session.amount_total ?? 0) / 100).toFixed(2);

  const emailService = EmailServiceFactory.create();
  await emailService.sendEmail({
    to: {
      name: "Print Orders",
      email: process.env.ORDER_NOTIFICATION_EMAIL,
    },
    from: {
      name: "Print Orders",
      email: process.env.ORDER_NOTIFICATION_EMAIL,
    },
    subject: `📸 New print order — $${total}`,
    content: `New order received!

Customer: ${session.customer_details?.name ?? "?"} <${
      session.customer_details?.email ?? "?"
    }>
Total: $${total}

Items:
${itemSummary}

Ship to:
${shippingSummary}

Stripe session: ${session.id}
Manage this order in the Stripe Dashboard.`,
  });
};
