/**
 * Allowlist of blog post image sources that are intentionally NOT hosted on the
 * CDN but are still valid and should not be flagged by the blog integrity tests.
 *
 * Most blog images are registered in `_generatedCdnAssets` and resolved
 * automatically by `resolveBlogImage`. External URLs (http://, https://, //)
 * are also skipped automatically. This set covers the remaining edge case:
 * local/relative image paths that are served directly (e.g. from Next.js's
 * `public/` directory) and were never uploaded to the CDN.
 *
 * Each entry should be the exact `src` string as it appears in the blog post
 * markdown or HTML (e.g. "/images/some-diagram.svg"). Entries here should be
 * manually reviewed and verified as valid before being added.
 *
 * If a path CAN be served from the CDN, prefer adding it there instead of
 * adding it here.
 */
export const goldenBlogImages: Set<string> = new Set([]);
