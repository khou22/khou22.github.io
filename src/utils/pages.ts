import { PhotoTags, tagMetadata } from "@/constants/photoTags";
import { BlogPostFrontMatter } from "@/data/types";
import { PhotoIdType } from "./cdn/cdnAssets";

export const PAGES = {
  HOME: "/",
  BLOG: "/blog",
  BLOG_POST: (post: BlogPostFrontMatter) => `/blog/${post.slug}`,
  CONTACT: "/contact",
  WOOD: "/wood",
  DESIGN: "/design",
  PHOTOGRAPHY: {
    HOME: "/photography",
    FEATURED: "/photography/featured",
    LOCATIONS: "/photography#locations",
    TAG: (tag: PhotoTags) => `/photography/${tagMetadata[tag].slug}`,
    PHOTO: (photoID: PhotoIdType) => `/photo/${photoID}`,
  },
  PROGRAMMING: "/programming",
  ADMIN: {
    PHOTO: (page: number) => `/admin/photos/${page}`,
  },
};
