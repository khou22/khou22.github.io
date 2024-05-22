import React from "react";

import Link from "next/link";

import { MapPinIcon } from "@/components/icons/MapPinIcon/MapPinIcon";
import { TagIcon } from "@/components/icons/TagIcon/TagIcon";
import { IconProps } from "@/components/icons/types";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { PhotoTags, allLocationTags } from "@/constants/photoTags/photoTags";
import { tagMetadata } from "@/constants/photoTags/tagMetadata";
import { PAGES } from "@/utils/pages";

type PhotoTagBadgeProps = {
  photoTag: PhotoTags;
};

export const PhotoTagBadge: React.FC<PhotoTagBadgeProps> = ({ photoTag }) => {
  let Icon: React.FC<IconProps> = TagIcon;
  let variant: BadgeProps["variant"] = "gray";
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
    Icon = MapPinIcon;
  }

  const metadata = tagMetadata[photoTag];
  if (!metadata) {
    throw new Error(`No metadata for: ${photoTag}`);
  }

  if (metadata.hidden) {
    return null;
  }

  return (
    <Link href={PAGES.PHOTOGRAPHY.TAG(photoTag)}>
      <Badge variant={variant}>
        <Icon className="mr-1 inline h-4 w-4" />
        {metadata.name}
      </Badge>
    </Link>
  );
};
