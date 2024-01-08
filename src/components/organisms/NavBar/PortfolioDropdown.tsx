import Link from "next/link";
import React from "react";
import { ImageCard } from "@/components/molecules/ImageCard/ImageCard";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";

export const PortfolioDropdown: React.FC = () => {
  return (
    <div className="mx-auto grid max-w-screen-xl gap-4 px-4 py-5 text-gray-900 sm:grid-cols-2 md:px-6">
      <Link href={PAGES.PROGRAMMING}>
        <ImageCard
          title="Programming"
          description="Digital craftsmanship"
          imageSrc={getCdnAsset("media/site/images/programming_image_jpg")}
          containerClassName="w-full h-full min-h-[100px] rounded-lg"
          contentClassName="p-4"
        />
      </Link>
      <Link href={PAGES.PHOTOGRAPHY.HOME}>
        <ImageCard
          title="Photography"
          description="Optical craftsmanship"
          imageSrc={getCdnAsset(
            "photography/Halong_Bay_Sunset_Panorama_placeholder_jpg",
          )}
          containerClassName="w-full h-full min-h-[100px] rounded-lg"
          contentClassName="p-4"
        />
      </Link>
      <Link href={PAGES.WOOD}>
        <ImageCard
          title="Woodworking"
          description="Physical craftsmanship"
          imageSrc={getCdnAsset(
            "media/site/images/backgrounds/Turning_California_Bay_Laurel_Burl_Wood_Bowl_jpg",
          )}
          containerClassName="w-full h-full min-h-[100px] rounded-lg"
          contentClassName="p-4"
        />
      </Link>
      <Link href={PAGES.DESIGN}>
        <ImageCard
          title="Design"
          description="Creative craftsmanship"
          imageSrc={getCdnAsset("media/site/images/design_image_jpg")}
          containerClassName="w-full h-full min-h-[100px] rounded-lg"
          contentClassName="p-4"
        />
      </Link>
    </div>
  );
};
