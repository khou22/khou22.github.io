import { ImageCard } from "@/components/molecules/ImageCard/ImageCard";
import { PhotoTags, tagMetadata } from "@/constants/photoTags";
import { getPhotosWithTag } from "@/data/photos/photoDbManager";
import { getCdnAsset, getPhotoThumbnail } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import Link from "next/link";
import React from "react";

type TagImageCardProps = {
  photoTag: PhotoTags;
};

const defaultBackground = "media/site/images/photography_background_png";

/**
 * Image card for selecting a tag category. SSR.
 */
export const TagImageCard: React.FC<TagImageCardProps> = async ({
  photoTag,
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

  return (
    <Link href={PAGES.PHOTOGRAPHY.TAG(photoTag)} className="col-span-1">
      <ImageCard
        title={metadata.name}
        imageSrc={url}
        containerClassName="w-full h-full min-h-[200px] rounded-lg"
        contentClassName="p-4"
      />
    </Link>
  );
};
