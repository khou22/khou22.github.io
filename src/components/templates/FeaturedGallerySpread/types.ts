import { PhotoIdType } from "@/utils/cdn/cdnAssets";

export type ContentNode = string | JSX.Element;

export type PhotoFeature = {
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
