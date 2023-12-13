import { PhotoTags, tagMetadata } from "@/constants/photoTags";
import { BlogPostFrontMatter } from "@/data/types";

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
    TAG: (tag: PhotoTags) => `/photography/${tagMetadata[tag].slug}`,
  },
  PROGRAMMING: "/programming",
  ADMIN: {
    PHOTO: (page: number) => `/admin/photos/${page}`,
  },
};
