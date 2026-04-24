import { Metadata } from "next";
import { BlogCover } from "./BlogCover";
import { getPaginatedPosts } from "@/utils/blog/posts";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PostList } from "@/components/organisms/PostList/PostList";
import { Pagination } from "@/components/organisms/Pagination";

interface BlogPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const pageParam = searchParams.page;
  const currentPage =
    typeof pageParam === "string" ? parseInt(pageParam, 10) : 1;
  const page = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  const baseUrl = "https://khou22.github.io/blog";
  const canonical = page > 1 ? `${baseUrl}?page=${page}` : baseUrl;

  return {
    title: "Kevin Hou's Blog",
    alternates: {
      canonical: canonical,
    },
  };
}

const BlogPage = async ({ searchParams }: BlogPageProps) => {
  const pageParam = searchParams.page;
  const currentPage =
    typeof pageParam === "string" ? parseInt(pageParam, 10) : 1;
  const page = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  const { posts, totalPages, currentPage: actualPage } = await getPaginatedPosts(page);

  const prevPage = actualPage > 1 ? actualPage - 1 : null;
  const nextPage = actualPage < totalPages ? actualPage + 1 : null;

  const baseUrl = "https://khou22.github.io/blog";
  const prevUrl = prevPage
    ? prevPage === 1
      ? baseUrl
      : `${baseUrl}?page=${prevPage}`
    : null;
  const nextUrl = nextPage ? `${baseUrl}?page=${nextPage}` : null;

  return (
    <>
      <head>
        {prevUrl && <link rel="prev" href={prevUrl} />}
        {nextUrl && <link rel="next" href={nextUrl} />}
      </head>
      <BlogCover />
      <span className="h-0 w-full" id="posts" />
      <PageWrapper className="min-h-screen">
        <h2 className="leading-relaxed">Blog</h2>
        <PostList posts={posts} />
        <Pagination 
          currentPage={actualPage} 
          totalPages={totalPages} 
          baseUrl="/blog" 
          className="mt-8"
        />
      </PageWrapper>
    </>
  );
};

export default BlogPage;
