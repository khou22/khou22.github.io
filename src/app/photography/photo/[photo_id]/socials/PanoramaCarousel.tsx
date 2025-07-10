import React from "react";
import { PanoramaCarouselClient } from "./PanoramaCarouselClient";
import { getPhotoName, PhotoIdType } from "@/utils/cdn/cdnAssets";
import { getPhotoSize } from "@/utils/photos/getPhotoSize";
import { INSTAGRAM_CAROUSEL_SIZE } from "@/constants/contentMetadata";
import { SocialMediaImageFrame } from "@/components/organisms/SocialMediaImageFrame/SocialMediaImageFrame";

type PanoramaPostContentProps = {
  photoID: PhotoIdType;
};

export const PanoramaPostContent: React.FC<PanoramaPostContentProps> = async ({
  photoID,
}) => {
  const size = await getPhotoSize(photoID);
  const photoName = await getPhotoName(photoID);

  if (!size.width || !size.height) return <p>Error: No size for photo</p>;

  const normalizedNumCarouselImages =
    size.width /
    size.height /
    (INSTAGRAM_CAROUSEL_SIZE.width / INSTAGRAM_CAROUSEL_SIZE.height);
  const numCarouselImages = Math.ceil(normalizedNumCarouselImages);

  const imagePreviewHeight = "h-[600px] max-h-[600px]";

  return (
    <div className="grid w-full grid-cols-2 gap-2">
      <div className="space-y-4">
        <PanoramaCarouselClient
          photoID={photoID}
          imageClassName={imagePreviewHeight}
          photoSize={size}
        />

        <p>Num images: {normalizedNumCarouselImages.toFixed(2)}</p>
      </div>

      <SocialMediaImageFrame
        photoID={photoID}
        imageClassName={imagePreviewHeight}
      />
    </div>
  );
};
