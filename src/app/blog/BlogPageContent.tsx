import { notFound } from "next/navigation";
import { BlogCover } from "./BlogCover";
import { getPaginatedPosts, POSTS_PER_PAGE } from "@/utils/blog/posts";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { Pagination } from "@/components/organisms/Pagination";
import { PostList } from "@/components/organisms/PostList/PostList";

type BlogPageContentProps = {
  page: number;
  showCover?: boolean;
};

export const BlogPageContent = async ({
  page,
  showCover = page === 1,
}: BlogPageContentProps) => {
  const { posts, totalPages, currentPage, totalPosts } =
    await getPaginatedPosts(page);

  if (page !== currentPage) {
    notFound();
  }

  const firstPostNumber = (currentPage - 1) * POSTS_PER_PAGE + 1;
  const lastPostNumber = firstPostNumber + posts.length - 1;
  const showPageHeader = !showCover;

  return (
    <>
      {showCover && <BlogCover />}
      <span className="h-0 w-full" id="posts" />
      <PageWrapper className="min-h-screen">
        {showPageHeader ? (
          <header className="mb-8 w-full border-b border-slate-200 pb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Page {currentPage}
            </p>
            <h2 className="leading-relaxed">Blog</h2>
            <p className="caption">
              Showing {firstPostNumber}-{lastPostNumber} out of {totalPosts}
            </p>
          </header>
        ) : (
          <h2 className="leading-relaxed">Blog</h2>
        )}
        <PostList posts={posts} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/blog"
          className="mt-8"
        />
      </PageWrapper>
    </>
  );
};
