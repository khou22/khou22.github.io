"use server";

import { stripe } from "@/lib/stripe";

export async function getSessionDetails(sessionId: string) {
  if (!sessionId) {
    throw new Error("Missing session_id");
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    return {
      amount: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      customer_email: session.customer_details?.email ?? "",
      items: session.line_items?.data.map((item) => ({
        name: item.description ?? "",
        quantity: item.quantity ?? 0,
        amount: item.amount_total ?? 0,
      })) ?? [],
    };
  } catch (error: any) {
    console.error("Error retrieving session:", error);
    throw new Error(error.message);
  }
}
