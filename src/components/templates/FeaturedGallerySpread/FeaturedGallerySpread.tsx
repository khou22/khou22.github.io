import { ParallaxTextBackground } from "@/components/atoms/ParallaxTextBackground/ParallaxTextBackground";
import { PhotoImage } from "@/components/atoms/PhotoImage/PhotoImage";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { Label } from "@/components/ui/label";
import { PhotoIdType, getCdnAsset } from "@/utils/cdn/cdnAssets";

type ContentNode = string | JSX.Element;

type PhotoFeature = {
  photoID: PhotoIdType;
  label: string;
  description: ContentNode;
};

export type FeaturedGallerySpreadProps = {
  title: {
    pretext: string;
    text: string;
  };
  subtitle: string;
  project: {
    author: ContentNode;
    duration: ContentNode;
    location: ContentNode;
  };
  blockSection: {
    text: string;
    background: PhotoIdType;
  };
  cover: {
    /** Vertical image. Largest cover photo on mobile. */
    hero: PhotoIdType;

    /** Vertical image. Smallest cover photo. */
    left: PhotoIdType;

    /** Vertical image. Largest cover photo on desktop. */
    right: PhotoIdType;
  };
  features: [
    /**
     * Vertical 4:5
     */
    PhotoFeature,

    /**
     * Square
     */
    PhotoFeature,

    /**
     * Panorama, 5:2
     */
    PhotoFeature,

    /**
     * Horizontal (small)
     */
    PhotoFeature,

    /**
     * Vertical
     */
    PhotoFeature,

    /**
     * Square (large)
     */
    PhotoFeature,
  ];
};

export const FeaturedGallerySpread: React.FC<FeaturedGallerySpreadProps> = ({
  title,
  subtitle,
  project,
  blockSection,
  cover,
  features,
}) => {
  const renderContentNode = (node: ContentNode) => {
    if (typeof node === "string") {
      return <p className="text-[12px] leading-4 text-gray-600">{node}</p>;
    }
    return node;
  };

  return (
    <>
      <PageWrapper
        maxWidth="none"
        className="mt-10 grid h-auto grid-flow-row-dense grid-cols-2 gap-10 md:h-[88vh] md:max-h-[800px] md:grid-cols-5 xl:h-auto xl:max-h-none"
      >
        <div className="col-span-1 row-start-2 flex flex-col items-start justify-between space-y-12 md:row-start-auto md:h-full">
          <div className="flex min-h-[30%] flex-col items-center justify-center">
            <h3 className="italic">
              {subtitle.split(" ").map((word, index) => (
                <span key={`${word}-${index}`} className="block">
                  {word}
                  <br />
                </span>
              ))}
            </h3>
          </div>
          <div className="relative w-full grow">
            <PhotoImage
              photoID={cover.left}
              className="h-full w-full object-contain"
              isLink
              hoverAnimation="scale"
            />
          </div>
        </div>

        <div className="col-span-2 col-start-1 flex h-full flex-col items-center space-y-4 md:col-start-auto">
          <div className="grid w-full grid-cols-5 md:h-2/3">
            <div className="relative col-span-3 h-full">
              <PhotoImage
                photoID={cover.hero}
                className="h-full w-full object-contain"
                isLink
                hoverAnimation="scale"
              />
            </div>
            <div className="col-span-2 flex items-center justify-center p-4">
              <div className="[&>p]:mb-4">
                <Label>Author</Label>
                <p className="caption">{project.author}</p>

                <Label>Project Duration</Label>
                <p className="caption">{project.duration}</p>

                <Label>Location</Label>
                {renderContentNode(project.location)}
              </div>
            </div>
          </div>
          <div className="flex h-1/3 flex-col items-start justify-center pb-10 pt-6 md:pb-0 md:pt-0">
            <h6 className="mb-6 text-gray-700">{title.pretext}</h6>
            <h1 className="font-black">{title.text}</h1>
          </div>
        </div>

        <div className="col-span-1 flex h-full flex-col items-center justify-center pt-12 md:col-span-2">
          <div className="relative h-full w-full">
            <PhotoImage
              photoID={cover.right}
              className="h-full w-full object-contain"
              isLink
              hoverAnimation="scale"
            />
          </div>
        </div>
      </PageWrapper>

      <PageWrapper
        maxWidth="none"
        className="my-12 items-center md:my-16 lg:my-20 xl:my-24"
      >
        <ParallaxTextBackground
          zoomBounds={[1.7, 1]}
          transformYBounds={[0, 17]}
          parallaxWindow="screen"
          backgroundURL={`url(${getCdnAsset(blockSection.background)})`}
          className="max-w-full break-words text-center text-[4.25rem] font-black xs:text-[5.5rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] 2xl:text-[15rem]"
        >
          {blockSection.text}
        </ParallaxTextBackground>
      </PageWrapper>
      <PageWrapper
        maxWidth="wide"
        className="my-12 grid grid-cols-6 gap-2 md:my-24 md:grid-cols-12"
      >
        {/* First Row */}
        <div className="col-span-1" />
        <div className="col-span-5 flex h-full flex-row items-center justify-start space-x-2 md:col-span-3 md:flex-col">
          <div className="relative aspect-[4/5] w-full">
            <PhotoImage
              photoID={features[0].photoID}
              className="h-full w-full object-cover"
              isLink
              hoverAnimation="scale"
            />
          </div>
          <div>
            <p className="mt-2 text-sm">{features[0].label}</p>
            {renderContentNode(features[0].description)}
          </div>
        </div>
        <div className="hidden md:col-span-3 md:block" />
        <div className="col-span-4">
          <div className="relative mt-36 aspect-square w-full">
            <PhotoImage
              photoID={features[1].photoID}
              className="h-full w-full object-cover"
              isLink
              hoverAnimation="scale"
            />
          </div>
        </div>
        <div className="col-span-1 flex h-full flex-col items-center justify-center">
          <p className="text-sm">{features[1].label}</p>
          {renderContentNode(features[1].description)}
        </div>

        {/* Second Row */}
        <div className="relative col-span-5 h-full md:col-span-9">
          <PhotoImage
            photoID={features[2].photoID}
            className="h-full w-full object-cover"
            isLink
            hoverAnimation="scale"
          />
        </div>
        <div className="col-span-1 flex aspect-[2/3] w-full flex-col items-start justify-end md:col-span-3">
          <p className="text-sm">{features[2].label}</p>
          {renderContentNode(features[2].description)}
        </div>

        {/* Third Row */}
        <div className="col-span-5 flex h-full flex-col items-start justify-end pt-16 md:items-end md:pt-0">
          <p className="text-sm">{features[3].label}</p>
          {renderContentNode(features[3].description)}
        </div>
        <div className="col-span-3">
          <div className="relative aspect-[5/4] md:mt-16">
            <PhotoImage
              photoID={features[3].photoID}
              className="h-full w-full object-cover"
              isLink
              hoverAnimation="scale"
            />
          </div>
        </div>
        <div className="col-span-4" />

        {/* Fourth Row */}
        <div className="col-span-4 pl-16 md:col-span-7">
          <div className="relative mt-48 aspect-square">
            <PhotoImage
              photoID={features[4].photoID}
              className="h-full w-full object-cover"
              isLink
              hoverAnimation="scale"
            />
          </div>
        </div>
        <div className="col-span-2 flex h-full flex-col items-start justify-end">
          <p className="text-sm">{features[4].label}</p>
          {renderContentNode(features[4].description)}
        </div>
        <div className="col-span-3">
          <div className="relative aspect-[2/3]">
            <PhotoImage
              photoID={features[5].photoID}
              className="h-full w-full object-cover"
              isLink
              hoverAnimation="scale"
            />
          </div>
          <div className="text-center">
            <p className="text-sm">{features[5].label}</p>
            {renderContentNode(features[5].description)}
          </div>
        </div>
      </PageWrapper>
    </>
  );
};
