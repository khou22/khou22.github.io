import { notFound, redirect } from "next/navigation";
import { PanoramaPostContent } from "./PanoramaCarousel";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import {
  getPhotoForThumbnail,
  getPhotoIDFromURLComponent,
  isThumbnail,
} from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";

export type PageProps = {
  params: {
    /**
     * The URL component for the photo ID (ie. removed the leading `photography/)
     */
    photo_id: string;
  };
};

const PhotoSocialsPage = async ({
  params: { photo_id: photoIdURLComponent },
}: PageProps) => {
  const photoID = getPhotoIDFromURLComponent(photoIdURLComponent);
  if (!photoID) {
    notFound();
  }

  // Don't allow accessing thumbnails.
  if (isThumbnail(photoID)) {
    const originalPhotoID = getPhotoForThumbnail(photoID);
    if (!originalPhotoID) {
      notFound();
    }
    redirect(PAGES.PHOTOGRAPHY.PHOTO(originalPhotoID));
  }

  return (
    <>
      <PageWrapper
        className="mt-16 w-full space-y-4 md:space-y-8"
        maxWidth="wide"
      >
        <CustomLink href={PAGES.PHOTOGRAPHY.PHOTO(photoID)}>
          &larr; Back to Photo
        </CustomLink>
        <h3 className="w-full text-center">Social Variants</h3>
        <PanoramaPostContent photoID={photoID} />
      </PageWrapper>
    </>
  );
};

export default PhotoSocialsPage;
