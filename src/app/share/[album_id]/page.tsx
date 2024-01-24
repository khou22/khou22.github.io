import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PhotoGallery } from "@/components/organisms/PhotoGallery/PhotoGallery";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { privatePhotoAlbums } from "@/constants/privatePhotoAlbums";
import { siteMetadata } from "@/constants/siteMetadata";
import { getPhotoSize } from "@/utils/photos/getPhotoSize";
import { Button } from "@/components/ui/button";
import { LinkExternalIcon } from "@/components/icons/LinkExternalIcon/LinkExternalIcon";

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
    <>
      <div className="relative h-auto w-screen sm:h-[70vh]">
        <div className="relative flex h-full w-full items-center justify-center px-6 pb-12 pt-12 sm:px-12 sm:pt-2">
          <div className="max-w-sm rounded bg-white p-6 shadow">
            <div className="mb-6">
              <CustomLink
                href={PAGES.PHOTOGRAPHY.HOME}
                className="flex flex-row items-center justify-start space-x-1"
              >
                <ArrowLeftIcon className="inline h-4 w-4" />
                <span>All Photos</span>
              </CustomLink>
            </div>
            <div className="flex w-full flex-col items-center justify-center space-y-6">
              <img
                alt={`${album.name} hero image`}
                src={getCdnAsset(
                  album.cover ?? "media/site/images/Profile2_jpg",
                )}
                className="h-48 w-48 animate-overlay-show rounded-full border-4 border-blue object-cover opacity-0 sm:h-64 sm:w-64"
                style={{
                  animationDuration: "2500ms",
                  animationFillMode: "forwards",
                  animationDelay: "100ms",
                }}
              />
              <div>
                <h5
                  className="my-4 animate-overlay-show text-center opacity-0"
                  style={{
                    animationDuration: "2500ms",
                    animationFillMode: "forwards",
                    animationDelay: "200ms",
                  }}
                >
                  {album.name}
                </h5>
                <p
                  className="caption animate-overlay-show text-center opacity-0"
                  style={{
                    animationDuration: "3s",
                    animationFillMode: "forwards",
                    animationDelay: "800ms",
                  }}
                >
                  Shot & Edited by{" "}
                  <CustomLink href={PAGES.CONTACT}>Kevin Hou</CustomLink>
                </p>
              </div>

              {album.link && (
                <Link href={album.link} target="_blank">
                  <Button
                    variant="primary"
                    className="flex min-w-[250px] flex-row items-center justify-center space-x-1"
                  >
                    <span>View Album</span>
                    <LinkExternalIcon className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div
          className="absolute left-0 top-0 -z-10 h-full w-full brightness-75"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundImage: `url(${getCdnAsset(album.cover)})`,
          }}
        />
      </div>
      <PageWrapper className="mt-12 sm:mt-20">
        <h2 className="w-full text-center">Samples from Album</h2>
        <PhotoGallery photoIDs={album.photos} fadeIn />
      </PageWrapper>
    </>
  );
};

export default ShareAlbumPage;
