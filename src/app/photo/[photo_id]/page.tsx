import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PhotoGallery } from "@/components/organisms/PhotoGallery/PhotoGallery";
import { PhotoTags, tagMetadata } from "@/constants/photoTags";
import { getPhotosWithTag } from "@/data/photos/photoDbManager";
import {
  castPhotoID,
  getCdnAsset,
  getPhotoIDFromURLComponent,
  getPhotoName,
} from "@/utils/cdn/cdnAssets";
import _ from "lodash";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

export type PageProps = {
  params: {
    /**
     * The URL component for the photo ID (ie. removed the leading `photography/)
     */
    photo_id: string;
  };
};

export const generateMetadata = ({
  params: { photo_id: photoIdURLComponent },
}: PageProps): Metadata => {
  const photoID = getPhotoIDFromURLComponent(photoIdURLComponent);
  if (!photoID) {
    notFound();
  }

  return {
    title: `${getPhotoName(photoID)} | Kevin Hou Photography`,
  };
};

const PhotoByIDPage = async ({
  params: { photo_id: photoIdURLComponent },
}: PageProps) => {
  const photoID = getPhotoIDFromURLComponent(photoIdURLComponent);
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
