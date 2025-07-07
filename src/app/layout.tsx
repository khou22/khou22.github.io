import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { HydrationOverlay } from "@builder.io/react-hydration-overlay";
import { Cutive_Mono, Montserrat, Mulish } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { Snipcart } from "../components/organisms/Snipcart/Snipcart";
import { PHProvider } from "./providers";
import { siteMetadata } from "@/constants/siteMetadata";
import { NavBar } from "@/components/organisms/NavBar/NavBar";
import { Footer } from "@/components/organisms/Footer/Footer";
import { classNames } from "@/utils/style";

const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
  ssr: false,
});

const headerFont = Mulish({
  subsets: ["latin"],
  weight: ["400", "900"],
  variable: "--font-header",
});

const bodyFont = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-default",
});

const monoFont = Cutive_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
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
  const gaID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  const isDev = process.env.NODE_ENV !== "production";
  return (
    <html lang="en">
      <PHProvider>
        <body
          className={classNames(
            bodyFont.variable,
            headerFont.variable,
            monoFont.variable,
            "bg-gray-50",
          )}
        >
          <PostHogPageView />
          <Snipcart />
          {isDev ? (
            <HydrationOverlay>
              <NavBar />
              {children}
              <Footer />
            </HydrationOverlay>
          ) : (
            <>
              <NavBar />
              {children}
              <Footer />
            </>
          )}
          {gaID && !isDev && <GoogleAnalytics gaId={gaID} />}
        </body>
      </PHProvider>
    </html>
  );
}
