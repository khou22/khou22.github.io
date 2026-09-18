import { NextRequest } from "next/server";
import Stripe from "stripe";
import { photoPricing } from "@/constants/photoPricing";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { getTagsForPhotoID } from "@/data/photos/photoDbManager";
import {
  CartItem,
  MAX_CART_LINES,
  MAX_ITEM_QTY,
} from "@/utils/cart/cartCookie";
import { castPhotoID } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { getPrintProduct } from "@/utils/printProduct";
import { siteMetadata } from "@/constants/siteMetadata";

export type CheckoutRequest = {
  items: CartItem[];
};

/**
 * Vercel serverless function timeout. The default (10s on Hobby) is tight
 * for a Stripe API round-trip plus SDK retries; 60s is allowed on all plans.
 */
export const maxDuration = 60;

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
    if (body.items.length > MAX_CART_LINES) {
      return new Response("Too many items in cart", { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    for (const item of body.items) {
      const photoID = castPhotoID(item.photoID);
      if (!photoID) {
        throw new CheckoutValidationError(`Unknown photo: ${item.photoID}`);
      }

      // The product page hides the "Add to cart" button for photos tagged
      // NotForSale; enforce the same rule here so a hand-crafted request
      // can't buy one.
      const tags = await getTagsForPhotoID(photoID);
      if (tags.includes(PhotoTags.NotForSale)) {
        throw new CheckoutValidationError(
          `Photo is not for sale: ${item.photoID}`,
        );
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
      line_items.push({
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
      });
    }

    // Send the customer back to the canonical domain in production. Everywhere
    // else (local dev, Vercel preview deployments) redirect to the origin the
    // checkout started on so test payments don't land on the live site.
    const baseUrl =
      process.env.VERCEL_ENV === "production"
        ? siteMetadata.siteUrl
        : request.nextUrl.origin;
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
