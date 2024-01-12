import { ShoppingCartIcon } from "@/components/icons/ShoppingCartIcon/ShoppingCartIcon";

export const CartButton = () => {
  return (
    <div className="fixed bottom-2 right-2 z-20 animate-overlay-show duration-500 delay-1000 fill-mode-forwards md:bottom-4 md:right-4">
      <button
        className="snipcart-checkout aspect-square rounded-full bg-blue-500 p-4 text-slate-100 shadow hover:bg-blue-400"
        aria-label="View cart"
        title="View cart"
      >
        <ShoppingCartIcon className="h-5 w-5 lg:h-6 lg:w-6" />
      </button>

      {/* Hidden Metadata (could remove, no real use) */}
      <span className="snipcart-items-count hidden" />
      <span className="snipcart-total-price hidden" />
    </div>
  );
};
