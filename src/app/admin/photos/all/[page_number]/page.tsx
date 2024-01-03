import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";
import { getMetadataByPhotoID } from "@/data/photos/photoDbManager";
import { PageControls } from "./PageControls";
import { PhotoManagementCard } from "@/components/molecules/PhotoManagementCard/PhotoManagementCard";
import { getPhotoPath } from "@/utils/cdn/cdnAssets";

const photosPerPage = 40;

type PageProps = {
  params: {
    page_number: string;
  };
};

const PhotoAdminPage: React.FC<PageProps> = async ({ params }) => {
  const photoIDs = getPhotoIDs();
  const tagsByPhotoID = await getMetadataByPhotoID();

  const page = Number(params.page_number);
  const startIndex = (page - 1) * photosPerPage;
  const endIndex = startIndex + photosPerPage;

  return (
    <PageWrapper maxWidth="wide">
      <h1>All Photos</h1>
      <p>Number of Photos: {photoIDs.length}</p>
      <div className="grid grid-cols-1 gap-4">
        {photoIDs.slice(startIndex, endIndex).map((photoID) => (
          <PhotoManagementCard
            key={photoID}
            path={getPhotoPath(photoID)}
            imageKey={photoID}
            tagIDs={tagsByPhotoID[photoID]?.tags ?? []}
          />
        ))}
      </div>

      <div className="my-6">
        <PageControls
          page={page}
          itemsPerPage={photosPerPage}
          totalItems={photoIDs.length}
        />
      </div>
    </PageWrapper>
  );
};

export default PhotoAdminPage;
