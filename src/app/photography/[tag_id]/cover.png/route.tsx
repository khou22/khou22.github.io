import findKey from "lodash/findKey";
import { ServerRuntime } from "next";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { tagMetadata } from "@/constants/photoTags/tagMetadata";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { ogImageSize } from "@/constants/ogImage";

// Route segment config
export const runtime: ServerRuntime = "edge";

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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>{metadata.name}</p>
      </div>
    ),
    {
      width: ogImageSize.width,
      height: ogImageSize.height,
    },
  );
}
