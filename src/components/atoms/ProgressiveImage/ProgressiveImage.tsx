"use client";

import React, { useCallback, useEffect, useState } from "react";

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
  ...props
}) => {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // TODO (kevin): Handle error loading states.
  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setCurrentImageIdx((idx) => {
        // If we've reached the last image, stay on the highest resolution image (ie. the last in the array).
        if (idx >= src.length - 1) {
          return idx;
        }

        // Increment to the next image
        return idx + 1;
      });

      // Also call the onLoad prop if supplied.
      props.onLoad?.(e);
    },
    [src, props],
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
      onLoadStart={console.log}
      onLoad={handleImageLoad}
    />
  );
};
