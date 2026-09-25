"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { sendGTMEvent } from "@next/third-parties/google";
import { usePostHog } from "posthog-js/react";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { useCartStore, selectTotalPrice } from "@/store/cart";
import { useIsClient } from "@/hooks/useIsClient/useIsClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PAGES } from "@/utils/pages";

const CartPage = () => {
  const isClient = useIsClient();
  const posthog = usePostHog();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const totalPrice = useCartStore(selectTotalPrice);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsCheckingOut(true);

    // Track checkout initiation across all analytics systems
    const analyticsPayload = {
      total_price: totalPrice,
      item_count: items.length,
      items: items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };
    posthog.capture("checkout_initiated", analyticsPayload);
    sendGTMEvent({ event: "checkout_initiated", ...analyticsPayload });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsCheckingOut(false);
    }
  };

  if (!isClient) {
    return (
      <PageWrapper>
        <div className="w-full h-96 flex items-center justify-center">
          <p>Loading cart...</p>
        </div>
      </PageWrapper>
    );
  }

  if (items.length === 0) {
    return (
      <PageWrapper>
        <div className="w-full h-96 flex flex-col items-center justify-center space-y-4">
          <h2>Your cart is empty</h2>
          <p className="text-gray-500 text-center">Looks like you haven&apos;t added any prints to your cart yet.</p>
          <Link href={PAGES.PHOTOGRAPHY.HOME}>
            <Button>Browse Photography</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <h1 className="mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-32 h-32 bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">Price: ${item.price}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          <Button variant="ghost" onClick={clearCart} className="text-gray-500 mt-4">
            Clear Cart
          </Button>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="primary"
                className="w-full"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Redirecting to Stripe..." : "Checkout"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CartPage;
