import { notFound, redirect } from "next/navigation";
import { PanoramaCarousel } from "./PanoramaCarousel";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import {
  getPhotoForThumbnail,
  getPhotoIDFromURLComponent,
  isThumbnail,
} from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";

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
        className="mt-16 w-full items-center space-y-4 md:space-y-8"
        maxWidth="wide"
      >
        <h3>Social Variants</h3>
        <PanoramaCarousel photoID={photoID} />
      </PageWrapper>
    </>
  );
};

export default PhotoSocialsPage;
