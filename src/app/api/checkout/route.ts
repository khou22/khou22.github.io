import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getProductDetails } from "@/utils/catalog";
import * as storeDbManager from "@/data/store/storeDbManager";
import { checkStock } from "@/data/store/inventoryDbManager";
import { siteMetadata } from "@/constants/siteMetadata";


export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey === "sk_test_placeholder") {
      console.error("STRIPE_SECRET_KEY is not set or is using the placeholder value.");
      return NextResponse.json(
        { error: "Stripe Checkout is not configured. Please set a valid STRIPE_SECRET_KEY in your .env file." },
        { status: 500 }
      );
    }

    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || siteMetadata.siteUrl;

    const lineItems: any[] = [];
    const orderItems: storeDbManager.OrderItemData[] = [];
    let totalAmount = 0;

    for (const item of items) {
      const { photoID, variantID, quantity } = item;
      const product = getProductDetails(photoID, variantID);

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${photoID} ${variantID}` },
          { status: 400 },
        );
      }

      // Check inventory
      const hasStock = await checkStock(photoID, variantID, quantity || 1);
      if (!hasStock) {
        return NextResponse.json(
          { error: `Insufficient stock for: ${product.name}` },
          { status: 400 },
        );
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
            images: product.image ? [product.image] : [],
          },
          unit_amount: Math.round(product.price * 100), // Stripe expects cents
        },
        quantity: quantity || 1,
      });

      orderItems.push({
        product_id: photoID,
        variant_id: variantID,
        title: product.name,
        price: product.price,
        quantity: quantity || 1,
      });

      totalAmount += product.price * (quantity || 1);
    }

    // Create pending order in DB
    const orderId = await storeDbManager.createOrder(
      {
        total_amount: totalAmount,
        payment_status: "pending",
        fulfillment_status: "pending",
      },
      orderItems,
    );

    if (!orderId) {
      throw new Error("Failed to create order");
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 500,
              currency: "usd",
            },
            display_name: "Standard Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Express Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 3,
              },
            },
          },
        },
      ],

      line_items: lineItems,
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${origin}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store/cart`,
      client_reference_id: orderId.toString(),
      metadata: {
        orderId: orderId.toString(),
      },
    });

    // Update order with Stripe Session ID
    await storeDbManager.updateOrderSessionId(orderId, session.id);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
