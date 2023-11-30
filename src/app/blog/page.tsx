import Link from "next/link";
import { siteMetadata } from "@/constants/siteMetadata";
import { Metadata } from "next";
import { getPosts } from "@/utils/blog/posts";
import { PAGES } from "@/utils/pages";
import moment from "moment";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import Image from "next/image";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";

export const metadata: Metadata = {
  title: "Kevin Hou's Blog",
};

const BlogPage = () => {
  const allPostsData = getPosts();

  return (
    <>
      <div className="h-screen w-screen">
        <div className="absolute left-0 top-1/3 z-10 flex w-full flex-col items-center justify-center">
          <h1 className="text-white">Kevin Hou&apos;s Blog</h1>
        </div>
        <Image
          aria-label="blog cover"
          fill
          objectFit="cover"
          src={getCdnAsset("media/site/images/Blog_Image_jpg")}
          alt="cover"
        />
      </div>
      <PageWrapper className="min-h-screen">
        <h2 className="leading-relaxed">Blog</h2>
        <ul className="my-4 flex flex-col gap-y-4">
          {allPostsData.map(({ frontMatter }) => (
            <li
              key={frontMatter.slug}
              className="flex flex-col items-start justify-start gap-y-1"
            >
              <CustomLink href={PAGES.BLOG_POST(frontMatter)}>
                <h6>{frontMatter.title}</h6>
              </CustomLink>
              <p className="caption">{frontMatter.description}</p>
              <small className="caption mt-1 italic">
                <time dateTime={frontMatter.date.toISOString()}>
                  {moment(frontMatter.date).format("MMMM DD, YYYY")}
                </time>
              </small>
            </li>
          ))}
        </ul>
      </PageWrapper>
    </>
  );
};

export default BlogPage;
