"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { PAGES } from "@/utils/pages";
import { CheckCircleIcon } from "@/components/icons/CheckCircleIcon/CheckCircleIcon";

const SuccessPage = () => {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <PageWrapper>
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-6 text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-500" />
        <div>
          <h1>Order Successful!</h1>
          <p className="text-gray-600 mt-2">
            Thank you for your purchase. You will receive an email confirmation shortly.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={PAGES.PHOTOGRAPHY.HOME}>
            <Button variant="primary">Browse More Photos</Button>
          </Link>
          <Link href={PAGES.HOME}>
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SuccessPage;
