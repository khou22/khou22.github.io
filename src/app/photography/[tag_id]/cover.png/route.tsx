import findKey from "lodash/findKey";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import { tagMetadata } from "@/constants/photoTags/tagMetadata";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { ogImageSize } from "@/constants/ogImage";
import { getPhotosWithTag } from "@/data/photos/photoDbManager";
import { getCdnAsset, PhotoIdType } from "@/utils/cdn/cdnAssets";

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

    const url = getCdnAsset(featuredPhotos[0]);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "20%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p>{metadata.name}</p>
          </div>
          <div
            style={{
              width: "100%",
              height: "80%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <img
              src={url}
              alt="Test"
              width={800}
              height={450}
              style={{
                objectFit: "cover",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
              }}
            />
          </div>
        </div>
      ),
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
