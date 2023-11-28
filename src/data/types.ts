export type BlogPostFrontMatter = {
  title: string;
  author: string;
  date: Date;
  description: string;

  /**
   * If the image is null, a default post card will be used.
   */
  image: string | null;

  tags: string[];
  featured: boolean;

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
