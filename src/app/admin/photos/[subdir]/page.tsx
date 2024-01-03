import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";
import { getMetadataByPhotoID } from "@/data/photos/photoDbManager";
import { notFound } from "next/navigation";
import { PhotoManagementCard } from "@/components/molecules/PhotoManagementCard/PhotoManagementCard";
import { getPhotoPath } from "@/utils/cdn/cdnAssets";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { PAGES } from "@/utils/pages";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

type PageProps = {
  params: {
    subdir: string;
  };
};

const PhotoAdminSubdirectoryPage: React.FC<PageProps> = async ({ params }) => {
  const photoIDs = getPhotoIDs().filter((id) => {
    return id.startsWith(`photography/${params.subdir}`);
  });
  if (photoIDs.length === 0) {
    notFound();
  }

  const tagsByPhotoID = await getMetadataByPhotoID();

  return (
    <PageWrapper maxWidth="wide">
      <div>
        <CustomLink
          href={PAGES.ADMIN.PHOTOGRAPHY}
          className="flex flex-row items-center justify-start space-x-1"
        >
          <ArrowLeftIcon className="inline h-4 w-4" />
          <span>Back to Admin</span>
        </CustomLink>
      </div>
      <h1>Photos in {params.subdir}/</h1>
      <p>Number of Photos: {photoIDs.length}</p>
      <div className="grid grid-cols-1 gap-4">
        {photoIDs.map((photoID) => (
          <PhotoManagementCard
            key={photoID}
            imageKey={photoID}
            path={getPhotoPath(photoID)}
            tagIDs={tagsByPhotoID[photoID]?.tags ?? []}
            rating={tagsByPhotoID[photoID]?.rating ?? 0}
          />
        ))}
      </div>
    </PageWrapper>
  );
};

export default PhotoAdminSubdirectoryPage;
