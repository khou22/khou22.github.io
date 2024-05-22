import { ArrowLeftIcon } from "@radix-ui/react-icons";
import findKey from "lodash/findKey";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PhotoGallery } from "@/components/organisms/PhotoGallery/PhotoGallery";
import { TagImageCard } from "@/components/organisms/TagImageCard/TagImageCard";
import { FeaturedGallerySpread } from "@/components/templates/FeaturedGallerySpread/FeaturedGallerySpread";
import { ogImageSize } from "@/constants/ogImage";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { tagMetadata } from "@/constants/photoTags/tagMetadata";
import { siteMetadata } from "@/constants/siteMetadata";
import { getPhotosWithTag } from "@/data/photos/photoDbManager";
import { PhotoIdType, getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { getSuggestedPhotoTags } from "@/utils/photos/getSuggestedPhotoTags";

type PageProps = {
  params: {
    tag_id: string;
  };
};

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  return Object.values(PhotoTags).map((value) => {
    return {
      tag_id: value,
    };
  });
}

export const generateMetadata = ({ params }: PageProps): Metadata => {
  const photoTag = findKey(
    tagMetadata,
    ({ slug }) => slug === params.tag_id,
  ) as PhotoTags;

  if (!photoTag) {
    notFound();
  }

  const title = `${tagMetadata[photoTag].name} | Kevin Hou Photography`;
  const coverImage = PAGES.PHOTOGRAPHY.ALBUM_COVER(photoTag);

  return {
    title: `${tagMetadata[photoTag].name} | Kevin Hou Photography`,
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
          width: ogImageSize.width,
          height: ogImageSize.height,
        },
      ],
    },
    openGraph: {
      images: [
        {
          url: coverImage,
          alt: title,
          type: "image/jpeg",
          width: ogImageSize.width,
          height: ogImageSize.height,
        },
      ],
    },
  };
};

const TagPage = async ({ params }: PageProps) => {
  const photoTag = findKey(
    tagMetadata,
    ({ slug }) => slug === params.tag_id,
  ) as PhotoTags;
  const metadata = tagMetadata[photoTag];

  if (!photoTag) {
    notFound();
  }

  const photoIDs = await getPhotosWithTag(photoTag);
  const suggestedTags = getSuggestedPhotoTags(photoTag, 4);
  const suggestedTagNodes = await Promise.all(
    suggestedTags.map(async (tag) => (
      <TagImageCard key={tag} photoTag={tag} size="md" />
    )),
  );

  const suggestedSection = (
    <div className="mt-16 w-full">
      <h3 className="w-full text-center">Explore More</h3>
      <div className="my-6 grid w-full grid-cols-2 gap-4 md:grid-cols-4">
        {suggestedTagNodes}
      </div>
    </div>
  );

  if (metadata.galleryLayout) {
    const featuredPhotoIDs = new Set<PhotoIdType>([
      metadata.galleryLayout.cover.hero,
      metadata.galleryLayout.cover.left,
      metadata.galleryLayout.cover.right,
    ]);
    metadata.galleryLayout.features.forEach(({ photoID }) => {
      featuredPhotoIDs.add(photoID);
    });

    return (
      <PageWrapper maxWidth="wide">
        <FeaturedGallerySpread {...metadata.galleryLayout} />

        <PhotoGallery
          photoIDs={photoIDs.filter((id) => !featuredPhotoIDs.has(id))}
        />

        {suggestedSection}
      </PageWrapper>
    );
  }

  return (
    <PageWrapper maxWidth="wide">
      <div>
        <CustomLink
          href={PAGES.PHOTOGRAPHY.BROWSE}
          className="flex flex-row items-center justify-start space-x-1"
        >
          <ArrowLeftIcon className="inline h-4 w-4" />
          <span>Back to Browse</span>
        </CustomLink>
      </div>
      <div className="flex w-full flex-col items-center justify-center space-y-2">
        <img
          alt={`${metadata.name} hero image`}
          src={getCdnAsset(
            metadata.thumbnailPhotoId ?? "media/site/images/Profile2_jpg",
          )}
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
            {metadata.name} Photos
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

      <PhotoGallery photoIDs={photoIDs} fadeIn />

      {suggestedSection}
    </PageWrapper>
  );
};

export default TagPage;
