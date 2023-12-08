import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";
import { PhotoManagementCard } from "./PhotoManagementCard";

const PhotoAdminPage = () => {
  const photoIDs = getPhotoIDs();
  return (
    <PageWrapper maxWidth="wide">
      <h1>All Photos</h1>
      <p>Number of Photos: {photoIDs.length}</p>
      <div className="grid grid-cols-1 gap-4">
        {photoIDs.map((cdnID) => (
          <PhotoManagementCard key={cdnID} imageKey={cdnID} />
        ))}
      </div>
    </PageWrapper>
  );
};

export default PhotoAdminPage;
