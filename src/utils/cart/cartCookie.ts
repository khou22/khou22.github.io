import { photoPricing } from "@/constants/photoPricing";
import { isPhotoID } from "@/utils/cdn/cdnAssets";

/**
 * A single cart entry. Intentionally minimal — prices are never stored
 * client-side; the server re-derives them from `photoPricing` at checkout.
 */
export type CartItem = {
  photoID: string;
  variantId: string;
  qty: number;
};

const CART_COOKIE_NAME = "khou_cart";
const CART_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

/**
 * Maximum quantity per line item. Mirrored server-side in /api/checkout.
 */
export const MAX_ITEM_QTY = 20;

const isValidCartItem = (item: unknown): item is CartItem => {
  if (typeof item !== "object" || item === null) return false;
  const { photoID, variantId, qty } = item as Record<string, unknown>;
  return (
    typeof photoID === "string" &&
    isPhotoID(photoID) &&
    typeof variantId === "string" &&
    photoPricing.some((variant) => variant.id === variantId) &&
    typeof qty === "number" &&
    Number.isInteger(qty) &&
    qty > 0
  );
};

/**
 * Read the cart from the browser cookie. Invalid or stale entries (eg. a
 * variant that no longer exists) are silently dropped. Client-side only.
 */
export const readCartCookie = (): CartItem[] => {
  if (typeof document === "undefined") return [];

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CART_COOKIE_NAME}=`));
  if (!cookie) return [];

  try {
    const parsed = JSON.parse(
      decodeURIComponent(cookie.slice(CART_COOKIE_NAME.length + 1)),
    );
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(isValidCartItem)
      .map((item) => ({ ...item, qty: Math.min(item.qty, MAX_ITEM_QTY) }));
  } catch {
    return [];
  }
};

/**
 * Persist the cart to the browser cookie. Client-side only.
 */
export const writeCartCookie = (items: CartItem[]) => {
  if (typeof document === "undefined") return;

  // `secure` everywhere except plain-http local dev (Safari rejects Secure
  // cookies on http://localhost).
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${CART_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(items),
  )}; path=/; max-age=${CART_COOKIE_MAX_AGE_SECONDS}; samesite=lax${secure}`;
};
