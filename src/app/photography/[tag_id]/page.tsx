import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PhotoGallery } from "@/components/organisms/PhotoGallery/PhotoGallery";
import { PhotoTags, tagMetadata } from "@/constants/photoTags";
import { getPhotosWithTag } from "@/data/photos/photoDbManager";
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

  if (!photoTag) {
    notFound();
  }

  const photoIDs = await getPhotosWithTag(photoTag);

  return (
    <PageWrapper maxWidth="wide">
      <h1 className="w-full text-center">{tagMetadata[photoTag].name}</h1>

      <PhotoGallery photoIDs={photoIDs} />
    </PageWrapper>
  );
};

export default TagPage;
