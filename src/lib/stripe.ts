import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

if (apiKey === "sk_test_placeholder") {
  console.warn("WARNING: STRIPE_SECRET_KEY is not set. Stripe operations will fail.");
}


export const stripe = new Stripe(apiKey, {
  // @ts-ignore - version might be slightly different but API should be compatible
  apiVersion: "2024-04-10",
  typescript: true,
});
