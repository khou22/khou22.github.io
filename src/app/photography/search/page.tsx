import { Metadata } from "next/types";
import { SearchInput } from "../SearchInput";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getPhotoName } from "@/utils/cdn/cdnAssets";
import { PhotoGallery } from "@/components/organisms/PhotoGallery/PhotoGallery";
import { TagImageCard } from "@/components/organisms/TagImageCard/TagImageCard";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { tagMetadata } from "@/constants/photoTags/tagMetadata";
import { PAGES } from "@/utils/pages";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { siteMetadata } from "@/constants/siteMetadata";
import { ogImageSize } from "@/constants/ogImage";

type PageProps = { params: {}; searchParams: { query: string } };

export const generateMetadata = ({
  searchParams: { query },
}: PageProps): Metadata => {
  const title = `Searching for ${query} photos | Kevin Hou Photography`;

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
          url: siteMetadata.previewCard.url,
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
          url: siteMetadata.previewCard.url,
          alt: title,
          type: "image/jpeg",
          width: ogImageSize.width,
          height: ogImageSize.height,
        },
      ],
    },
  };
};

const SearchPage = async ({ searchParams: { query } }: PageProps) => {
  const matchingTags: PhotoTags[] = Object.values(PhotoTags).filter((tag) => {
    return (
      tag.toLowerCase().includes(query.toLowerCase()) ||
      tagMetadata[tag].name.toLowerCase().includes(query.toLowerCase())
    );
  });
  const tagNodes = await Promise.all(
    matchingTags.map(async (tag) => <TagImageCard key={tag} photoTag={tag} />),
  );

  const photoIDs = getPhotoIDs().filter((id) => {
    return (
      id.toLowerCase().includes(query.toLowerCase()) ||
      getPhotoName(id).toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <PageWrapper maxWidth="wide">
      <CustomLink href={PAGES.PHOTOGRAPHY.HOME}>
        &larr; Back to Browse
      </CustomLink>

      <SearchInput initialQuery={query} />

      {tagNodes.length > 0 && (
        <div className="my-6 w-full">
          <p>Did you mean?</p>
          <div className="my-2 grid w-full grid-cols-3 gap-4">{tagNodes}</div>
        </div>
      )}

      <div className="mt-6 md:mt-12">
        <p>
          Showing {photoIDs.length} results for &quot;{query}&quot;
        </p>
        <PhotoGallery photoIDs={photoIDs} fadeIn />
      </div>
    </PageWrapper>
  );
};

export default SearchPage;
