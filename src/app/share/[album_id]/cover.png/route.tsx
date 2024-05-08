import { notFound, redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import { ogImageSize } from "@/constants/ogImage";
import { getCdnAsset, PhotoIdType } from "@/utils/cdn/cdnAssets";
import { PhotoAlbumCover } from "@/components/organisms/PhotoAlbumCover/PhotoAlbumCover";
import { privatePhotoAlbums } from "@/constants/privatePhotoAlbums";

type RouteParams = {
  params: {
    album_id: string;
  };
};

export async function GET(_: NextRequest, context: RouteParams) {
  const album = privatePhotoAlbums.find(
    ({ id }) => id === context.params.album_id,
  );

  if (!album) {
    notFound();
  }

  try {
    // If there are less than 4 photos, redirect to the default cover image.
    if (album.photos.length < 4) {
      const coverImage = getCdnAsset(album.cover);
      redirect(coverImage);
    }

    const heroPhoto = album.cover ?? album.photos[0];

    const featuredPhotos: PhotoIdType[] = [];

    // Get the first 3 photos that aren't already used. Break when we have 3.
    let i = 0;
    while (featuredPhotos.length < 3 && i < album.photos.length) {
      if (
        !featuredPhotos.includes(album.photos[i]) &&
        album.photos[i] !== heroPhoto
      ) {
        featuredPhotos.push(album.photos[i]);
      }
      i++;
    }

    // TODO (kevin): Make this dynamic title font size available to all usages of <PhotoAlbumCover />
    let titleFontSize = 38;
    if (album.name.length < 20) {
      titleFontSize = 64;
    } else if (album.name.length < 30) {
      titleFontSize = 48;
    } else if (album.name.length < 40) {
      titleFontSize = 42;
    }

    return new ImageResponse(
      (
        <PhotoAlbumCover
          name={album.name}
          heroPhoto={heroPhoto}
          photos={featuredPhotos as [PhotoIdType, PhotoIdType, PhotoIdType]}
          titleFontSize={titleFontSize}
          subtitleFontSize={28}
        />
      ),
      {
        width: ogImageSize.width,
        height: ogImageSize.height,
      },
    );
  } catch (e) {
    console.error("Error generating album image:", e);
    return new NextResponse(`Error generating image: ${e}`, { status: 500 });
  }
}
