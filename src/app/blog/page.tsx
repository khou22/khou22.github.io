import { Metadata } from "next";
import { BlogPageContent } from "./BlogPageContent";

export const metadata: Metadata = {
  title: "Kevin Hou's Blog",
};

const BlogPage = () => <BlogPageContent page={1} />;

export default BlogPage;
