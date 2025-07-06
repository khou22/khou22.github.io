import React from "react";
import { Aboreto } from "next/font/google";
import { getCdnAsset, getPhotoName, PhotoIdType } from "@/utils/cdn/cdnAssets";
import { getPhotoSize } from "@/utils/photos/getPhotoSize";
import { INSTAGRAM_CAROUSEL_SIZE } from "@/constants/contentMetadata";
import { classNames } from "@/utils/style";

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

  const imagePreviewHeight = "md:h-[400px] h-[300px]";

  return (
    <div className="w-full space-y-4">
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

      <div
        className={classNames(
          imagePreviewHeight,
          "relative overflow-scroll bg-white",
        )}
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

          <p
            className={classNames(
              "w-full text-center text-sm",
              captionFont.className,
            )}
          >
            {photoName.toUpperCase()}
          </p>
        </div>

        <img
          alt="preview image full background"
          src={getCdnAsset(photoID)}
          className="absolute left-1/2 top-1/2 z-0 h-full -translate-x-1/2 -translate-y-1/2 scale-110 object-cover opacity-80 blur-md"
        />
      </div>
    </div>
  );
};
