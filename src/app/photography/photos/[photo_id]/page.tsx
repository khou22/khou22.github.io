import { notFound, redirect } from "next/navigation";
import { getPhotoIDFromURLComponent } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";

export type PageProps = {
  params: {
    /**
     * The URL component for the photo ID (ie. removed the leading `photography/)
     */
    photo_id: string;
  };
};

/**
 * Redirects to the new photo page for the given photo ID.
 */
const RedirectPhotoPage = ({
  params: { photo_id: photoIdURLComponent },
}: PageProps) => {
  // Parse URL component into string.
  const photoIdStr = decodeURIComponent(photoIdURLComponent);

  // Remove all non-alphanumeric characters.
  let maybePhotoID = photoIdStr.replace(/[^a-zA-Z0-9/]+/g, "_");
  if (!maybePhotoID.endsWith("_jpg")) {
    maybePhotoID = `${maybePhotoID}_jpg`;
  }

  const photoID = getPhotoIDFromURLComponent(maybePhotoID);
  if (!photoID) {
    notFound();
  }

  redirect(PAGES.PHOTOGRAPHY.PHOTO(photoID));
};

export default RedirectPhotoPage;
