import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ProductDetails } from "./ProductDetails";
import { ImageDisplay } from "./ImageDisplay";
import { ProgressiveImage } from "@/components/atoms/ProgressiveImage/ProgressiveImage";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import {
  getCdnAsset,
  getPhotoForThumbnail,
  getPhotoIDFromURLComponent,
  getPhotoName,
  isThumbnail,
} from "@/utils/cdn/cdnAssets";
import { getTagsForPhotoID } from "@/data/photos/photoDbManager";
import { PhotoTags } from "@/constants/photoTags/photoTags";
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
import { Button } from "@/components/ui/button";
import { getSuggestedPhotos } from "@/utils/photos/getSuggestedPhotos";
import { PhotoImage } from "@/components/atoms/PhotoImage/PhotoImage";
import { PhotoTagBadge } from "@/components/atoms/PhotoTagBadge/PhotoTagBadge";
import { getPhotoSize } from "@/utils/photos/getPhotoSize";

export type PageProps = {
  params: {
    /**
     * The URL component for the photo ID (ie. removed the leading `photography/)
     */
    photo_id: string;
  };
};

export const generateMetadata = async ({
  params: { photo_id: photoIdURLComponent },
}: PageProps): Promise<Metadata> => {
  const photoID = getPhotoIDFromURLComponent(photoIdURLComponent);
  if (!photoID) {
    notFound();
  }

  // Don't allow accessing thumbnails.
  if (isThumbnail(photoID)) {
    const originalPhotoID = getPhotoForThumbnail(photoID);
    if (!originalPhotoID) {
      notFound();
    }
    redirect(PAGES.PHOTOGRAPHY.PHOTO(originalPhotoID));
  }

  const title = `${getPhotoName(photoID)} | Kevin Hou Photography`;
  const coverImage = getCdnAsset(photoID);
  const size = await getPhotoSize(photoID);
  return {
    title,
    description: siteMetadata.description,
    authors: {
      name: siteMetadata.author,
      url: siteMetadata.siteUrl,
    },
    metadataBase: new URL(siteMetadata.siteUrl),
    twitter: {
      site: siteMetadata.siteUrl,
      siteId: "khou22.com",
      creator: siteMetadata.author,
      creatorId: "@kevinhou22",
      description: siteMetadata.description,
      title: title,
      card: "summary_large_image",
      images: [
        {
          url: coverImage,
          alt: title,
          type: "image/jpeg",
          width: size.width,
          height: size.height,
        },
      ],
    },
    openGraph: {
      images: [
        {
          url: coverImage,
          alt: title,
          type: "image/jpeg",
          width: size.width,
          height: size.height,
        },
      ],
    },
  };
};

const PhotoByIDPage = async ({
  params: { photo_id: photoIdURLComponent },
}: PageProps) => {
  const photoID = getPhotoIDFromURLComponent(photoIdURLComponent);
  if (!photoID) {
    notFound();
  }

  // Don't allow accessing thumbnails.
  if (isThumbnail(photoID)) {
    const originalPhotoID = getPhotoForThumbnail(photoID);
    if (!originalPhotoID) {
      notFound();
    }
    redirect(PAGES.PHOTOGRAPHY.PHOTO(originalPhotoID));
  }

  const size = await getPhotoSize(photoID);
  const tags = await getTagsForPhotoID(photoID);
  const photoURL = `${siteMetadata.siteUrl}${PAGES.PHOTOGRAPHY.PHOTO(photoID)}`;

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
        <p className="sr-only">{getPhotoName(photoID)}</p>

        <div className="my-2 flex w-full flex-row flex-wrap items-center justify-center gap-1">
          {tags.map((tag) => (
            <PhotoTagBadge key={tag} photoTag={tag} />
          ))}
        </div>

        <div className="mb-10 w-full">
          <Label>Share</Label>
          <InputWithCopy className="w-full" text={photoURL} />
        </div>

        <Card className="m-auto">
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

        <div className="mt-16 flex w-full flex-col items-center justify-center space-y-4 md:space-y-8">
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
        </div>
      </PageWrapper>
    );
  }

  return (
    <>
      <PageWrapper className="grid h-full min-h-[75vh] grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
        <ImageDisplay photoID={photoID} />
        <ProductDetails photoID={photoID} tags={tags} photoSize={size} />
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
