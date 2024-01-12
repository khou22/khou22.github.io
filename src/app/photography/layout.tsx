import { CartButton } from "@/components/organisms/Snipcart/CartButton";

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
