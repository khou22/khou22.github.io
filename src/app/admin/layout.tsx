import { notFound } from "next/navigation";

import { Toaster } from "@/components/ui/sonner";

/**
 * Nested layout for all /admin routes. Protected by env `development` check.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
