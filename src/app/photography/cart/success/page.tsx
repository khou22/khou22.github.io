"use client";

import { useEffect } from "react";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { useCart } from "@/components/organisms/Cart/CartProvider";
import { PAGES } from "@/utils/pages";

/**
 * Post-checkout landing page. Stripe redirects here after a successful
 * payment (with `?session_id=...`); the cart is cleared on arrival. Direct
 * visits without a session ID leave the cart alone.
 */
export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("session_id")) {
      clearCart();
    }
  }, [clearCart]);

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-2xl px-4 py-12">
      <h1 className="mb-4">Thank you for your order! 📸</h1>
      <p className="mb-2">
        Your payment was successful. You&apos;ll receive a receipt from Stripe
        at the email you provided, and I&apos;ll be in touch about your prints
        shortly.
      </p>
      <p className="mb-8">
        Questions about your order?{" "}
        <CustomLink href={PAGES.CONTACT}>Get in touch</CustomLink>.
      </p>
      <CustomLink href={PAGES.PHOTOGRAPHY.HOME}>
        Continue browsing photography
      </CustomLink>
    </main>
  );
}
