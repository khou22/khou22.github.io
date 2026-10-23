"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { ShoppingCartIcon } from "@/components/icons/ShoppingCartIcon/ShoppingCartIcon";
import { PAGES } from "@/utils/pages";

/**
 * Floating cart button shown on photography pages. Links to the cart page and
 * shows a badge with the number of items in the cart.
 */
export const CartButton = () => {
  const { count } = useCart();

  return (
    <div className="fixed bottom-2 right-2 z-20 animate-overlay-show duration-500 delay-1000 fill-mode-forwards md:bottom-4 md:right-4">
      <Link
        href={PAGES.PHOTOGRAPHY.CART}
        className="relative block aspect-square rounded-full bg-blue-500 p-4 text-slate-100 shadow hover:bg-blue-400"
        aria-label="View cart"
        title="View cart"
      >
        <ShoppingCartIcon className="h-5 w-5 lg:h-6 lg:w-6" />
        {count > 0 && (
          <span className="min-w-5 absolute -right-1 -top-1 flex h-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
            {count}
          </span>
        )}
      </Link>
    </div>
  );
};
