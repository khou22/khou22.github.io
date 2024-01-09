/* eslint-disable @next/next/no-css-tags */
import Script from "next/script";

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
    </>
  );
};
