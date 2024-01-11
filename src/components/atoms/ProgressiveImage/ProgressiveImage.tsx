"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useIsClient } from "@/hooks/useIsClient/useIsClient";

export type ProgressiveImageProps = {
  /**
   * Image source where the lowest resolution is the first in the array.
   */
  src: string[];
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src">;

/**
 * Renders a progressive image component that loads and displays images
 * progressively. This is useful when loading images that have multiple
 * resolutions. The first image in the `src` array is the lowest resolution and
 * the last image is the highest resolution.
 */
export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  onLoad,
  ...props
}) => {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const isClientReady = useIsClient();

  const incrementResolution = useCallback(
    () =>
      setCurrentImageIdx((idx) => {
        // If we've reached the last image, stay on the highest resolution image (ie. the last in the array).
        if (idx >= src.length - 1) {
          return idx;
        }

        // Increment to the next image
        return idx + 1;
      }),
    [src.length],
  );

  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      // If not client side mounted yet, don't advance to next image.
      if (!isClientReady) return;

      // If the image isn't done loading (success or error), don't try to go to the next one.
      if (!imgRef.current?.complete) return;

      // TODO (kevin): Properly handle error states (ie. image 404) using `onError`.
      const didError =
        imgRef.current.naturalWidth === 0 && imgRef.current.naturalHeight === 0;
      if (didError) {
        console.warn(
          `[] ${currentImageIdx + 1} of ${src.length} errored: ${
            src[currentImageIdx]
          }`,
        );
      }

      incrementResolution();
      // Also call the onLoad prop if supplied.
      onLoad?.(e);
    },
    [isClientReady, incrementResolution, onLoad, currentImageIdx, src],
  );

  useEffect(() => {
    // If the image is already loaded, trigger the onLoad prop. This is typically when the image is cached.
    if (imgRef.current?.complete) {
      handleImageLoad({} as React.SyntheticEvent<HTMLImageElement>);
    }
  }, [handleImageLoad]);

  return (
    <img
      ref={imgRef}
      data-progress-image={`${currentImageIdx + 1} of ${src.length}`}
      alt={props.alt}
      {...props}
      src={src[currentImageIdx]}
      onLoad={handleImageLoad}
      onLoadedMetadata={console.log}
      onErrorCapture={console.log}
      onError={console.log}
    />
  );
};
