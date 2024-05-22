import findKey from "lodash/findKey";
import { notFound, redirect } from "next/navigation";
import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";

import { PhotoAlbumCover } from "@/components/organisms/PhotoAlbumCover/PhotoAlbumCover";
import { ogImageSize } from "@/constants/ogImage";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { tagMetadata } from "@/constants/photoTags/tagMetadata";
import { siteMetadata } from "@/constants/siteMetadata";
import { getPhotosWithTag } from "@/data/photos/photoDbManager";
import { PhotoIdType } from "@/utils/cdn/cdnAssets";

type RouteParams = {
  params: {
    tag_id: string;
  };
};

export async function GET(_: NextRequest, context: RouteParams) {
  const photoTag = findKey(
    tagMetadata,
    ({ slug }) => slug === context.params.tag_id,
  ) as PhotoTags;
  const metadata = tagMetadata[photoTag];

  if (!photoTag) {
    notFound();
  }

  try {
    const photos = await getPhotosWithTag(photoTag);

    // If there are less than 4 photos, redirect to the standard preview card.
    if (photos.length < 4) redirect(siteMetadata.previewCard.url);

    const heroPhoto = metadata.thumbnailPhotoId ?? photos[0];

    const featuredPhotos: PhotoIdType[] = [];

    // Get the first 3 photos that aren't already used. Break when we have 3.
    let i = 0;
    while (featuredPhotos.length < 3 && i < photos.length) {
      if (!featuredPhotos.includes(photos[i]) && photos[i] !== heroPhoto) {
        featuredPhotos.push(photos[i]);
      }
      i++;
    }

    return new ImageResponse(
      (
        <PhotoAlbumCover
          name={metadata.name}
          heroPhoto={heroPhoto}
          photos={featuredPhotos as [PhotoIdType, PhotoIdType, PhotoIdType]}
          caption="Prints available for purchase."
        />
      ),
      {
        width: ogImageSize.width,
        height: ogImageSize.height,
      },
    );
  } catch (e) {
    console.error("Error generating image:", e);
    return new NextResponse(`Error generating image: ${e}`, { status: 500 });
  }
}
