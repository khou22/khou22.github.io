import { Metadata } from "next";
import { CartButton } from "@/components/organisms/Cart/CartButton";
import { CartProvider } from "@/components/organisms/Cart/CartProvider";
import { Toaster } from "@/components/ui/sonner";
import { siteMetadata } from "@/constants/siteMetadata";

export const metadata: Metadata = {
  title: "Kevin Hou Photography | Portfolio & Store",
  description: siteMetadata.photographyDescription,
};

export default function PhotographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <CartButton />
      {children}
      <Toaster />
    </CartProvider>
  );
}
