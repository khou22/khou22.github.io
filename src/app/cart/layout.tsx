import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Kevin Hou Photography",
  description:
    "Review your selected photo prints and proceed to checkout.",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
