import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";
import { PhotoManagementCard } from "./PhotoManagementCard";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";

const PhotoAdminPage = () => {
  const photoIDs = getPhotoIDs();
  return (
    <PageWrapper maxWidth="wide">
      <h1>All Photos</h1>
      <p>Number of Photos: {photoIDs.length}</p>
      <div className="grid grid-cols-5">
        {photoIDs.map((cdnID) => (
          <PhotoManagementCard key={cdnID} imagePath={getCdnAsset(cdnID)} />
        ))}
      </div>
    </PageWrapper>
  );
};

export default PhotoAdminPage;
