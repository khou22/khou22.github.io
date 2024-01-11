/* eslint-disable @next/next/no-css-tags */
import Script from "next/script";
import { ShoppingCartIcon } from "@/components/icons/ShoppingCartIcon/ShoppingCartIcon";

/**
 * Contains logic neccessary for instantiating Snipcart cart management. Does not render anything
 * visible.
 */
export const Snipcart = () => {
  return (
    <>
      <link rel="preconnect" href="<https://app.snipcart.com>" />
      <link rel="preconnect" href="<https://cdn.snipcart.com>" />
      <link
        rel="stylesheet"
        href="https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.css"
      />
      <Script src="https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.js" />
      <div
        hidden
        id="snipcart"
        data-api-key={process.env.NEXT_PUBLIC_SNIPCART_PUBLIC_KEY}
      />

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
    </>
  );
};
