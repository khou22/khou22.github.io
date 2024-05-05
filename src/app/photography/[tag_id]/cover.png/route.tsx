import findKey from "lodash/findKey";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import { tagMetadata } from "@/constants/photoTags/tagMetadata";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { ogImageSize } from "@/constants/ogImage";
import { getPhotosWithTag } from "@/data/photos/photoDbManager";
import { PhotoIdType } from "@/utils/cdn/cdnAssets";
import { PhotoAlbumCover } from "@/components/organisms/PhotoAlbumCover/PhotoAlbumCover";

export const alt = "Open Graph";
export const contentType = "image/png";

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
    const featuredPhotos: [PhotoIdType, PhotoIdType, PhotoIdType] = [
      photos[0],
      photos[0],
      photos[0],
    ];

    return new ImageResponse(
      <PhotoAlbumCover name={metadata.name} photos={featuredPhotos} />,
      {
        width: ogImageSize.width,
        height: ogImageSize.height,
        debug: true,
      },
    );
  } catch (e) {
    console.error("Error generating image:", e);
    return new NextResponse(`Error generating image: ${e}`, { status: 500 });
  }
}
