import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPageContent } from "../../BlogPageContent";
import { getPaginatedPosts } from "@/utils/blog/posts";

type BlogPaginatedPageProps = {
  params: {
    page_number: string;
  };
};

export const dynamicParams = false;

const parsePageNumber = (pageNumber: string) => {
  const page = parseInt(pageNumber, 10);
  return Number.isInteger(page) && page > 1 ? page : null;
};

export async function generateStaticParams(): Promise<
  BlogPaginatedPageProps["params"][]
> {
  const { totalPages } = await getPaginatedPosts(1);

  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
    page_number: String(index + 2),
  }));
}

export async function generateMetadata({
  params: { page_number },
}: BlogPaginatedPageProps): Promise<Metadata> {
  const page = parsePageNumber(page_number);

  if (!page) {
    return {
      title: "Kevin Hou's Blog",
    };
  }

  return {
    title: `Kevin Hou's Blog - Page ${page}`,
    alternates: {
      canonical: `https://khou22.github.io/blog/page/${page}`,
    },
  };
}

const BlogPaginatedPage = ({ params: { page_number } }: BlogPaginatedPageProps) => {
  const page = parsePageNumber(page_number);

  if (!page) {
    notFound();
  }

  return <BlogPageContent page={page} showCover={false} />;
};

export default BlogPaginatedPage;
