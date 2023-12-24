import { TagIcon } from "@/components/icons/TagIcon/TagIcon";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { PhotoTags, allLocationTags, tagMetadata } from "@/constants/photoTags";
import { PAGES } from "@/utils/pages";
import Link from "next/link";
import React from "react";

type PhotoTagBadgeProps = {
  photoTag: PhotoTags;
};

export const PhotoTagBadge: React.FC<PhotoTagBadgeProps> = ({ photoTag }) => {
  let variant: BadgeProps["variant"] = "default";
  switch (photoTag) {
    case PhotoTags.Featured:
      variant = "orange";
      break;
    case PhotoTags.Drone:
    case PhotoTags.Satellite:
      variant = "blue";
      break;
    case PhotoTags.Landscape:
      variant = "green";
      break;
    case PhotoTags.Events:
      variant = "yellow";
      break;
  }

  if (allLocationTags.includes(photoTag)) {
    variant = "purple";
  }

  if (tagMetadata[photoTag].hidden) {
    return null;
  }

  return (
    <Link href={PAGES.PHOTOGRAPHY.TAG(photoTag)}>
      <Badge variant={variant}>
        <TagIcon className="mr-1 h-4 w-4" />
        {tagMetadata[photoTag].name}
      </Badge>
    </Link>
  );
};
