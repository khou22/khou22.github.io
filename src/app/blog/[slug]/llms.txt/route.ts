import { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import moment from "moment";
import { BlogPageParams } from "../types";
import { HydratedBlogPost } from "@/data/types";
import { getPost, PostNotFoundError } from "@/utils/blog/posts";
import { siteMetadata } from "@/constants/siteMetadata";

/**
 * Endpoint to return a clean markdown file for the blog post.
 */
export async function GET(_req: NextRequest, context: BlogPageParams) {
  const {
    params: { slug },
  } = context;

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

  const markdownStrings: string[] = [];

  // Add the front matter if applicable.
  if (post.frontMatter) {
    markdownStrings.push(`# ${post.frontMatter.title}`);
    markdownStrings.push(`Description: ${post.frontMatter.description}`);
    markdownStrings.push(
      `Author: ${post.frontMatter.author || siteMetadata.author}`,
    );
    markdownStrings.push(
      `Published At: ${moment(post.frontMatter.date).format("llll")}`,
    );
    markdownStrings.push(`Tags: ${post.frontMatter.tags.join(", ") || "None"}`);
    markdownStrings.push("--");
  }

  // Main blog post markdown content.
  markdownStrings.push(post.content);

  return new Response(markdownStrings.join("\n\n"));
}
