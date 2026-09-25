import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed | Kevin Hou Photography",
  description:
    "Thank you for your purchase! Your order has been confirmed.",
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
