import { siteMetadata } from "@/constants/siteMetadata";
import { Metadata, NextPage } from "next";
import { PostNotFoundError, getPost } from "@/utils/blog/posts";
import moment from "moment";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { HydratedBlogPost } from "@/data/types";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

type PageParams = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params: { slug },
}: PageParams): Promise<Metadata> {
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

const BlogPostPage: NextPage<PageParams> = async ({ params: { slug } }) => {
  let post: HydratedBlogPost | undefined;
  try {
    post = await getPost(slug);
  } catch (e) {
    if (e instanceof PostNotFoundError) {
      return notFound();
    }
    console.error(e);
  }

  if (!post) {
    return notFound();
  }

  return (
    <PageWrapper>
      <p className="w-full text-center">
        <time dateTime={post.frontMatter.date.toISOString()}>
          {moment(post.frontMatter.date).format("MMMM DD, YYYY")}
        </time>
      </p>
      <h1 className="w-full text-center leading-relaxed">
        {post.frontMatter.title}
      </h1>
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
      <ReactMarkdown className="prose m-auto max-w-full lg:prose-xl">
        {post.content}
      </ReactMarkdown>
    </PageWrapper>
  );
};

export default BlogPostPage;
