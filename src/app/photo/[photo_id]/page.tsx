import { ProgressiveImage } from "@/components/atoms/ProgressiveImage/ProgressiveImage";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import {
  getCdnAsset,
  getPhotoIDFromURLComponent,
  getPhotoName,
} from "@/utils/cdn/cdnAssets";
import _ from "lodash";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetails } from "./ProductDetails";

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
    <PageWrapper className="grid h-full min-h-[75vh] grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
      <ProgressiveImage
        src={[getCdnAsset(photoID)]}
        className="max-h-[85vh] w-full object-contain"
      />
      <ProductDetails photoID={photoID} />
    </PageWrapper>
  );
};

export default PhotoByIDPage;
