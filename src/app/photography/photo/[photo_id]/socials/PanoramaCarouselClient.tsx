"use client";

import React, { useState } from "react";
import { PhotoIdType } from "@/utils/cdn/cdnAssets";
import { PhotoSize } from "@/utils/photos/getPhotoSize";
import { PanoramaCarousel } from "@/components/organisms/PanoramaCarousel/PanoramaCarousel";

type PanoramaCarouselClientProps = {
  photoID: PhotoIdType;
  imageClassName?: string;
  photoSize: PhotoSize;
};

export const PanoramaCarouselClient: React.FC<PanoramaCarouselClientProps> = ({
  photoID,
  imageClassName,
  photoSize,
}) => {
  const [position, setPosition] = useState<'center' | 'left' | 'none'>('center');

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <label htmlFor="position-select" className="text-sm font-medium">
          Border Position:
        </label>
        <select
          id="position-select"
          value={position}
          onChange={(e) => setPosition(e.target.value as 'center' | 'left' | 'none')}
          className="rounded-md border border-gray-300 py-1 px-2 text-sm"
        >
          <option value="center">Center (borders on both sides)</option>
          <option value="left">Left (border on right only)</option>
          <option value="none">None (no borders)</option>
        </select>
      </div>
      
      <PanoramaCarousel
        photoID={photoID}
        imageClassName={imageClassName}
        photoSize={photoSize}
        position={position}
      />
    </div>
  );
};
