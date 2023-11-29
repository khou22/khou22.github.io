import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { siteMetadata } from "@/constants/siteMetadata";
import { NavBar } from "@/components/organisms/NavBar/NavBar";
import { Footer } from "@/components/organisms/Footer/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

/**
 * The metadata for the site. Pages that inherit this RootLayout will have
 * this metadata applied to them.
 */
export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  authors: {
    name: siteMetadata.author,
    url: siteMetadata.siteUrl,
  },
  metadataBase: new URL(siteMetadata.siteUrl),
  twitter: {
    site: siteMetadata.siteUrl,
    siteId: "khou22.com",
    creator: siteMetadata.author,
    creatorId: "@kevinhou22",
    description: siteMetadata.description,
    title: siteMetadata.title,
    card: "summary_large_image",
    images: [
      {
        url: siteMetadata.previewCard.url,
        alt: siteMetadata.title,
        type: "image/jpeg",
        width: siteMetadata.previewCard.width,
        height: siteMetadata.previewCard.height,
      },
    ],
  },
  openGraph: {
    images: [
      {
        url: siteMetadata.previewCard.url,
        alt: siteMetadata.title,
        type: "image/jpeg",
        width: siteMetadata.previewCard.width,
        height: siteMetadata.previewCard.height,
      },
    ],
  },
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
        <Footer />
      </body>
    </html>
  );
}
