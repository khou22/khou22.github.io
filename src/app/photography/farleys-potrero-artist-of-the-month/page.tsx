import Link from "next/link";
import { Metadata } from "next/types";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { PAGES } from "@/utils/pages";
import { PhotoGallery } from "@/components/organisms/PhotoGallery/PhotoGallery";
import { siteMetadata } from "@/constants/siteMetadata";
import { ogImageSize } from "@/constants/ogImage";

const title = "Farley's Potrero Artist of the Month | Kevin Hou";
const coverImage =
  "https://khou22.com/media/photography/farleys/farleys_preview_card.png";
export const metadata: Metadata = {
  title,
  description:
    "I had the opportunity to showcase my artwork at Farley's coffee shop in Potrero Hill, San Francisco during the month of August 2024. As artist of the month, I put up 6 metal prints of shots taken around the Bay Area as well as photo labels & a bio.",
  twitter: {
    site: siteMetadata.siteUrl,
    siteId: "khou22.com",
    creator: siteMetadata.author,
    creatorId: "@kevinhou22",
    description: siteMetadata.description,
    title,
    card: "summary_large_image",
    images: [
      {
        url: coverImage,
        alt: title,
        type: "image/png",
        width: ogImageSize.width,
        height: ogImageSize.height,
      },
    ],
  },
  openGraph: {
    images: [
      {
        url: coverImage,
        alt: title,
        type: "image/png",
        width: ogImageSize.width,
        height: ogImageSize.height,
      },
    ],
  },
};

const FarleysPotreroFeaturedPage = () => {
  return (
    <PageWrapper>
      <Link href="https://farleyscoffee.com" target="_blank">
        <img
          alt="Farley's Potrero Hill Coffee Shop"
          src={getCdnAsset("media/photography/farleys/farleys_logo_png")}
          width={200}
          height={200}
          className="mb-6 object-contain md:mb-10"
        />
      </Link>
      <div className="space-y-3">
        <p>
          Farley&#39;s coffee shop is one of my favorite coffee shops in San
          Francisco. I applied for their artist of the month and was grateful to
          be accepted for the month of August 2024. It has been a goal of mine
          to showcase my work publicly, in print format. A lot is lost in the
          minature screens that social media has forced my photos to be confined
          to.
        </p>
        <p>
          I put up 6 metal prints (aluminum, glossy finish) of shots taken
          around the Bay Area as well as photo labels & a bio. My artwork is
          available for purchase at a discount using the QR codes I posted below
          each photos. The exact material and prints are all available on my{" "}
          <CustomLink href={PAGES.PHOTOGRAPHY.HOME} target="_blank" underline>
            photography store
          </CustomLink>
          .
        </p>
        <p>
          Farley&#39;s Coffee Shop is located at{" "}
          <CustomLink
            href="https://maps.app.goo.gl/RtkL9FSHi5izu8u66"
            target="_blank"
            underline
          >
            1315 18th St, San Francisco, CA 94107
          </CustomLink>
          .
        </p>
      </div>
      <div className="my-8 grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="relative col-span-2 aspect-[4/5] w-full">
          <img
            src={getCdnAsset("media/photography/farleys/portrait_jpg")}
            alt="Farley's Potrero Hill Coffee Shop portrait of Kevin Hou (Artist of the Month, August 2024)"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative col-span-1 flex flex-col gap-4">
          <img
            src={getCdnAsset("media/photography/farleys/interior_jpg")}
            alt="Farley's Potrero Hill Coffee Shop interior with photos by Kevin Hou (Artist of the Month, August 2024)"
            className="aspect-square w-full object-cover"
          />
          <img
            src={getCdnAsset("media/photography/farleys/reading_window_jpg")}
            alt="Farley's Potrero Hill Coffee Shop reading window with photos by Kevin Hou (Artist of the Month, August 2024)"
            className="w-full grow object-cover"
          />
        </div>
        <div className="relative col-span-1 sm:aspect-[4/5]">
          <img
            src={getCdnAsset(
              "media/photography/farleys/golden_gate_satellite_jpg",
            )}
            alt="Golden Gate Park by Kevin Hou (Farley's Artist of the Month, August 2024)"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative col-span-1 aspect-[4/5]">
          <img
            src={getCdnAsset("media/photography/farleys/ocean_beach_jpg")}
            alt="Ocean Beach at Sunset by Kevin Hou (Farley's Artist of the Month, August 2024)"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative col-span-1 aspect-[4/5]">
          <img
            src={getCdnAsset("media/photography/farleys/exterior_jpg")}
            alt="Farley's exterior with photos by Kevin Hou (Farley's Artist of the Month, August 2024)"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="my-6">
        <h2>Prints Featured at Farley&#39;s</h2>
        <PhotoGallery
          photoIDs={[
            "photography/San_Francisco_Golden_Gate_Park_Satellite_Shot_jpg",
            "photography/san_francisco/Ocean_Beach_at_Sunset_jpg",
            "photography/Aerial_View_of_Half_Moon_Bay_Beach_jpg",
            "photography/Twin_Peaks_Biker_Going_Down_U_Bend_jpg",
            "photography/Downtown_San_Francisco_Birds_Eye_View_Top_Down_Powell_Street_Intersection_Drone_jpg",
            "photography/san_francisco/San_Francisco_Powell_Street_Cable_Car_Trolly_jpg",
          ]}
        />
      </div>
    </PageWrapper>
  );
};

export default FarleysPotreroFeaturedPage;
