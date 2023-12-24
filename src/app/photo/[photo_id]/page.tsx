import { ProgressiveImage } from "@/components/atoms/ProgressiveImage/ProgressiveImage";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import {
  getCdnAsset,
  getPhotoIDFromURLComponent,
  getPhotoName,
} from "@/utils/cdn/cdnAssets";
import _ from "lodash";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetails } from "./ProductDetails";
import { getTagsForPhotoID } from "@/data/photos/photoDbManager";
import { PhotoTags } from "@/constants/photoTags";
import { siteMetadata } from "@/constants/siteMetadata";
import { PAGES } from "@/utils/pages";
import { InputWithCopy } from "@/components/molecules/InputWithCopy/InputWithCopy";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageDisplay } from "./ImageDisplay";
import { getSuggestedPhotos } from "@/utils/photos/getSuggestedPhotos";
import { ImageCard } from "@/components/molecules/ImageCard/ImageCard";
import { getPhotoProgressiveImages } from "@/utils/photos/getPhotoProgressiveImages";
import { PhotoImage } from "@/components/atoms/PhotoImage/PhotoImage";

export type PageProps = {
  params: {
    /**
     * The URL component for the photo ID (ie. removed the leading `photography/)
     */
    photo_id: string;
  };
};

export const generateMetadata = ({
  params: { photo_id: photoIdURLComponent },
}: PageProps): Metadata => {
  const photoID = getPhotoIDFromURLComponent(photoIdURLComponent);
  if (!photoID) {
    notFound();
  }

  return {
    title: `${getPhotoName(photoID)} | Kevin Hou Photography`,
  };
};

const PhotoByIDPage = async ({
  params: { photo_id: photoIdURLComponent },
}: PageProps) => {
  const photoID = getPhotoIDFromURLComponent(photoIdURLComponent);
  if (!photoID) {
    notFound();
  }
  const tags = await getTagsForPhotoID(photoID);
  const photoURL = `${siteMetadata.siteUrl}${PAGES.PHOTOGRAPHY.PHOTO(photoID)}`;

  // If a photo isn't for sale, show a different page.
  if (tags.includes(PhotoTags.NotForSale)) {
    return (
      <PageWrapper>
        <ProgressiveImage
          src={[getCdnAsset(photoID)]}
          className="max-h-[85vh] w-full rounded object-contain"
        />
        <p className="caption my-2 w-full text-center">
          This photo is not for sale.
        </p>

        <div className="mb-10 w-full">
          <Label>Share</Label>
          <InputWithCopy className="w-full" text={photoURL} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-default text-base">
              Need a photographer?
            </CardTitle>
            <CardDescription>
              Kevin Hou is a photographer based in San Francisco with an
              extensive photography portfolio across all industries.
            </CardDescription>
          </CardHeader>

          {/* TODO: Change to icons and labels. */}
          <CardContent>
            <ul className="my-1 list-inside list-disc [&>li]:text-sm">
              <li>
                <CustomLink href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Events)}>
                  Event photography
                </CustomLink>
              </li>
              <li>
                <CustomLink href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Portraits)}>
                  Portraits
                </CustomLink>
              </li>
              <li>
                <CustomLink href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Food)}>
                  Food photography
                </CustomLink>
              </li>
              <li>
                <CustomLink href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Product)}>
                  Product photography
                </CustomLink>
              </li>
              <li>
                <CustomLink href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Engagements)}>
                  Engagements
                </CustomLink>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href={PAGES.CONTACT}>
              <Button>Reach Out</Button>
            </Link>
          </CardFooter>
        </Card>
      </PageWrapper>
    );
  }

  const suggestedPhotoIDs = getSuggestedPhotos(photoID, 10);
  const suggestedPhotoNodes = suggestedPhotoIDs.map((photoID) => {
    return (
      <PhotoImage
        key={photoID}
        photoID={photoID}
        className="aspect-square h-full w-full object-contain"
        isLink
      />
    );
  });

  return (
    <>
      <PageWrapper className="grid h-full min-h-[75vh] grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
        <ImageDisplay photoID={photoID} />
        <ProductDetails photoID={photoID} tags={tags} />
      </PageWrapper>
      <PageWrapper
        className="mt-16 w-full items-center space-y-4 md:space-y-8"
        maxWidth="wide"
      >
        <h3>Suggested Photos 🎞️</h3>
        <div className="grid w-full grid-cols-3 gap-1 md:grid-cols-4 md:gap-2 lg:grid-cols-5 lg:gap-3">
          {suggestedPhotoNodes}
        </div>
        <Link href={PAGES.PHOTOGRAPHY.BROWSE}>
          <Button
            variant="outline"
            className="w-full min-w-[320px] max-w-full sm:w-auto"
          >
            Browse All Photos
          </Button>
        </Link>
      </PageWrapper>
    </>
  );
};

export default PhotoByIDPage;
