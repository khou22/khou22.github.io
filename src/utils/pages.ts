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
    AERIAL: "/photography/aerial",
  },
  PROGRAMMING: "/programming",
  ADMIN: {
    PHOTO: (page: number) => `/admin/photos/${page}`,
  },
};
