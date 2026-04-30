import { resolveBlogImage } from "./cdnAssets";

describe("resolveBlogImage", () => {
  test("should resolve valid registered blog image path", () => {
    const resolved = resolveBlogImage("/media/blog/images/windsurf_web_search_tutorial/docs_mentions.png");
    expect(resolved).toContain("/media/blog/images/windsurf-web-search-tutorial/docs-mentions.png");
  });

  test("should resolve valid blog image path without leading slash", () => {
    const resolved = resolveBlogImage("media/blog/images/windsurf_web_search_tutorial/docs_mentions.png");
    expect(resolved).toContain("/media/blog/images/windsurf-web-search-tutorial/docs-mentions.png");
  });

  test("should handle special characters and sanitize correctly", () => {
    const resolved = resolveBlogImage("/media/blog/images/YouTube Channel Artwork/Desktop Size.png");
    expect(resolved).toContain("/media/blog/images/YouTube%20Channel%20Artwork/Desktop%20Size.png");
  });

  test("should return original path if not found in registered assets", () => {
    const unresolved = resolveBlogImage("/media/blog/images/non_existent_image.png");
    expect(unresolved).toBe("/media/blog/images/non_existent_image.png");
  });

  test("should handle empty string gracefully", () => {
    expect(resolveBlogImage("")).toBe("");
  });
});
