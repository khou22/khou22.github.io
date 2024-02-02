import { PhotoIdType, getPhotoURLComponent } from "./cdn/cdnAssets";
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
    AERIAL_SF: "/photography/aerial-sf",
    SAN_FRANCISCAN: "/photography/san-franciscan",
  },
  SHARE: {
    ALBUM: (albumID: string) => `/share/${albumID}`,
  },
  PROGRAMMING: "/programming",
  BROWSER_HOMEPAGE: "/programming/browser-home-page",
  ADMIN: {
    PHOTOGRAPHY: "/admin/photos",
    ALL_PHOTOS: (page: number) => `/admin/photos/all/${page}`,
    SUBDIRECTORY: (dirName: string) => `/admin/photos/${dirName}`,
    SEARCH: (query: string) => `/admin/photos/search/${query}`,
  },
};
