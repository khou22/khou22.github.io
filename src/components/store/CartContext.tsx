'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  isCartLoaded: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const COOKIE_NAME = 'cart';

const getCartFromCookie = (): CartItem[] => {
  if (typeof document === 'undefined') return [];
  const name = COOKIE_NAME + '=' + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(COOKIE_NAME + '=') === 0) {
      try {
        const cartData = JSON.parse(c.substring(COOKIE_NAME.length + 1, c.length));
        if (Array.isArray(cartData)) {
          return cartData;
        }
        return [];
      } catch (e) {
        console.error('Failed to parse cart cookie', e);
        return [];
      }
    }
  }
  return [];
};

const setCartToCookie = (cart: CartItem[]) => {
  if (typeof document === 'undefined') return;
  const d = new Date();
  d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
  const expires = 'expires=' + d.toUTCString();
  document.cookie = COOKIE_NAME + '=' + JSON.stringify(cart) + ';' + expires + ';path=/;SameSite=Strict';
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from cookie on mount
  useEffect(() => {
    const savedCart = getCartFromCookie();
    setCart(savedCart);
    setIsCartLoaded(true);
  }, []);

  // Update cookie whenever cart changes
  useEffect(() => {
    if (isCartLoaded) {
      setCartToCookie(cart);
    }
  }, [cart, isCartLoaded]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        const existingItem = newCart[existingItemIndex];
        newCart[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity,
        };
        return newCart;
      }

      return [...prevCart, item];
    });
    setIsCartOpen(true); // Open cart when item is added
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart((prevCart) =>
      prevCart.filter((i) => !(i.productId === productId && i.variantId === variantId))
    );
  };

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((i) =>
        i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartLoaded,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
