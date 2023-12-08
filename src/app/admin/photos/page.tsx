import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";
import { PhotoManagementCard } from "./PhotoManagementCard";
import { getTagsByPhotoID } from "@/data/photos/photoDbManager";

const PhotoAdminPage = async () => {
  const photoIDs = getPhotoIDs();
  const tagsByPhotoID = await getTagsByPhotoID();

  return (
    <PageWrapper maxWidth="wide">
      <h1>All Photos</h1>
      <p>Number of Photos: {photoIDs.length}</p>
      <div className="grid grid-cols-1 gap-4">
        {photoIDs.slice(0, 20).map((photoID) => (
          <PhotoManagementCard
            key={photoID}
            imageKey={photoID}
            tagIDs={tagsByPhotoID[photoID] ?? []}
          />
        ))}
      </div>
    </PageWrapper>
  );
};

export default PhotoAdminPage;
