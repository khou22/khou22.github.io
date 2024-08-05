/* eslint-disable @next/next/no-css-tags */
import Script from "next/script";

import "./snipcart.css";
import { getSnipcartPublicKey } from "@/utils/getSnipcartPublicKey";

/**
 * Contains logic neccessary for instantiating Snipcart cart management. Does not render anything
 * visible (see `CartButton` for that). There was an issue with mounting and unmounting this
 * component in the nested PhotographyLayout. Consequently, it is now included on all pages.
 */
export const Snipcart = () => {
  const snipcartKey = getSnipcartPublicKey();
  return (
    <div suppressHydrationWarning>
      <link rel="preconnect" href="<https://app.snipcart.com>" />
      <link rel="preconnect" href="<https://cdn.snipcart.com>" />
      <link
        rel="stylesheet"
        href="https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.css"
      />
      <Script src="https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.js" />
      <div hidden id="snipcart" data-api-key={snipcartKey} />
    </div>
  );
};
