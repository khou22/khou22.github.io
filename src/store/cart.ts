import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PhotoIdType } from "@/utils/cdn/cdnAssets";

export interface CartItem {
  id: string; // photoID__variantID
  photoID: PhotoIdType;
  variantID: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === newItem.id);
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...newItem, quantity: 1 }] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
);

// Helper selectors
export const selectTotalItems = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export const selectTotalPrice = (state: CartState) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0);
