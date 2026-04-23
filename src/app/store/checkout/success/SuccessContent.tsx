'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/store/CartContext';
import { PageWrapper } from '@/components/organisms/PageWrapper/PageWrapper';

export default function SuccessContent() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[70vh] text-center fade-appear">
        <div className="mb-6 rounded-full bg-green-100 p-4">
          <svg
            className="h-12 w-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Order Confirmed!
        </h1>
        <p className="mb-8 max-w-md text-lg text-gray-600">
          Thank you for your purchase. We&apos;ve received your order and will process it shortly. 
          Check your email for a receipt from Stripe.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/photography"
            className="rounded-full bg-black px-10 py-4 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="rounded-full px-10 py-4 text-sm font-semibold text-gray-900 border border-gray-300 hover:bg-gray-50 transition-all"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
