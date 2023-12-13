import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PhotoGallery } from "@/components/organisms/PhotoGallery/PhotoGallery";
import { PhotoTags, tagMetadata } from "@/constants/photoTags";
import { getPhotosWithTag } from "@/data/photos/photoDbManager";
import { castPhotoID, getCdnAsset, getPhotoName } from "@/utils/cdn/cdnAssets";
import _ from "lodash";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

export type PageProps = {
  params: {
    photo_id: string;
  };
};

export const generateMetadata = ({ params }: PageProps): Metadata => {
  const photoID = castPhotoID(params.photo_id);
  if (!photoID) {
    notFound();
  }

  return {
    title: `${getPhotoName(photoID)} | Kevin Hou Photography`,
  };
};

const PhotoByIDPage = async ({ params }: PageProps) => {
  const photoID = castPhotoID(params.photo_id);
  if (!photoID) {
    notFound();
  }

  return (
    <PageWrapper maxWidth="wide">
      <h1 className="w-full text-center">{getPhotoName(photoID)}</h1>
      <Image
        src={getCdnAsset(photoID)}
        alt={getPhotoName(photoID)}
        width={600}
        height={600}
        className="object-contain"
      />
    </PageWrapper>
  );
};

export default PhotoByIDPage;
