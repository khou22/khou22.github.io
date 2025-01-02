import {
  PhotoIdType,
  getCdnAsset,
  getPhotoURLComponent,
} from "./cdn/cdnAssets";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { tagMetadata } from "@/constants/photoTags/tagMetadata";
import { BlogPostFrontMatter } from "@/data/types";

/**
 * Pages used to navigate the site.
 */
export const PAGES = {
  HOME: "/",
  BLOG: "/blog",
  BLOG_POSTS: "/blog#posts",
  BLOG_POST: (post: BlogPostFrontMatter) => post.link || `/blog/${post.slug}`,
  BLOG_TAG: (tag: string) => `/blog/tag/${tag}`,
  CONTACT: "/contact",
  WOOD: "/wood",
  DESIGN: "/design",
  PHOTOGRAPHY: {
    HOME: "/photography",
    FEATURED: "/photography/featured",
    BROWSE: "/photography#browse",
    LOCATIONS: "/photography#locations",
    CATEGORIES: "/photography#categories",
    TAG: (tag: PhotoTags) => `/photography/${tagMetadata[tag].slug}`,
    PHOTO: (photoID: PhotoIdType) =>
      `/photography/photo/${getPhotoURLComponent(photoID)}`,
    PRODUCT_VALIDATION: (photoID: PhotoIdType) =>
      `/api/product/${getPhotoURLComponent(photoID)}/pricing.json`,
    AERIAL_SF: "/photography/aerial-sf",
    SAN_FRANCISCAN: "/photography/san-franciscan",
    FARLEYS_POTRERO: "/photography/farleys-potrero-artist-of-the-month",
    ALBUM_COVER: (tag: PhotoTags) =>
      `/photography/${tagMetadata[tag].slug}/cover.png`,
  },
  SHARE: {
    ALBUM: (albumID: string) => `/share/${albumID}`,
    ALBUM_COVER: (albumID: string) => `/share/${albumID}/cover.png`,
  },
  PROGRAMMING: "/programming",
  CODEIUM_DEMO: "/programming/codeium",
  BROWSER_HOMEPAGE: "/programming/browser-home-page",
  ADMIN: {
    PHOTOGRAPHY: "/admin/photos",
    ALL_PHOTOS: (page: number) => `/admin/photos/all/${page}`,
    SUBDIRECTORY: (dirName: string) => `/admin/photos/${dirName}`,
    SEARCH: (query: string) => `/admin/photos/search/${query}`,
  },
  REDIRECTS: {
    FARLEYS: "/r/farleys",
  },
};

export const CDN_DOCUMENTS = {
  DOCUMENTS: {
    PATENTS: {
      "10761818": getCdnAsset("documents/patents/kevin_hou_us_10761818_pdf"),
      "10928982": getCdnAsset("documents/patents/kevin_hou_us_10928982_pdf"),
      "10949174": getCdnAsset("documents/patents/kevin_hou_us_10949174_pdf"),
    },
  },
};
