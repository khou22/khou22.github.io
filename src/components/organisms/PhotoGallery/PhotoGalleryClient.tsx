"use client";

import PhotoAlbum from "react-photo-album";
import React from "react";
import { useScreenSize } from "@/hooks/useScreenSize/useScreenSize";
import { PhotoRecord } from "./types";
import { GalleryImage } from "./GalleryImage";
import { useIsClient } from "@/hooks/useIsClient/useIsClient";
import { classNames } from "@/utils/style";

export type PhotoGalleryClientProps = {
  photos: PhotoRecord[];

  /**
   * Whether to fade in on page load using pure CSS animations.
   */
  fadeIn?: boolean;

  /**
   * Classes to apply to the container.
   */
  className?: string;
};

/**
 * Client side rendering for the photo gallery.
 */
export const PhotoGalleryClient: React.FC<PhotoGalleryClientProps> = ({
  photos,
  fadeIn = false,
  className = "",
}) => {
  const { width } = useScreenSize();
  const isMobile = width < 768;

  const isClient = useIsClient();

  // TODO (k): Replace with a placeholder.
  if (!isClient) return <div className="min-h-[500px] w-full" />;

  return (
    <div
      className={classNames(
        "w-full",
        fadeIn ? "animate-overlay-show opacity-0" : "",
        className,
      )}
      style={
        fadeIn
          ? {
              animationDuration: "2500ms",
              animationFillMode: "forwards",
            }
          : undefined
      }
    >
      <PhotoAlbum<PhotoRecord>
        layout="masonry"
        columns={isMobile ? 2 : 4}
        // Default container width is needed for SSR.
        defaultContainerWidth={isMobile ? 450 : 800}
        photos={photos}
        renderPhoto={GalleryImage}
      />
    </div>
  );
};
