"use client";

import React from "react";
import { getCdnAsset, PhotoIdType } from "@/utils/cdn/cdnAssets";
import { PhotoSize } from "@/utils/photos/getPhotoSize";
import { INSTAGRAM_CAROUSEL_SIZE } from "@/constants/contentMetadata";
import { classNames } from "@/utils/style";

type PanoramaCarouselProps = {
  photoID: PhotoIdType;
  imageClassName?: string;
  photoSize: PhotoSize;
  position?: "center" | "left" | "none";
};

export const PanoramaCarousel: React.FC<PanoramaCarouselProps> = ({
  photoID,
  imageClassName,
  photoSize: size,
  position = "center",
}) => {
  if (!size.width || !size.height) return <p>Error: No size for photo</p>;

  const normalizedNumCarouselImages =
    size.width /
    size.height /
    (INSTAGRAM_CAROUSEL_SIZE.width / INSTAGRAM_CAROUSEL_SIZE.height);
  const numCarouselImages = Math.ceil(normalizedNumCarouselImages);

  return (
    <div
      className={classNames(
        imageClassName,
        "relative overflow-scroll border-red",
      )}
      style={{
        aspectRatio:
          INSTAGRAM_CAROUSEL_SIZE.width / INSTAGRAM_CAROUSEL_SIZE.height,
      }}
    >
      <div className="absolute left-0 top-0 flex flex-row">
        {/* Individual canvases for each carousel item */}
        {Array.from({ length: numCarouselImages }).map((_, i) => {
          const canvasWidth =
            INSTAGRAM_CAROUSEL_SIZE.width / INSTAGRAM_CAROUSEL_SIZE.height;
          const cropStartX = (i * canvasWidth) / normalizedNumCarouselImages;
          const cropWidth = canvasWidth / normalizedNumCarouselImages;

          return (
            <div
              key={i}
              className={classNames(
                "relative",
                i % 2 ? "bg-gray-100" : "bg-gray-200",
                imageClassName,
              )}
              style={{
                aspectRatio:
                  INSTAGRAM_CAROUSEL_SIZE.width /
                  INSTAGRAM_CAROUSEL_SIZE.height,
              }}
            >
              {/* Individual canvas for this carousel item */}
              <canvas
                className="absolute inset-0 h-full w-full object-contain"
                style={{
                  imageRendering: "pixelated",
                }}
                ref={(canvas) => {
                  if (canvas) {
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                      // Set canvas dimensions
                      canvas.width = INSTAGRAM_CAROUSEL_SIZE.width;
                      canvas.height = INSTAGRAM_CAROUSEL_SIZE.height;

                      // TODO (kevin): Make the canvas's responsive to the cut off type (ie. center, left, none)

                      // Load and draw the image portion for this carousel item
                      const img = new Image();
                      // img.crossOrigin = "anonymous";
                      img.onload = () => {
                        // Calculate the source rectangle for this carousel item
                        const sourceX = (i * img.width) / numCarouselImages;
                        const sourceWidth = img.width / numCarouselImages;

                        // Draw the cropped portion of the image
                        ctx.drawImage(
                          img,
                          sourceX,
                          0,
                          sourceWidth,
                          img.height, // source rectangle
                          0,
                          0,
                          canvas.width,
                          canvas.height, // destination rectangle
                        );
                      };
                      img.src = getCdnAsset(photoID);
                    }
                  }
                }}
              />

              {/* Image cutoff border indicator */}
              <div className="absolute right-[-0.5px] top-0 z-20 h-full w-0 border-l-2 border-dashed border-l-red" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
