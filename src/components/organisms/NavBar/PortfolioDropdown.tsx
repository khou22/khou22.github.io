import { ImageCard } from "@/components/molecules/ImageCard/ImageCard";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import React from "react";

export const PortfolioDropdown: React.FC = () => {
  return (
    <div className="mx-auto grid max-w-screen-xl gap-4 px-4 py-5 text-gray-900 sm:grid-cols-2 md:px-6">
      <ImageCard
        title="Woodworking"
        description="Physical craftsmanship"
        link={PAGES.WOOD}
        imageSrc={getCdnAsset(
          "media/site/images/backgrounds/Turning_California_Bay_Laurel_Burl_Wood_Bowl_jpg",
        )}
        containerClassName="w-full h-full min-h-[100px] rounded-lg"
        contentClassName="p-4"
      />
      <ImageCard
        title="Photography"
        description="Optical craftsmanship"
        link={PAGES.PHOTOGRAPHY}
        imageSrc={getCdnAsset(
          "media/site/images/backgrounds/Turning_California_Bay_Laurel_Burl_Wood_Bowl_jpg",
        )}
        containerClassName="w-full h-full min-h-[100px] rounded-lg"
        contentClassName="p-4"
      />
      <ImageCard
        title="Programming"
        description="Digitial craftsmanship"
        link={PAGES.PROGRAMMING}
        imageSrc={getCdnAsset(
          "media/site/images/backgrounds/Turning_California_Bay_Laurel_Burl_Wood_Bowl_jpg",
        )}
        containerClassName="w-full h-full min-h-[100px] rounded-lg"
        contentClassName="p-4"
      />
      <ImageCard
        title="Woodworking"
        description="Physical craftsmanship"
        link={PAGES.WOOD}
        imageSrc={getCdnAsset(
          "media/site/images/backgrounds/Turning_California_Bay_Laurel_Burl_Wood_Bowl_jpg",
        )}
        containerClassName="w-full h-full min-h-[100px] rounded-lg"
        contentClassName="p-4"
      />
    </div>
  );
};
