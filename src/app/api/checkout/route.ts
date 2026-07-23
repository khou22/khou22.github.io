import { NextRequest } from "next/server";
import Stripe from "stripe";
import { photoPricing } from "@/constants/photoPricing";
import { CartItem, MAX_ITEM_QTY } from "@/utils/cart/cartCookie";
import { castPhotoID } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { getPrintProduct } from "@/utils/printProduct";
import { siteMetadata } from "@/constants/siteMetadata";

export type CheckoutRequest = {
  items: CartItem[];
};

/**
 * Stripe Checkout's own cap on line items per session.
 */
const MAX_LINE_ITEMS = 100;

/**
 * Creates a Stripe Checkout Session for the given cart. The client only sends
 * `{photoID, variantId, qty}` — prices are always re-derived server-side from
 * `photoPricing`, so cart tampering is not possible.
 */
export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("No Stripe secret key found");
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const body: CheckoutRequest = await request.json();
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return new Response("Cart is empty", { status: 400 });
    }
    if (body.items.length > MAX_LINE_ITEMS) {
      return new Response("Too many items in cart", { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      body.items.map((item) => {
        const photoID = castPhotoID(item.photoID);
        if (!photoID) {
          throw new CheckoutValidationError(`Unknown photo: ${item.photoID}`);
        }

        const variant = photoPricing.find((v) => v.id === item.variantId);
        if (!variant || !variant.inStock) {
          throw new CheckoutValidationError(
            `Unavailable print variant: ${item.variantId}`,
          );
        }

        if (!Number.isInteger(item.qty) || item.qty < 1) {
          throw new CheckoutValidationError(
            `Invalid quantity for ${item.variantId}`,
          );
        }

        const product = getPrintProduct(photoID, variant);
        return {
          quantity: Math.min(item.qty, MAX_ITEM_QTY),
          price_data: {
            currency: "usd",
            unit_amount: Math.round(variant.price * 100),
            product_data: {
              name: product.name,
              description: product.description,
              images: [product.image],
              metadata: {
                photoID: item.photoID,
                variantId: item.variantId,
              },
            },
          },
        };
      });

    // In dev, redirect back to the origin the checkout started on (eg.
    // localhost) so local test payments don't land on the production site.
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? request.nextUrl.origin
        : siteMetadata.siteUrl;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${baseUrl}${PAGES.PHOTOGRAPHY.CHECKOUT_SUCCESS}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${PAGES.PHOTOGRAPHY.CART}`,
      allow_promotion_codes: true,
      shipping_address_collection: { allowed_countries: ["US"] },
      // Shipping cost is configured in the Stripe Dashboard (optional).
      ...(process.env.STRIPE_SHIPPING_RATE_ID
        ? {
            shipping_options: [
              { shipping_rate: process.env.STRIPE_SHIPPING_RATE_ID },
            ],
          }
        : {}),
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    if (error instanceof CheckoutValidationError) {
      return new Response(error.message, { status: 400 });
    }
    return new Response("Failed to create checkout session", { status: 500 });
  }
}

class CheckoutValidationError extends Error {}
