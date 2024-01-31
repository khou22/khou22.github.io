import { MetadataRoute } from "next";
import { siteMetadata } from "@/constants/siteMetadata";
import { getPosts } from "@/utils/blog/posts";
import { PAGES } from "@/utils/pages";
import { getAllPhotographyPhotoIDs } from "@/utils/cdn/cdnAssets";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { tagMetadata } from "@/constants/photoTags/tagMetadata";

enum SiteMapPriority {
  /**
   * The highest priority.
   */
  HIGHEST = 1.0,

  /**
   * Things that change frequently.
   */
  HIGH = 0.8,

  /**
   * Articles, blog posts, category pages, FAQs, system pages. The bulk of your site's content falls into this range.
   */
  MEDIUM = 0.5,

  /**
   * Normal content that doesn't change all that frequently.
   */
  LOW = 0.4,

  /**
   * Old news posts, outdated guides, irrelevant pages you nevertheless don't want to delete, merge, or update.
   */
  LOWEST = 0.2,
}

const getBlogSiteMap = async (): Promise<MetadataRoute.Sitemap> => {
  const blogPosts = await getPosts();

  let latestPost = new Date(2015, 0, 1);
  const blogTags = new Set<string>();
  const postEntries: MetadataRoute.Sitemap = [];

  blogPosts.forEach((post) => {
    // Track the latest post date in the blog index.
    if (post.frontMatter.date > latestPost) {
      latestPost = post.frontMatter.date;
    }

    // Track tags
    post.frontMatter.tags.forEach((tag) => {
      blogTags.add(tag);
    });

    const href = PAGES.BLOG_POST(post.frontMatter);
    const isExternal = !href.startsWith("/");

    // Skip external blog post references.
    if (isExternal) return;

    postEntries.push({
      url: `${siteMetadata.siteUrl}${href}`,
      lastModified: post.frontMatter.date,
      changeFrequency: "daily",
      priority: SiteMapPriority.MEDIUM,
    });
  });

  const postTagsEntries: MetadataRoute.Sitemap = Array.from(blogTags).map(
    (tag) => {
      return {
        url: `${siteMetadata.siteUrl}${PAGES.BLOG_TAG(tag)}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: SiteMapPriority.MEDIUM,
      };
    },
  );

  const blogHomepage: MetadataRoute.Sitemap = [
    {
      url: `${siteMetadata.siteUrl}${PAGES.BLOG}`,
      lastModified: latestPost,
      changeFrequency: "hourly",
      priority: SiteMapPriority.HIGHEST,
    },
  ];

  return blogHomepage.concat(postTagsEntries).concat(postEntries);
};

const getPhotoSiteMap = async (): Promise<MetadataRoute.Sitemap> => {
  const allPhotos = await getAllPhotographyPhotoIDs();
  const photoPages: MetadataRoute.Sitemap = allPhotos.map((photo) => {
    return {
      url: `${siteMetadata.siteUrl}${PAGES.PHOTOGRAPHY.PHOTO(photo)}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: SiteMapPriority.HIGH,
    };
  });

  const photoTagPages: MetadataRoute.Sitemap = Object.values(PhotoTags)
    .filter((tag) => !tagMetadata[tag].hidden && tag !== PhotoTags.NotForSale)
    .map((tag) => {
      return {
        url: `${siteMetadata.siteUrl}${PAGES.PHOTOGRAPHY.TAG(tag)}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority:
          tag === PhotoTags.Featured
            ? SiteMapPriority.HIGHEST
            : SiteMapPriority.HIGH,
      };
    });

  const mainPhotoPages: MetadataRoute.Sitemap = [
    {
      url: `${siteMetadata.siteUrl}${PAGES.PHOTOGRAPHY.HOME}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: SiteMapPriority.HIGHEST,
    },
    {
      url: `${siteMetadata.siteUrl}${PAGES.PHOTOGRAPHY.AERIAL_SF}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: SiteMapPriority.HIGH,
    },
  ];

  return mainPhotoPages.concat(photoTagPages).concat(photoPages);
};

/**
 * Generates the sitemap for search engine optimization.
 *
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogSitemap = await getBlogSiteMap();
  const photoSitemap = await getPhotoSiteMap();

  const mainPagesSitemap: MetadataRoute.Sitemap = [
    {
      url: siteMetadata.siteUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: SiteMapPriority.HIGHEST,
    },
    {
      url: `${siteMetadata.siteUrl}${PAGES.CONTACT}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: SiteMapPriority.HIGH,
    },
    {
      url: `${siteMetadata.siteUrl}${PAGES.WOOD}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: SiteMapPriority.MEDIUM,
    },
    {
      url: `${siteMetadata.siteUrl}${PAGES.DESIGN}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: SiteMapPriority.MEDIUM,
    },
    {
      url: `${siteMetadata.siteUrl}${PAGES.PROGRAMMING}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: SiteMapPriority.MEDIUM,
    },
  ];

  return mainPagesSitemap.concat(blogSitemap).concat(photoSitemap);
}
