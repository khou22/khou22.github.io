import React from "react";
import { Aboreto } from "next/font/google";
import { getCdnAsset, getPhotoName, PhotoIdType } from "@/utils/cdn/cdnAssets";
import { getPhotoSize } from "@/utils/photos/getPhotoSize";
import { INSTAGRAM_CAROUSEL_SIZE } from "@/constants/contentMetadata";
import { classNames } from "@/utils/style";
import { SocialMediaImageFrame } from "@/components/organisms/SocialMediaImageFrame/SocialMediaImageFrame";

const captionFont = Aboreto({
  subsets: ["latin"],
  weight: "400",
});

type PanoramaCarouselProps = {
  photoID: PhotoIdType;
};

export const PanoramaCarousel: React.FC<PanoramaCarouselProps> = async ({
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
        <div
          className={classNames(
            imagePreviewHeight,
            "relative overflow-scroll border-red",
          )}
          style={{
            aspectRatio:
              INSTAGRAM_CAROUSEL_SIZE.width / INSTAGRAM_CAROUSEL_SIZE.height,
          }}
        >
          <div className="absolute left-0 top-0 flex flex-row">
            {/* Image preview on top */}
            <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center">
              <img
                alt="preview image carousel"
                src={getCdnAsset(photoID)}
                className="h-full object-contain"
              />
            </div>

            {/* Background grid references */}
            {Array.from({ length: numCarouselImages }).map((_, i) => {
              return (
                <React.Fragment key={i}>
                  {/* Image background */}
                  <div
                    className={classNames(
                      "relative",
                      i % 2 ? "bg-gray-100" : "bg-gray-200",
                      imagePreviewHeight,
                    )}
                    style={{
                      aspectRatio:
                        INSTAGRAM_CAROUSEL_SIZE.width /
                        INSTAGRAM_CAROUSEL_SIZE.height,
                    }}
                  >
                    {/* Image cutoff border indicator */}
                    <div className="absolute right-[-0.5px] top-0 z-20 h-full w-0 border-l-2 border-dashed border-l-red" />
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <p>Num images: {normalizedNumCarouselImages.toFixed(2)}</p>
      </div>

      <SocialMediaImageFrame
        photoID={photoID}
        imageClassName={imagePreviewHeight}
      />
    </div>
  );
};
