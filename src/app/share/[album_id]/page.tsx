import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PhotoGallery } from "@/components/organisms/PhotoGallery/PhotoGallery";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { privatePhotoAlbums } from "@/constants/privatePhotoAlbums";
import { siteMetadata } from "@/constants/siteMetadata";
import { getPhotoSize } from "@/utils/photos/getPhotoSize";

type PageProps = {
  params: {
    album_id: string;
  };
};

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  return privatePhotoAlbums.map((album) => {
    return {
      album_id: album.id,
    };
  });
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const album = privatePhotoAlbums.find(({ id }) => id === params.album_id);

  if (!album) {
    notFound();
  }

  const title = `${album.name} | Kevin Hou Photography`;
  const coverImage = getCdnAsset(album.cover);
  const size = await getPhotoSize(album.cover);
  return {
    title,
    description: siteMetadata.description,
    authors: {
      name: siteMetadata.author,
      url: siteMetadata.siteUrl,
    },
    metadataBase: new URL(siteMetadata.siteUrl),
    twitter: {
      site: siteMetadata.siteUrl,
      siteId: "khou22.com",
      creator: siteMetadata.author,
      creatorId: "@kevinhou22",
      description: siteMetadata.description,
      title: title,
      card: "summary_large_image",
      images: [
        {
          url: coverImage,
          alt: title,
          type: "image/jpeg",
          width: size.width,
          height: size.height,
        },
      ],
    },
    openGraph: {
      images: [
        {
          url: coverImage,
          alt: title,
          type: "image/jpeg",
          width: size.width,
          height: size.height,
        },
      ],
    },
  };
};

const ShareAlbumPage = async ({ params }: PageProps) => {
  const album = privatePhotoAlbums.find(({ id }) => id === params.album_id);

  if (!album) {
    notFound();
  }

  return (
    <PageWrapper maxWidth="wide">
      <div>
        <CustomLink
          href={PAGES.PHOTOGRAPHY.HOME}
          className="flex flex-row items-center justify-start space-x-1"
        >
          <ArrowLeftIcon className="inline h-4 w-4" />
          <span>All Photos</span>
        </CustomLink>
      </div>
      <div className="flex w-full flex-col items-center justify-center space-y-2">
        <img
          alt={`${album.name} hero image`}
          src={getCdnAsset(album.cover ?? "media/site/images/Profile2_jpg")}
          className="h-40 w-40 animate-overlay-show rounded-full border-4 border-blue object-cover opacity-0"
          style={{
            animationDuration: "2500ms",
            animationFillMode: "forwards",
            animationDelay: "100ms",
          }}
        />
        <div>
          <h3
            className="animate-overlay-show text-center leading-relaxed opacity-0"
            style={{
              animationDuration: "2500ms",
              animationFillMode: "forwards",
              animationDelay: "200ms",
            }}
          >
            {album.name} Photos
          </h3>
          <p
            className="caption animate-overlay-show text-center opacity-0"
            style={{
              animationDuration: "3s",
              animationFillMode: "forwards",
              animationDelay: "800ms",
            }}
          >
            Shot & Edited by Kevin Hou
          </p>
        </div>
      </div>

      <PhotoGallery photoIDs={album.photos} fadeIn />
    </PageWrapper>
  );
};

export default ShareAlbumPage;
