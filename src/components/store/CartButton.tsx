'use client';

import { useCart } from "./CartContext";
import { ShoppingCartIcon } from "@/components/icons/ShoppingCartIcon/ShoppingCartIcon";

export const CartButton = () => {
  const { cart, toggleCart, isCartLoaded } = useCart();
  
  if (!isCartLoaded) return null;

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed bottom-2 right-2 z-20 animate-overlay-show duration-500 delay-1000 fill-mode-forwards md:bottom-4 md:right-4">
      <button
        className="aspect-square rounded-full bg-blue-500 p-4 text-slate-100 shadow hover:bg-blue-400 relative"
        aria-label="View cart"
        title="View cart"
        onClick={toggleCart}
      >
        <ShoppingCartIcon className="h-5 w-5 lg:h-6 lg:w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center border-2 border-white">
            {itemCount}
          </span>
        )}
      </button>
    </div>
  );
};
