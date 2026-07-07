"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  CartItem,
  MAX_ITEM_QTY,
  readCartCookie,
  writeCartCookie,
} from "@/utils/cart/cartCookie";

type CartContextValue = {
  items: CartItem[];
  /**
   * Total number of prints across all line items.
   */
  count: number;
  addItem: (photoID: string, variantId: string) => void;
  setQty: (photoID: string, variantId: string, qty: number) => void;
  removeItem: (photoID: string, variantId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Client-side cart state backed by a cookie. Stores only
 * `{photoID, variantId, qty}` — prices are always re-derived server-side.
 * State is hydrated from the cookie after mount to avoid SSR mismatches.
 */
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCartCookie());
  }, []);

  const update = useCallback((next: CartItem[]) => {
    setItems(next);
    writeCartCookie(next);
  }, []);

  const addItem = useCallback(
    (photoID: string, variantId: string) => {
      const current = readCartCookie();
      const existing = current.find(
        (item) => item.photoID === photoID && item.variantId === variantId,
      );
      if (existing) {
        existing.qty = Math.min(existing.qty + 1, MAX_ITEM_QTY);
        update([...current]);
      } else {
        update([...current, { photoID, variantId, qty: 1 }]);
      }
    },
    [update],
  );

  const setQty = useCallback(
    (photoID: string, variantId: string, qty: number) => {
      const clamped = Math.min(Math.max(1, Math.round(qty)), MAX_ITEM_QTY);
      update(
        readCartCookie().map((item) =>
          item.photoID === photoID && item.variantId === variantId
            ? { ...item, qty: clamped }
            : item,
        ),
      );
    },
    [update],
  );

  const removeItem = useCallback(
    (photoID: string, variantId: string) => {
      update(
        readCartCookie().filter(
          (item) => !(item.photoID === photoID && item.variantId === variantId),
        ),
      );
    },
    [update],
  );

  const clearCart = useCallback(() => update([]), [update]);

  const count = items.reduce((total, item) => total + item.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, count, addItem, setQty, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
