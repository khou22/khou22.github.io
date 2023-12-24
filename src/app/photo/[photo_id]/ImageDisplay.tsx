"use client";

import { ModalPrimitive } from "@/components/atoms/ModalPrimitive/ModalPrimitive";
import { ProgressiveImage } from "@/components/atoms/ProgressiveImage/ProgressiveImage";
import { FullScreenIcon } from "@/components/icons/FullScreenIcon/FullScreenIcon";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { notEmpty } from "@/utils/arrays";
import {
  PhotoIdType,
  getCdnAsset,
  getPhotoThumbnail,
} from "@/utils/cdn/cdnAssets";
import React, { useEffect, useState } from "react";

type ImageDisplayProps = {
  photoID: PhotoIdType;
};

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ photoID }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const photoURLs = [getPhotoThumbnail(photoID), getCdnAsset(photoID)].filter(
    notEmpty,
  );

  return (
    <div className="group relative bg-gray-100/40">
      <ProgressiveImage
        src={photoURLs}
        className="max-h-[85vh] w-full object-contain"
      />
      <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
        <button
          title="Full Screen"
          className="rounded-full bg-gray-50 p-2 shadow hover:bg-gray-200"
          onClick={() => setLightboxOpen(true)}
        >
          <FullScreenIcon className="h-5 w-5" />
        </button>
        <ModalPrimitive
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        >
          <div className="h-[95vh] w-[95vw] p-3">
            <ProgressiveImage
              src={photoURLs}
              className="h-full w-full object-contain"
            />
          </div>
        </ModalPrimitive>
      </div>
    </div>
  );
};
