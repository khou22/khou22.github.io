import { ArrowLeftIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { PhotoManagementCard } from "@/components/molecules/PhotoManagementCard/PhotoManagementCard";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { getMetadataByPhotoID } from "@/data/photos/photoDbManager";
import { getPhotoName, getPhotoPath } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";

import { PhotoSearchForm } from "../../PhotoSearchForm";

type PageProps = {
  params: {
    query: string[];
  };
};

const PhotoSearchPage: NextPage<PageProps> = async ({ params }) => {
  const query = decodeURIComponent(params.query.join("/"));
  if (!query) {
    notFound();
  }

  const photoIDs = getPhotoIDs().filter((id) => {
    return (
      id.toLowerCase().includes(query.toLowerCase()) ||
      getPhotoName(id).toLowerCase().includes(query.toLowerCase())
    );
  });
  const tagsByPhotoID = photoIDs.length > 0 ? await getMetadataByPhotoID() : {};

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
      <h1 className="leading-relaxed">Search Results</h1>
      <div className="my-4 w-full">
        <Label>Search for Photo</Label>
        <PhotoSearchForm initialValue={query} />
      </div>
      <p className="mb-2">Number of Photos: {photoIDs.length}</p>
      {photoIDs.length === 0 ? (
        <Alert variant="destructive" className="my-2">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error Searching Photo</AlertTitle>
          <AlertDescription>
            No results found for &quot;{query}&quot;
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {photoIDs.map((photoID) => (
            <PhotoManagementCard
              key={photoID}
              path={getPhotoPath(photoID)}
              imageKey={photoID}
              tagIDs={tagsByPhotoID[photoID]?.tags ?? []}
              rating={tagsByPhotoID[photoID]?.rating ?? 0}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default PhotoSearchPage;
