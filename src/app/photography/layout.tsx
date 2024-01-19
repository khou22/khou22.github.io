import { Metadata } from "next";
import { CartButton } from "@/components/organisms/Snipcart/CartButton";
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
      {children}
    </>
  );
}
