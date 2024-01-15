import Link from "next/link";
import React from "react";
import { ImageCard } from "@/components/molecules/ImageCard/ImageCard";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { getPhotosWithTag } from "@/data/photos/photoDbManager";
import { getCdnAsset, getPhotoThumbnail } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { classNames } from "@/utils/style";
import { tagMetadata } from "@/constants/photoTags/tagMetadata";

type TagImageCardProps = {
  photoTag: PhotoTags;
  size?: "sm" | "md" | "lg";
};

const defaultBackground = "media/site/images/photography_background_png";

/**
 * Image card for selecting a tag category. SSR.
 */
export const TagImageCard: React.FC<TagImageCardProps> = async ({
  photoTag,
  size = "sm",
}) => {
  const metadata = tagMetadata[photoTag];

  // Get the desired cover photo image for the tile.
  let coverPhotoID = metadata.thumbnailPhotoId;
  if (!coverPhotoID) {
    const photos = await getPhotosWithTag(photoTag);
    if (photos.length > 0) {
      coverPhotoID = photos[0];
    }
  }

  // Use the lower resolution thumbnail.
  let url = getCdnAsset(coverPhotoID ?? defaultBackground);
  if (coverPhotoID) {
    const thumbnail = getPhotoThumbnail(coverPhotoID);
    if (thumbnail) {
      url = getCdnAsset(thumbnail);
    }
  }

  let heightClassName;
  switch (size) {
    case "lg":
      heightClassName = "aspect-[4/5]";
      break;
    case "md":
      heightClassName = "aspect-square";
      break;
    case "sm":
    default:
      heightClassName = "aspect-[9/5]";
  }

  return (
    <Link href={PAGES.PHOTOGRAPHY.TAG(photoTag)} className="col-span-1">
      <ImageCard
        title={metadata.name}
        imageSrc={url}
        containerClassName={classNames(
          "w-full h-full rounded-lg",
          heightClassName,
        )}
        contentClassName="p-4"
      />
    </Link>
  );
};
