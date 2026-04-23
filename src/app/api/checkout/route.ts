import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";
import { photoPricing } from "../../../constants/photoPricing";
import { getPhotoName, PhotoIdType } from "../../../utils/cdn/cdnAssets";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const line_items = items.map((item: { id: string; quantity: number }) => {
      // id is photoID__priceID
      const parts = item.id.split("__");
      if (parts.length < 2) {
        throw new Error(`Invalid item ID format: ${item.id}`);
      }
      
      const priceID = parts.pop()!;
      const photoID = parts.join("__");

      const priceVariant = photoPricing.find((p) => p.id === priceID);

      if (!priceVariant) {
        throw new Error(`Invalid price variant: ${priceID}`);
      }

      const name = `${getPhotoName(photoID as PhotoIdType)} (${priceVariant.name})`;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: name,
            metadata: {
              photoID,
              priceID,
            },
          },
          unit_amount: Math.round(priceVariant.price * 100), // convert to cents
        },
        quantity: item.quantity,
      };
    });

    const baseUrl = process.env.BASE_URL || 'https://khou22.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
