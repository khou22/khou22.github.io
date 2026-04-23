"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { PAGES } from "@/utils/pages";
import { CheckCircleIcon } from "@/components/icons/CheckCircleIcon/CheckCircleIcon";
import { getSessionDetails } from "./actions";

interface SessionData {
  amount: number;
  currency: string;
  customer_email: string;
  items: {
    name: string;
    quantity: number;
    amount: number;
  }[];
}

const SuccessContent = () => {
  const clearCart = useCartStore((state) => state.clearCart);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const data = await getSessionDetails(sessionId);
        setSessionData(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching session details");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center py-12">
      <CheckCircleIcon className="h-16 w-16 text-green-500" />
      <div>
        <h1>Order Successful!</h1>
        <p className="text-gray-600 mt-2">
          Thank you for your purchase. You will receive an email confirmation shortly.
        </p>
      </div>

      {loading && <p>Loading order details...</p>}
      
      {error && (
        <p className="text-red-500">Could not load order details, but your purchase was successful.</p>
      )}

      {sessionData && (
        <div className="w-full max-w-md bg-white border rounded-lg p-6 text-left space-y-4">
          <h4 className="font-medium">Order Summary</h4>
          <div className="text-sm text-gray-500">
            <p>Customer: {sessionData.customer_email}</p>
            <p>Total: ${(sessionData.amount / 100).toFixed(2)} {sessionData.currency.toUpperCase()}</p>
          </div>
          <div className="border-t pt-4 space-y-2">
            {sessionData.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.amount / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={PAGES.PHOTOGRAPHY.HOME}>
          <Button variant="primary">Browse More Photos</Button>
        </Link>
        <Link href={PAGES.HOME}>
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <PageWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </PageWrapper>
  );
};

export default SuccessPage;
