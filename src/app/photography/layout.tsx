import { Metadata } from "next";
import { CartButton } from "@/components/store/CartButton";
import { CartSidebar } from "@/components/store/CartSidebar";
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
    <>
      <CartButton />
      <CartSidebar />
      {children}
    </>
  );
}
