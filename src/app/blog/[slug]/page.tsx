import { Metadata, NextPage } from "next";
import moment from "moment";
import Link from "next/link";
import { siteMetadata } from "@/constants/siteMetadata";
import { PostNotFoundError, getPost, getPosts } from "@/utils/blog/posts";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { HydratedBlogPost } from "@/data/types";
import { CustomMarkdown } from "@/components/molecules/CustomMarkdown/CustomMarkdown";
import { Badge } from "@/components/ui/badge";
import { TagIcon } from "@/components/icons/TagIcon/TagIcon";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { PAGES } from "@/utils/pages";
import { BlogPageParams } from "./types";

/**
 * Get all blog posts and generate static params. Allows for automatic memoization of these pages.
 */
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.frontMatter.slug,
  }));
}

export async function generateMetadata({
  params: { slug },
}: BlogPageParams): Promise<Metadata> {
  let post: HydratedBlogPost;
  try {
    post = await getPost(slug);
  } catch (e) {
    return {
      title: "Kevin Hou's Blog",
    };
  }

  return {
    title: post.frontMatter.title,
    description: post.frontMatter.description,
    authors: {
      name: post.frontMatter.author,
      url: siteMetadata.siteUrl,
    },
    openGraph: {
      images: [
        {
          url: post.frontMatter.image || siteMetadata.previewCard.url,
          alt: post.frontMatter.title,
          width: siteMetadata.previewCard.width,
          height: siteMetadata.previewCard.height,
        },
      ],
    },
  };
}

const PostNotFound = ({ slug }: { slug: string }) => (
  <PageWrapper>
    <CustomLink href={PAGES.BLOG_POSTS}>&larr; Back to Blog</CustomLink>
    <h1>Post Not Found</h1>
    <p>{slug}</p>
  </PageWrapper>
);

const BlogPostPage: NextPage<BlogPageParams> = async ({ params: { slug } }) => {
  let post: HydratedBlogPost | undefined;
  try {
    post = await getPost(slug);
  } catch (e) {
    if (e instanceof PostNotFoundError) {
      return <PostNotFound slug={slug} />;
    }
    console.error(e);
  }

  if (!post) {
    return <PostNotFound slug={slug} />;
  }

  return (
    <PageWrapper>
      <CustomLink href={PAGES.BLOG_POSTS}>&larr; Back to Blog</CustomLink>
      <p className="w-full text-center">
        <time dateTime={post.frontMatter.date.toISOString()}>
          {moment(post.frontMatter.date).format("MMMM D, YYYY")}
        </time>
      </p>
      <h1 className="w-full text-center leading-relaxed">
        {post.frontMatter.title}
      </h1>
      <div className="flex w-full flex-row items-center justify-center space-x-3">
        {post.frontMatter.tags.map((tag) => (
          <Link key={tag} href={PAGES.BLOG_TAG(tag)}>
            <Badge className="flex flex-row items-center justify-center space-x-1.5">
              <TagIcon className="h-4 w-4" />
              <span>{tag}</span>
            </Badge>
          </Link>
        ))}
      </div>
      <div className="mt-4 flex w-full flex-row items-center justify-between gap-x-6">
        <p>By {post.frontMatter.author}</p>
        <p>
          {Math.ceil(
            post.frontMatter.estimatedReadingTimeMS / 1000 / 60,
          ).toFixed(0)}{" "}
          minute read
        </p>
      </div>

      <div className="my-4 w-full border-b border-gray-200" />
      <CustomMarkdown className="m-auto max-w-full">
        {post.content}
      </CustomMarkdown>
    </PageWrapper>
  );
};

export default BlogPostPage;
