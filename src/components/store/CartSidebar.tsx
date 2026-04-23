'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { useCart } from './CartContext';
import { XIcon } from '@/components/icons/XIcon/XIcon';
import { ShoppingCartIcon } from '@/components/icons/ShoppingCartIcon/ShoppingCartIcon';

interface HydratedCartItem {
  productId: string;
  variantId: string;
  quantity: number;
  name: string;
  variantName: string;
  price: number;
  image: string;
}

export const CartSidebar = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();
  const [hydratedItems, setHydratedItems] = useState<HydratedCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isCartOpen && cart.length > 0) {
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/cart/details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart }),
          });
          const data = await response.json();
          setHydratedItems(data.items);
        } catch (error) {
          console.error('Failed to fetch cart details', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    } else if (cart.length === 0) {
      setHydratedItems([]);
    }
  }, [isCartOpen, cart]);

  const subtotal = hydratedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            photoID: item.productId,
            variantID: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session', data.error);
      }
    } catch (error) {
      console.error('Checkout failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition.Root show={isCartOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsCartOpen}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 outline-none"
                            onClick={() => setIsCartOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {hydratedItems.length === 0 && !isLoading ? (
                              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <ShoppingCartIcon className="h-12 w-12 text-gray-300 mb-4" />
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is currently empty</h2>
                                <p className="text-gray-500 mb-8 max-w-xs">Looks like you haven&apos;t added anything to your cart yet.</p>
                                <button
                                  type="button"
                                  onClick={() => setIsCartOpen(false)}
                                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                                >
                                  Continue Shopping
                                </button>
                              </div>
                            ) : (
                              hydratedItems.map((item) => (
                                <li key={`${item.productId}-${item.variantId}`} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      className="object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>{item.name}</h3>
                                        <p className="ml-4">${item.price.toFixed(2)}</p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">{item.variantName}</p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center space-x-2">
                                        <label htmlFor={`quantity-${item.productId}-${item.variantId}`} className="text-gray-500">
                                          Qty
                                        </label>
                                        <select
                                          id={`quantity-${item.productId}-${item.variantId}`}
                                          value={item.quantity}
                                          onChange={(e) => updateQuantity(item.productId, item.variantId, parseInt(e.target.value))}
                                          className="rounded-md border-gray-300 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
                                            <option key={q} value={q}>
                                              {q}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          onClick={() => removeFromCart(item.productId, item.variantId)}
                                          className="font-medium text-blue-600 hover:text-blue-500"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${subtotal.toFixed(2)}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Shipping, taxes, and promo codes applied at checkout.</p>
                      <div className="mt-6">
                        <button
                          onClick={handleCheckout}
                          disabled={hydratedItems.length === 0 || isLoading}
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          Checkout
                        </button>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="font-medium text-blue-600 hover:text-blue-500"
                            onClick={() => setIsCartOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
