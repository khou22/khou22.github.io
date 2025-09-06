import { Metadata } from "next";
import { BoundingBoxClient } from "./BoundingBoxClient";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getStorePhotoIDs } from "@/utils/photos/getStorePhotoIDs";
import { getCdnAsset, getPhotoName } from "@/utils/cdn/cdnAssets";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { CDN_PUBLIC } from "@/utils/pages";

export const metadata: Metadata = {
  title: "Bounding Box Tool | Kevin Hou",
};

const BoundingBoxPage = () => {
  let imageUrl = CDN_PUBLIC.PLACEHOLDER_IMAGE;
  let imageTitle = "Placeholder Image";

  if (process.env.NODE_ENV === "production") {
    const ids = getStorePhotoIDs();
    const randomID = ids[Math.floor(Math.random() * ids.length)];
    imageUrl = getCdnAsset(randomID);
    imageTitle = getPhotoName(randomID);
  }

  return (
    <PageWrapper maxWidth="wide">
      <h1 className="mb-4 text-center leading-loose">Bounding Box Tool</h1>
      <p>
        Image:{" "}
        <CustomLink href={imageUrl} target="_blank">
          {imageTitle}
        </CustomLink>
      </p>
      <BoundingBoxClient imageUrl={imageUrl} />
    </PageWrapper>
  );
};

export default BoundingBoxPage;
