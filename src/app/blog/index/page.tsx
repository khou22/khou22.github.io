import { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/utils/blog/posts";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PAGES } from "@/utils/pages";
import { HydratedBlogPost } from "@/data/types";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";

export const metadata: Metadata = {
  title: "Blog Index — Kevin Hou",
  description:
    "An alphabetical index of all blog posts, including archived ones.",
};

/**
 * Groups posts alphabetically by the first letter of their title.
 */
function groupByLetter(
  posts: HydratedBlogPost[],
): Map<string, HydratedBlogPost[]> {
  const sorted = [...posts].sort((a, b) =>
    a.frontMatter.title.localeCompare(b.frontMatter.title, "en", {
      sensitivity: "base",
    }),
  );

  const groups = new Map<string, HydratedBlogPost[]>();
  for (const post of sorted) {
    const firstChar = post.frontMatter.title[0].toUpperCase();
    const letter = /[A-Z]/.test(firstChar) ? firstChar : "#";
    if (!groups.has(letter)) {
      groups.set(letter, []);
    }
    groups.get(letter)!.push(post);
  }

  return groups;
}

const BlogIndexPage = () => {
  const allPosts = getPosts({ includeArchived: true });
  const grouped = groupByLetter(allPosts);
  const letters = Array.from(grouped.keys()).sort();

  return (
    <PageWrapper className="min-h-screen">
      <CustomLink href={PAGES.BLOG_POSTS}>&larr; Back to Blog</CustomLink>

      <h1 className="mt-4 leading-relaxed">Blog Index</h1>
      <p className="mb-6 text-sm text-gray-500">
        {allPosts.length} posts &middot; Alphabetical &middot;{" "}
        <span
          title="Archived"
          className="inline-flex items-center gap-1 text-gray-400"
        >
          📦 = archived
        </span>
      </p>

      {/* Letter jump nav */}
      <nav
        aria-label="Alphabetical navigation"
        className="mb-8 flex flex-wrap gap-2"
      >
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {letter}
          </a>
        ))}
      </nav>

      {/* Grouped list */}
      {letters.map((letter) => (
        <section key={letter} id={`letter-${letter}`} className="mb-6 w-full">
          <h2 className="mb-2 border-b border-gray-200 pb-1 text-lg font-semibold dark:border-gray-700">
            {letter}
          </h2>
          <ul className="list-none space-y-1 pl-0">
            {grouped.get(letter)!.map((post) => (
              <li key={post.frontMatter.slug} className="flex items-start">
                {post.frontMatter.archived && (
                  <span title="Archived" className="mr-2 text-sm">
                    📦
                  </span>
                )}
                <Link
                  href={PAGES.BLOG_POST(post.frontMatter)}
                  className={
                    post.frontMatter.archived
                      ? "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      : "hover:underline"
                  }
                >
                  {post.frontMatter.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </PageWrapper>
  );
};

export default BlogIndexPage;
