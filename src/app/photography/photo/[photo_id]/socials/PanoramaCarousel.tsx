import React from "react";
import { getCdnAsset, PhotoIdType } from "@/utils/cdn/cdnAssets";
import { getPhotoSize } from "@/utils/photos/getPhotoSize";
import { INSTAGRAM_CAROUSEL_SIZE } from "@/constants/contentMetadata";
import { classNames } from "@/utils/style";

type PanoramaCarouselProps = {
  photoID: PhotoIdType;
};

export const PanoramaCarousel: React.FC<PanoramaCarouselProps> = async ({
  photoID,
}) => {
  const size = await getPhotoSize(photoID);

  if (!size.width || !size.height) return <p>Error: No size for photo</p>;

  const normalizedNumCarouselImages =
    size.width /
    size.height /
    (INSTAGRAM_CAROUSEL_SIZE.width / INSTAGRAM_CAROUSEL_SIZE.height);
  const numCarouselImages = Math.ceil(normalizedNumCarouselImages);

  const imagePreviewHeight = "md:h-[400px] h-[300px]";

  return (
    <div>
      <p>Num images: {normalizedNumCarouselImages.toFixed(2)}</p>

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
    </div>
  );
};
