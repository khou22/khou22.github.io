export type BlogPostFrontMatter = {
  title: string;
  author: string;
  date: Date;
  description: string;

  /**
   * Instead of rendering the contents of the blog post, link to a hard coded page URL. Can be
   * a site URL or an external URL.
   */
  link: string | null;

  /**
   * If the image is null, a default post card will be used.
   */
  image: string | null;

  tags: string[];
  featured: boolean;

  /**
   * Estimated number of milliseconds to read the blog post.
   */
  estimatedReadingTimeMS: number;
  wordCount: number;

  /**
   * URL safe string generated based on the file name.
   */
  slug: string;
};

export type HydratedBlogPost = {
  /**
   * Metadata associated with the blog post.
   */
  frontMatter: BlogPostFrontMatter;

  /**
   * Actual Markdown contents of the blog post.
   */
  content: string;
};
