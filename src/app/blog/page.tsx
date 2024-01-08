import { Metadata } from "next";
import { BlogCover } from "./BlogCover";
import { getPosts } from "@/utils/blog/posts";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PostList } from "@/components/organisms/PostList/PostList";

export const metadata: Metadata = {
  title: "Kevin Hou's Blog",
};

const BlogPage = () => {
  const allPostsData = getPosts();

  return (
    <>
      <BlogCover />
      <span className="h-0 w-full" id="posts" />
      <PageWrapper className="min-h-screen">
        <h2 className="leading-relaxed">Blog</h2>
        <PostList posts={allPostsData} />
      </PageWrapper>
    </>
  );
};

export default BlogPage;
