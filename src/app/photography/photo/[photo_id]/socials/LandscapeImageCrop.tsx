import React from "react";
import { Aboreto } from "next/font/google";
import { getCdnAsset, getPhotoName, PhotoIdType } from "@/utils/cdn/cdnAssets";
import { INSTAGRAM_CAROUSEL_SIZE } from "@/constants/contentMetadata";
import { classNames } from "@/utils/style";

const captionFont = Aboreto({
  subsets: ["latin"],
  weight: "400",
});

type LandscapeImageCropProps = {
  photoID: PhotoIdType;
  className?: string;
};

export const LandscapeImageCrop: React.FC<LandscapeImageCropProps> = async ({
  photoID,
  className,
}) => {
  const photoName = await getPhotoName(photoID);

  return (
    <div
      className={classNames("relative overflow-scroll bg-white", className)}
      style={{
        aspectRatio:
          INSTAGRAM_CAROUSEL_SIZE.width / INSTAGRAM_CAROUSEL_SIZE.height,
      }}
    >
      <div
        className={classNames(
          "absolute left-0 top-0 z-10 flex h-full w-full",
          "flex-col items-center justify-center space-y-2 p-2",
        )}
      >
        <img
          alt="preview image full"
          src={getCdnAsset(photoID)}
          className="w-full"
        />

        <div
          className={classNames(
            "w-full text-center text-xs",
            captionFont.className,
          )}
        >
          <p>{photoName.toUpperCase()}</p>
          <p>July 1, 2025</p>
        </div>
      </div>

      <img
        alt="preview image full background"
        src={getCdnAsset(photoID)}
        className="absolute left-1/2 top-1/2 z-0 h-full -translate-x-1/2 -translate-y-1/2 scale-110 object-cover opacity-80 blur-md"
      />
    </div>
  );
};
