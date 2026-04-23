'use client';

import Link from 'next/link';
import { PageWrapper } from '@/components/organisms/PageWrapper/PageWrapper';

export default function CancelContent() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[70vh] text-center fade-appear">
        <div className="mb-6 rounded-full bg-gray-100 p-4">
          <svg
            className="h-12 w-12 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Checkout Canceled
        </h1>
        <p className="mb-8 max-w-md text-lg text-gray-600">
          Your checkout process was canceled. No charges were made. Your cart is still waiting for you!
        </p>
        <Link
          href="/photography"
          className="rounded-full bg-black px-10 py-4 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all"
        >
          Return to Store
        </Link>
      </div>
    </PageWrapper>
  );
}
