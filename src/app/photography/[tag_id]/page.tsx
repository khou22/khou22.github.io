import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PhotoGallery } from "@/components/organisms/PhotoGallery/PhotoGallery";
import { PhotoTags, tagMetadata } from "@/constants/photoTags";
import { getPhotosWithTag } from "@/data/photos/photoDbManager";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import _ from "lodash";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    tag_id: string;
  };
};

export const generateMetadata = ({ params }: PageProps): Metadata => {
  const photoTag = _.findKey(
    tagMetadata,
    ({ slug }) => slug === params.tag_id,
  ) as PhotoTags;

  if (!photoTag) {
    notFound();
  }

  return {
    title: `${tagMetadata[photoTag].name} | Kevin Hou Photography`,
  };
};

const TagPage = async ({ params }: PageProps) => {
  const photoTag = _.findKey(
    tagMetadata,
    ({ slug }) => slug === params.tag_id,
  ) as PhotoTags;
  const metadata = tagMetadata[photoTag];

  if (!photoTag) {
    notFound();
  }

  const photoIDs = await getPhotosWithTag(photoTag);

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
          className="animate-overlay-show h-40 w-40 rounded-full border-4 border-blue object-cover opacity-0"
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
    </PageWrapper>
  );
};

export default TagPage;
