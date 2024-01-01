import { Metadata } from "next";
import { getPosts } from "@/utils/blog/posts";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import Image from "next/image";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PostList } from "@/components/organisms/PostList/PostList";
import { FadeInView } from "@/components/atoms/FadeInView/FadeInView";

export const metadata: Metadata = {
  title: "Kevin Hou's Blog",
};

const BlogPage = () => {
  const allPostsData = getPosts();

  return (
    <>
      <div className="relative h-screen w-screen">
        <div className="absolute left-0 top-[22%] z-10 flex w-full flex-col items-center justify-center">
          <FadeInView once>
            <img
              alt="Kevin Hou blog cover image"
              src={getCdnAsset("media/site/images/Blog_Landing_Content_png")}
              className="max-w-[500px] sm:max-w-[700px] md:max-w-[900px] 2xl:max-w-[1000px]"
            />
          </FadeInView>
        </div>
        <Image
          fill
          src={getCdnAsset("media/site/images/Blog_Image_jpg")}
          className="object-cover"
          alt="Kevin Hou blog cover photo of basket weaving cutting boards"
        />
      </div>
      <span className="h-0 w-full" id="posts" />
      <PageWrapper className="min-h-screen">
        <h2 className="leading-relaxed">Blog</h2>
        <PostList posts={allPostsData} />
      </PageWrapper>
    </>
  );
};

export default BlogPage;
