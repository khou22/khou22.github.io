import { NextPage } from "next";
import { notFound } from "next/navigation";

import { TagIcon } from "@/components/icons/TagIcon/TagIcon";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PostList } from "@/components/organisms/PostList/PostList";
import { Badge } from "@/components/ui/badge";
import { getPosts, getPostsByTag } from "@/utils/blog/posts";

type PageParams = {
  params: {
    tag_id: string;
  };
};

export async function generateStaticParams(): Promise<PageParams["params"][]> {
  const allTags = new Set<string>();
  const allPosts = await getPosts();

  // Get all distinct blog post tags.
  allPosts.forEach((post) => {
    post.frontMatter.tags.forEach((tag) => {
      allTags.add(tag);
    });
  });

  return Array.from(allTags).map((tag) => {
    return {
      tag_id: tag,
    };
  });
}

const BlogTagPage: NextPage<PageParams> = async ({ params: { tag_id } }) => {
  const posts = await getPostsByTag(tag_id);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <PageWrapper>
      <h2 className="leading-relaxed">
        {posts.length} Post{posts.length > 1 ? "s" : ""} Tagged &quot;{tag_id}
        &quot;
      </h2>
      <Badge className="flex flex-row items-center justify-center space-x-1.5">
        <TagIcon className="h-4 w-4" />
        <span>{tag_id}</span>
      </Badge>
      <PostList posts={posts} />
    </PageWrapper>
  );
};

export default BlogTagPage;
