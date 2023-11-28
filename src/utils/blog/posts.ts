import fs from "fs";
import path from "path";

// Import 'gray-matter', library for parsing the metadata in each markdown file
import matter from "gray-matter";

import { getDataDirectory } from "@/data/dataDirs";
import { BlogPostFrontMatter } from "@/data/blog/types";

export function getPosts() {
  const postsDirectory = getDataDirectory("blog");
  const fileNames = fs.readdirSync(postsDirectory);

  // Get the data from each file
  const allPostsData = fileNames.map((filename) => {
    // Remove ".md(x)" from file name to get id
    const id = filename.replace(/\.mdx?$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8"); // .md(x) string content

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data as BlogPostFrontMatter),
    };
  });

  // Sort posts by date and return
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}
