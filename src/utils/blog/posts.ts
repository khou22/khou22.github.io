import fs from "fs";
import path from "path";
import matter from "gray-matter";
import moment from "moment";
import find from "lodash/find";
import readingTime from "reading-time";
import { HydratedBlogPost } from "@/data/types";
import { getDataDirectory } from "@/data/dataDirs";

/**
 * Retrieves a list of hydrated blog posts sorted in descending order of date.
 *
 * @return {HydratedBlogPost[]} An array of hydrated blog post objects.
 */
export function getPosts(): HydratedBlogPost[] {
  const postsDirectory = getDataDirectory("blog");
  const fileNames = fs.readdirSync(postsDirectory);

  // Get the data from each file
  const allPostsData = fileNames.map((filename): HydratedBlogPost => {
    // Remove ".md(x)" from file name and replace special characters with dashes.
    const slug = filename.replace(/\.mdx?$/, "").replaceAll(/[^a-z0-9]/gi, "-");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8"); // .md(x) string content

    // Use `gray-matter` to parse the post frontmatter into metadata
    const matterResult = matter(fileContents);

    const { title, author, date: dateStr, description } = matterResult.data;
    if (!title || !author || !dateStr || !description) {
      throw new Error(`Missing metadata in ${filename}`);
    }

    const date = moment(dateStr);
    if (!date.isValid()) {
      throw new Error(`Invalid date in ${filename}`);
    }

    // Estimate reading time.
    const readingStats = readingTime(fileContents);

    // Combine the data with the id
    return {
      frontMatter: {
        title,
        author,
        date: date.toDate(),
        description,
        link: matterResult.data.link || null,
        image: matterResult.data.image || null,
        tags: matterResult.data.tags || [],
        featured: matterResult.data.featured || false,
        estimatedReadingTimeMS: readingStats.time,
        wordCount: readingStats.words,
        slug,
      },
      content: matterResult.content,
    };
  });

  // Sort posts by date and return
  return allPostsData.sort((a, b) => {
    if (a.frontMatter.date < b.frontMatter.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export class PostNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PostNotFoundError";
  }
}

export const getPost = async (slug: string): Promise<HydratedBlogPost> => {
  const posts = await getPosts();

  // Find the post using its unique slug.
  const post = find(posts, (p) => p.frontMatter.slug === slug);
  if (!post) {
    throw new PostNotFoundError(`could not find post with slug: ${slug}`);
  }

  return post;
};

export const getPostsByTag = async (
  tagID: string,
): Promise<HydratedBlogPost[]> => {
  const posts = await getPosts();
  return posts.filter((p) => p.frontMatter.tags.includes(tagID));
};
