import Link from "next/link";
import { siteMetadata } from "@/constants/siteMetadata";
import { Metadata } from "next";
import { getPosts } from "@/utils/blog/posts";
import { PAGES } from "@/utils/pages";
import moment from "moment";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  authors: {
    name: siteMetadata.author,
    url: siteMetadata.siteUrl,
  },
};

const BlogPage = () => {
  const allPostsData = getPosts();

  return (
    <PageWrapper>
      <h2>Blog</h2>
      <ul>
        {allPostsData.map(({ frontMatter }) => (
          <li key={frontMatter.slug}>
            <div className="mb-1 mt-5 font-medium">
              <Link href={PAGES.BLOG_POST(frontMatter)}>
                {frontMatter.title}
              </Link>
            </div>
            <small className="font-medium text-gray-500">
              <time dateTime={frontMatter.date.toISOString()}>
                {moment(frontMatter.date).format("MMMM DD, YYYY")}
              </time>
            </small>
          </li>
        ))}
      </ul>
    </PageWrapper>
  );
};

export default BlogPage;
