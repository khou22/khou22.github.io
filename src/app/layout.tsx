import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { siteMetadata } from "@/constants/siteMetadata";
import { NavBar } from "@/components/organisms/NavBar/NavBar";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
