"use client";

import PhotoAlbum from "react-photo-album";
import React, { useEffect, useRef } from "react";
import { PhotoRecord } from "./types";
import { GalleryImage } from "./GalleryImage";
import { useScreenSize } from "@/hooks/useScreenSize/useScreenSize";
import { useIsClient } from "@/hooks/useIsClient/useIsClient";
import { trackViewItemList } from "@/utils/analytics/ga";
import { classNames } from "@/utils/style";

export type PhotoGalleryClientProps = {
  photos: PhotoRecord[];

  /**
   * Optional list name used for GA4 `view_item_list` and `select_item` events.
   */
  listName?: string;

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
  listName,
  fadeIn = false,
  className = "",
  numColumns,
}) => {
  const { width } = useScreenSize();
  const isMobile = width < 768;

  const isClient = useIsClient();
  const hasTrackedListRef = useRef<string | null>(null);

  useEffect(() => {
    if (!listName || photos.length === 0) return;
    if (hasTrackedListRef.current === listName) return;
    hasTrackedListRef.current = listName;
    trackViewItemList(
      photos.map((photo) => photo.photoID),
      listName,
    );
  }, [listName, photos]);

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
        renderPhoto={(props) => <GalleryImage {...props} listName={listName} />}
      />
    </div>
  );
};
