import { Toaster } from "@/components/ui/sonner";

/**
 * Nested layout for all /tools routes.
 */
export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
