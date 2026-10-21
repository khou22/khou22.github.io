import path from "path";

export const REPO_ROOT = path.resolve(__dirname, "../../..");

/**
 * The CDN root. Overridable with PHOTO_DOCS_DIR (used by tests).
 */
export const docsDir = () =>
  process.env.PHOTO_DOCS_DIR ?? path.join(REPO_ROOT, "docs");

export const photographyDir = () => path.join(docsDir(), "photography");

/**
 * Format a path for display relative to where the CLI was run.
 */
export const displayPath = (file: string) => path.relative(process.cwd(), file);
