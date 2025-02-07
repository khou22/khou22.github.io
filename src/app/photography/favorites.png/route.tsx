import { ImageResponse } from "next/og";
import { getPhotosWithTags } from "@/data/photos/photoDbManager";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { getCdnAsset, getPhotoName } from "@/utils/cdn/cdnAssets";

export async function GET() {
  // Get all featured photos
  const featuredPhotos = await getPhotosWithTags([PhotoTags.Featured]);

  // Get a random photo from the featured photos
  const randomPhoto =
    featuredPhotos[Math.floor(Math.random() * featuredPhotos.length)];

  const headers = new Headers({
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  });

  if (!randomPhoto) {
    // Return a fallback image if no featured photos are found
    return new ImageResponse(
      (
        <div
          style={{
            background: "black",
            width: 1200,
            height: 630,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 32,
            fontFamily: "sans-serif",
          }}
        >
          No featured photos available
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers,
      },
    );
  }

  try {
    return new ImageResponse(
      (
        <div
          style={{
            background: "black",
            width: 1200,
            height: 630,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <img
            src={getCdnAsset(randomPhoto)}
            alt={getPhotoName(randomPhoto)}
            style={{ width: 1200, height: 630, objectFit: "cover" }}
          />

          {/* Overlay with photo details */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              // background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
              padding: "40px",
              color: "white",
              fontFamily: "sans-serif",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: "bold",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {getPhotoName(randomPhoto) || "Featured Photo"}
            </div>
            <div
              style={{
                fontSize: 24,
                opacity: 0.9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Kevin Hou Photography
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers,
      },
    );
  } catch (error) {
    // Return a fallback image if there's an error generating the OG image
    return new ImageResponse(
      (
        <div
          style={{
            background: "black",
            width: 1200,
            height: 630,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 32,
            fontFamily: "sans-serif",
          }}
        >
          Error generating image
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers,
      },
    );
  }
}
