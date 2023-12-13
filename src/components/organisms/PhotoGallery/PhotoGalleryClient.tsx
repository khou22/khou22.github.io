"use client";

import PhotoAlbum from "react-photo-album";
import React, { useEffect, useState } from "react";
import { useScreenSize } from "@/hooks/useScreenSize/useScreenSize";
import { PhotoRecord } from "./types";
import { GalleryImage } from "./GalleryImage";

type PhotoGalleryClientProps = {
  photos: PhotoRecord[];
};

/**
 * Client side rendering for the photo gallery.
 */
export const PhotoGalleryClient: React.FC<PhotoGalleryClientProps> = ({
  photos,
}) => {
  const { width } = useScreenSize();
  const isMobile = width < 768;

  // Only run on the client (https://nextjs.org/docs/messages/react-hydration-error#solution-1-using-useeffect-to-run-on-the-client-only)
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <></>;

  return (
    <div className="w-full">
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
