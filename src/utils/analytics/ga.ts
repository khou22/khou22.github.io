import { photoPricing, PhotoPriceVariant } from "@/constants/photoPricing";
import { CartItem } from "@/utils/cart/cartCookie";
import { castPhotoID, getPhotoName, PhotoIdType } from "@/utils/cdn/cdnAssets";
import { getPrintProduct } from "@/utils/printProduct";

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js" | "set",
      targetIdOrEventName: string | Date,
      params?: Record<string, unknown>,
    ) => void;
  }
}

export const GA_CURRENCY = "USD";
const MAX_ITEM_LIST_EVENT_ITEMS = 20;

/**
 * Standard GA4 ecommerce item payload.
 * https://developers.google.com/analytics/devguides/collection/ga4/reference/events
 */
export type GAEcommerceItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_category2?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
  index?: number;
  item_list_name?: string;
};

/**
 * Sends a GA4 event via `window.gtag`.
 *
 * Note: `@next/third-parties@14.1.0`'s `sendGAEvent` spreads arguments directly
 * into `window.dataLayer.push(...args)`, which GA4's gtag.js ignores (it expects
 * an `Arguments` object pushed by `gtag()`). Calling `window.gtag("event", ...)`
 * directly avoids that bug and safely no-ops in dev or when GA is blocked.
 */
export const sendGA4Event = (
  eventName: string,
  params?: Record<string, unknown>,
): void => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", eventName, params);
};

/**
 * Converts a photo + pricing variant into a standard GA4 ecommerce item.
 */
export const toGAPrintItem = (
  photoID: PhotoIdType,
  variant: PhotoPriceVariant,
  quantity = 1,
): GAEcommerceItem => {
  const product = getPrintProduct(photoID, variant);
  return {
    item_id: product.id,
    item_name: getPhotoName(photoID),
    item_category: "Photo Print",
    item_category2: variant.material,
    item_variant: variant.name,
    price: variant.price,
    quantity,
  };
};

/**
 * Converts cookie-backed cart items into GA4 ecommerce items and computes their
 * total value in USD.
 */
export const cartItemsToGAItems = (
  cartItems: CartItem[],
): { items: GAEcommerceItem[]; value: number } => {
  const items: GAEcommerceItem[] = [];
  let value = 0;

  for (const cartItem of cartItems) {
    const photoID = castPhotoID(cartItem.photoID);
    const variant = photoPricing.find((v) => v.id === cartItem.variantId);
    if (!photoID || !variant) continue;

    items.push(toGAPrintItem(photoID, variant, cartItem.qty));
    value += variant.price * cartItem.qty;
  }

  return { items, value };
};

/**
 * GA4 `view_item_list`: fired when a user views a photo gallery or search list.
 */
export const trackViewItemList = (
  photoIDs: PhotoIdType[],
  listName: string,
): void => {
  if (photoIDs.length === 0) return;

  const items: GAEcommerceItem[] = photoIDs
    .slice(0, MAX_ITEM_LIST_EVENT_ITEMS)
    .map((photoID, index) => ({
      item_id: photoID,
      item_name: getPhotoName(photoID),
      item_category: "Photo Print",
      item_list_name: listName,
      index,
    }));

  sendGA4Event("view_item_list", {
    item_list_name: listName,
    items,
  });
};

/**
 * GA4 `select_item`: fired when a user clicks a photo from a gallery to view
 * its product page.
 */
export const trackSelectItem = (
  photoID: PhotoIdType,
  listName?: string,
  index?: number,
): void => {
  const item: GAEcommerceItem = {
    item_id: photoID,
    item_name: getPhotoName(photoID),
    item_category: "Photo Print",
    ...(listName ? { item_list_name: listName } : {}),
    ...(index !== undefined ? { index } : {}),
  };

  sendGA4Event("select_item", {
    ...(listName ? { item_list_name: listName } : {}),
    items: [item],
  });
};

/**
 * GA4 `view_item`: fired when a user lands on a for-sale photo print page.
 */
export const trackViewItem = (
  photoID: PhotoIdType,
  variant: PhotoPriceVariant,
): void => {
  sendGA4Event("view_item", {
    currency: GA_CURRENCY,
    value: variant.price,
    items: [toGAPrintItem(photoID, variant, 1)],
  });
};

/**
 * Custom `select_print_variant`: fired when a user changes print material or
 * size on a photo product page.
 */
export const trackSelectPrintVariant = (
  photoID: PhotoIdType,
  variant: PhotoPriceVariant,
  selectionType: "material" | "size",
): void => {
  const product = getPrintProduct(photoID, variant);
  sendGA4Event("select_print_variant", {
    currency: GA_CURRENCY,
    value: variant.price,
    photo_id: photoID,
    item_id: product.id,
    item_name: getPhotoName(photoID),
    item_variant: variant.name,
    material: variant.material,
    selection_type: selectionType,
  });
};

/**
 * GA4 `add_to_cart`: fired when a print is added to the cart or its quantity is
 * incremented in the cart.
 */
export const trackAddToCart = (
  photoID: PhotoIdType,
  variant: PhotoPriceVariant,
  quantity = 1,
): void => {
  sendGA4Event("add_to_cart", {
    currency: GA_CURRENCY,
    value: variant.price * quantity,
    items: [toGAPrintItem(photoID, variant, quantity)],
  });
};

/**
 * GA4 `remove_from_cart`: fired when a print is removed from the cart or its
 * quantity is decremented in the cart.
 */
export const trackRemoveFromCart = (
  photoID: PhotoIdType,
  variant: PhotoPriceVariant,
  quantity = 1,
): void => {
  sendGA4Event("remove_from_cart", {
    currency: GA_CURRENCY,
    value: variant.price * quantity,
    items: [toGAPrintItem(photoID, variant, quantity)],
  });
};

/**
 * GA4 `view_cart`: fired once when the cart page hydrates.
 */
export const trackViewCart = (cartItems: CartItem[]): void => {
  const { items, value } = cartItemsToGAItems(cartItems);
  sendGA4Event("view_cart", {
    currency: GA_CURRENCY,
    value,
    items,
  });
};

/**
 * GA4 `begin_checkout`: fired when the user clicks Checkout to start a Stripe
 * Checkout session.
 */
export const trackBeginCheckout = (cartItems: CartItem[]): void => {
  const { items, value } = cartItemsToGAItems(cartItems);
  sendGA4Event("begin_checkout", {
    currency: GA_CURRENCY,
    value,
    items,
  });
};

/**
 * Custom `checkout_error`: fired when creating a Stripe Checkout session fails,
 * helping distinguish technical failures from organic checkout drop-offs.
 */
export const trackCheckoutError = (
  reason: string,
  cartItems: CartItem[],
): void => {
  const { items, value } = cartItemsToGAItems(cartItems);
  sendGA4Event("checkout_error", {
    currency: GA_CURRENCY,
    value,
    item_count: items.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
    error_reason: reason,
  });
};

/**
 * GA4 `purchase`: fired on the post-checkout success page when Stripe redirects
 * back with a `session_id`.
 */
export const trackPurchase = (
  transactionId: string,
  cartItems: CartItem[],
): void => {
  const { items, value } = cartItemsToGAItems(cartItems);
  sendGA4Event("purchase", {
    transaction_id: transactionId,
    currency: GA_CURRENCY,
    value,
    items,
  });
};

/**
 * GA4 `search`: fired when a user searches photography.
 */
export const trackSearch = (searchTerm: string): void => {
  const trimmed = searchTerm.trim();
  if (!trimmed) return;
  sendGA4Event("search", {
    search_term: trimmed,
  });
};
