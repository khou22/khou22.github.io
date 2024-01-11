import React from "react";
import moment from "moment";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { LinkExternalIcon } from "@/components/icons/LinkExternalIcon/LinkExternalIcon";
import { HydratedBlogPost } from "@/data/types";
import { PAGES } from "@/utils/pages";

type PostListProps = {
  posts: HydratedBlogPost[];
};

export const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <ul className="my-4 flex flex-col gap-y-4">
      {posts.map(({ frontMatter }) => {
        const link = PAGES.BLOG_POST(frontMatter);
        const isExternal = link.startsWith("http");
        return (
          <li
            key={frontMatter.slug}
            className="flex flex-col items-start justify-start gap-y-1"
          >
            <CustomLink href={link} target={isExternal ? "_blank" : undefined}>
              <h6>
                {frontMatter.title}
                {isExternal && (
                  <LinkExternalIcon className="mb-1 ml-1 inline-block h-4 w-4" />
                )}
              </h6>
            </CustomLink>
            <p className="caption">{frontMatter.description}</p>
            <small className="caption mt-1 italic">
              <time dateTime={frontMatter.date.toISOString()}>
                {moment(frontMatter.date).format("MMMM D, YYYY")}
              </time>
            </small>
          </li>
        );
      })}
    </ul>
  );
};
