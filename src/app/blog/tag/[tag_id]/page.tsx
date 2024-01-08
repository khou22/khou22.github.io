import { NextPage } from "next";
import { notFound } from "next/navigation";
import { TagIcon } from "@/components/icons/TagIcon/TagIcon";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PostList } from "@/components/organisms/PostList/PostList";
import { Badge } from "@/components/ui/badge";
import { getPostsByTag } from "@/utils/blog/posts";

type PageParams = {
  params: {
    tag_id: string;
  };
};

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
