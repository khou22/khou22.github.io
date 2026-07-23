"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { toast } from "sonner";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/organisms/Cart/CartProvider";
import { photoPricing } from "@/constants/photoPricing";
import { CartItem } from "@/utils/cart/cartCookie";
import {
  castPhotoID,
  getCdnAsset,
  getPhotoName,
  getPhotoThumbnail,
} from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";

const CartLineItem = ({ item }: { item: CartItem }) => {
  const { setQty, removeItem } = useCart();

  const photoID = castPhotoID(item.photoID);
  const variant = photoPricing.find((v) => v.id === item.variantId);
  if (!photoID || !variant) return null;

  const thumbnail = getPhotoThumbnail(photoID);
  const image = getCdnAsset(thumbnail ?? photoID);

  return (
    <div className="flex flex-row items-center gap-4 border-b border-gray-200 py-4">
      <Link href={PAGES.PHOTOGRAPHY.PHOTO(photoID)} className="shrink-0">
        <img
          src={image}
          alt={getPhotoName(photoID)}
          className="h-20 w-20 rounded object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={PAGES.PHOTOGRAPHY.PHOTO(photoID)}
          className="font-medium hover:underline"
        >
          {getPhotoName(photoID)}
        </Link>
        <p className="caption">
          {variant.name} · {variant.material}
        </p>
        <p className="text-sm font-medium text-gray-800">${variant.price}</p>
      </div>

      <div className="flex flex-row items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Decrease quantity"
          disabled={item.qty <= 1}
          onClick={() => setQty(item.photoID, item.variantId, item.qty - 1)}
        >
          −
        </Button>
        <span className="w-6 text-center text-sm">{item.qty}</span>
        <Button
          variant="outline"
          size="icon"
          aria-label="Increase quantity"
          onClick={() => setQty(item.photoID, item.variantId, item.qty + 1)}
        >
          +
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        aria-label="Remove from cart"
        onClick={() => removeItem(item.photoID, item.variantId)}
      >
        Remove
      </Button>
    </div>
  );
};

export default function CartPage() {
  const { items } = useCart();
  const posthog = usePostHog();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Safari/Firefox restore this page from the bfcache when the user hits
  // Back from Stripe — reset the button so it isn't stuck on "Redirecting…".
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setIsCheckingOut(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const subtotal = items.reduce((total, item) => {
    const variant = photoPricing.find((v) => v.id === item.variantId);
    return total + (variant?.price ?? 0) * item.qty;
  }, 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    posthog.capture("begin_checkout", {
      item_count: items.length,
      subtotal,
    });

    try {
      const response = await fetch(PAGES.PHOTOGRAPHY.CHECKOUT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!response.ok) {
        const message = await response.text();
        // 400s carry a human-readable reason (eg. an out-of-stock variant).
        toast.error(
          response.status === 400 && message
            ? message
            : "Something went wrong starting checkout. Please try again.",
        );
        setIsCheckingOut(false);
        return;
      }
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Something went wrong starting checkout. Please try again.");
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-2xl px-4 py-12">
      <h1 className="mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <div>
          <p className="mb-4">Your cart is empty.</p>
          <CustomLink href={PAGES.PHOTOGRAPHY.HOME}>
            Browse photography
          </CustomLink>
        </div>
      ) : (
        <>
          <div>
            {items.map((item) => (
              <CartLineItem
                key={`${item.photoID}_${item.variantId}`}
                item={item}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-row items-center justify-between">
            <span className="font-medium">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <p className="caption mt-1">
            Shipping and taxes are calculated at checkout.
          </p>

          <Button
            variant="primary"
            className="mt-6 w-full"
            disabled={isCheckingOut}
            onClick={handleCheckout}
          >
            {isCheckingOut ? "Redirecting…" : "Checkout"}
          </Button>
        </>
      )}
    </main>
  );
}
