"use client";

import React from "react";

import PhotoAlbum from "react-photo-album";

import { useIsClient } from "@/hooks/useIsClient/useIsClient";
import { useScreenSize } from "@/hooks/useScreenSize/useScreenSize";
import { classNames } from "@/utils/style";

import { GalleryImage } from "./GalleryImage";
import { PhotoRecord } from "./types";

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

  /**
   * The number of columns to render. When set, this will not be responsive to screen size.
   */
  numColumns?: number;
};

/**
 * Client side rendering for the photo gallery.
 */
export const PhotoGalleryClient: React.FC<PhotoGalleryClientProps> = ({
  photos,
  fadeIn = false,
  className = "",
  numColumns,
}) => {
  const { width } = useScreenSize();
  const isMobile = width < 768;

  const isClient = useIsClient();

  // TODO (k): Replace with a placeholder.
  if (!isClient) return <div className="min-h-[500px] w-full" />;

  const columns = numColumns !== undefined ? numColumns : isMobile ? 2 : 4;
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
        columns={columns}
        // Default container width is needed for SSR.
        defaultContainerWidth={isMobile ? 450 : 800}
        photos={photos}
        renderPhoto={GalleryImage}
      />
    </div>
  );
};
