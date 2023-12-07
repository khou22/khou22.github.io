import { BlogPostFrontMatter } from "@/data/types";

export const PAGES = {
  HOME: "/",
  BLOG: "/blog",
  BLOG_POST: (post: BlogPostFrontMatter) => `/blog/${post.slug}`,
  CONTACT: "/contact",
  WOOD: "/wood",
  DESIGN: "/design",
  PHOTOGRAPHY: "/photography",
  PROGRAMMING: "/programming",
};
