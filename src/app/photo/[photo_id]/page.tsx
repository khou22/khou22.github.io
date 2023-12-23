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
import { getTagsForPhotoID } from "@/data/photos/photoDbManager";
import { PhotoTags } from "@/constants/photoTags";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { siteMetadata } from "@/constants/siteMetadata";
import { PAGES } from "@/utils/pages";
import { InputWithCopy } from "@/components/molecules/InputWithCopy/InputWithCopy";

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
  const tags = await getTagsForPhotoID(photoID);
  const photoURL = `${siteMetadata.siteUrl}${PAGES.PHOTOGRAPHY.PHOTO(photoID)}`;

  // If a photo isn't for sale, show a different page.
  if (tags.includes(PhotoTags.NotForSale)) {
    return (
      <PageWrapper className="flex-col space-y-2">
        <ProgressiveImage
          src={[getCdnAsset(photoID)]}
          className="max-h-[85vh] w-full object-contain"
        />
        <p className="caption w-full text-center">
          This photo is not for sale.
        </p>
        <InputWithCopy className="w-full" text={photoURL} />
      </PageWrapper>
    );
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
