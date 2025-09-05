"use client";

import { ImageAnnotation } from "@/components/organisms/ImageAnnotation/ImageAnnotation";
import { BoundingBoxSelection } from "@/components/organisms/ImageAnnotation/types";
import { copyToClipboard } from "@/utils/clipboard";

export const BoundingBoxClient = ({
  imageUrl,
}: {
  imageUrl: string;
}) => {
  const handleSelection = async (selection: BoundingBoxSelection) => {
    const resp = await fetch(selection.imageBase64);
    const blob = await resp.blob();
    await copyToClipboard({ blob });
  };

  return (
    <ImageAnnotation
      imageUrl={imageUrl}
      onBoundingBoxSelection={handleSelection}
    />
  );
};
