import React from 'react';
import { render, act } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';

// Helper component to test the hook
const TestComponent = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  return (
    <div>
      <div data-testid="cart-count">{cart.length}</div>
      <button onClick={() => addToCart({ productId: 'p1', variantId: 'v1', quantity: 1 })} data-testid="add-item">Add Item</button>
      <button onClick={() => removeFromCart('p1', 'v1')} data-testid="remove-item">Remove Item</button>
      <button onClick={() => updateQuantity('p1', 'v1', 5)} data-testid="update-qty">Update Qty</button>
      <button onClick={() => clearCart()} data-testid="clear-cart">Clear Cart</button>
      <div data-testid="cart-items">{JSON.stringify(cart)}</div>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    // Clear cookies before each test
    document.cookie = 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });

  it('provides an empty cart by default', () => {
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    expect(getByTestId('cart-count').textContent).toBe('0');
  });

  it('adds an item to the cart', () => {
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      getByTestId('add-item').click();
    });

    expect(getByTestId('cart-count').textContent).toBe('1');
    const cartItems = JSON.parse(getByTestId('cart-items').textContent || '[]');
    expect(cartItems[0]).toEqual({ productId: 'p1', variantId: 'v1', quantity: 1 });
  });

  it('increments quantity when adding the same item', () => {
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      getByTestId('add-item').click();
      getByTestId('add-item').click();
    });

    expect(getByTestId('cart-count').textContent).toBe('1');
    const cartItems = JSON.parse(getByTestId('cart-items').textContent || '[]');
    expect(cartItems[0].quantity).toBe(2);
  });

  it('removes an item from the cart', () => {
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      getByTestId('add-item').click();
    });
    expect(getByTestId('cart-count').textContent).toBe('1');

    act(() => {
      getByTestId('remove-item').click();
    });
    expect(getByTestId('cart-count').textContent).toBe('0');
  });

  it('updates item quantity', () => {
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      getByTestId('add-item').click();
    });

    act(() => {
      getByTestId('update-qty').click();
    });

    const cartItems = JSON.parse(getByTestId('cart-items').textContent || '[]');
    expect(cartItems[0].quantity).toBe(5);
  });

  it('clears the cart', () => {
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      getByTestId('add-item').click();
    });

    act(() => {
      getByTestId('clear-cart').click();
    });

    expect(getByTestId('cart-count').textContent).toBe('0');
  });

  it('persists cart to cookies', () => {
    const { getByTestId, unmount } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      getByTestId('add-item').click();
    });

    // Unmount and remount to see if it loads from cookie
    unmount();

    const { getByTestId: getByTestId2 } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(getByTestId2('cart-count').textContent).toBe('1');
    const cartItems = JSON.parse(getByTestId2('cart-items').textContent || '[]');
    expect(cartItems[0].productId).toBe('p1');
  });
});
