import { NextRequest } from "next/server";
import { getPosts } from "@/utils/blog/posts";
import moment from "moment";
import { siteMetadata } from "@/constants/siteMetadata";

/**
 * Endpoint to return a clean markdwon file for the blog page.
 */
export async function GET(_req: NextRequest) {
  const allPostsData = await getPosts();

  const postMarkdownItem = allPostsData.map((post) => {
    return `## ${post.frontMatter.title}

Description: ${post.frontMatter.description}

Author: ${post.frontMatter.author || siteMetadata.author}

Published At: ${moment(post.frontMatter.date).format("llll")}

Tags: ${post.frontMatter.tags.join(", ") || "None"}`;
  });

  return new Response(`# Kevin Hou's Blog

Blog posts written over the years about programming, work, the industry, woodworking, etc.

Total posts: ${allPostsData.length}

--

${postMarkdownItem.join("\n\n")}

--

Copyright Kevin Hou ${new Date().getFullYear()}`);
}
