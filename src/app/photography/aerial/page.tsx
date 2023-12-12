import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PhotoTags } from "@/constants/photoTags";
import { getPhotosWithTag } from "@/data/photos/photoDbManager";
import { PhotoGallery } from "@/components/organisms/PhotoGallery/PhotoGallery";

// TODO (k): Make this a dynamic page so we can re-use the same layout.
const PhotographyAerial = async () => {
  const photoIDs = await getPhotosWithTag(PhotoTags.Drone);

  return (
    <PageWrapper maxWidth="wide">
      <h1>Aerial</h1>

      <PhotoGallery photoIDs={photoIDs} />
    </PageWrapper>
  );
};

export default PhotographyAerial;
