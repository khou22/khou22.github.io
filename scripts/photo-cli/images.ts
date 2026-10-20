import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import sharp from "sharp";
import { CliError } from "./resolve";

export const REPO_ROOT = path.resolve(__dirname, "../..");
export const DOCS_DIR = path.join(REPO_ROOT, "docs");
export const PHOTOGRAPHY_DIR = path.join(DOCS_DIR, "photography");

const jpegRegex = /\.jpe?g$/i;
const placeholderRegex = /\.placeholder\.jpe?g$/i;

export const isPlaceholder = (file: string) => placeholderRegex.test(file);

export const thumbnailPathFor = (file: string) =>
  file.replace(/\.(jpe?g)$/i, ".placeholder.$1");

export const humanBytes = (numBytes: number): string => {
  let value = numBytes;
  for (const unit of ["B", "KB", "MB", "GB"]) {
    if (Math.abs(value) < 1024) return `${value.toFixed(2)} ${unit}`;
    value /= 1024;
  }
  return `${value.toFixed(2)} TB`;
};

/**
 * Recursively collect JPEGs under the given files/directories.
 */
export const collectJpegs = (
  targets: string[],
  { includePlaceholders }: { includePlaceholders: boolean },
): string[] => {
  const files: string[] = [];
  const visit = (target: string) => {
    if (!fs.existsSync(target)) {
      throw new CliError(`No such file or directory: ${target}`);
    }
    if (fs.statSync(target).isDirectory()) {
      fs.readdirSync(target)
        .sort()
        .forEach((child) => visit(path.join(target, child)));
      return;
    }
    if (!jpegRegex.test(target)) return;
    if (!includePlaceholders && isPlaceholder(target)) return;
    files.push(target);
  };
  targets.forEach((target) => visit(path.resolve(target)));
  return files;
};

/**
 * Resize an image to fit within the given bounds (never enlarging) and save
 * it as an optimized JPEG. EXIF orientation is baked into the pixels.
 */
export const resizeJpeg = async (
  src: string,
  dest: string,
  {
    width,
    height,
    quality,
  }: { width?: number; height?: number; quality: number },
): Promise<Buffer> => {
  const output = await sharp(src)
    .rotate()
    .resize({ width, height, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
  await fs.promises.writeFile(dest, output);
  return output;
};

const dimensions = async (file: string) => {
  const { width, height } = await sharp(file).metadata();
  return `${width}x${height}`;
};

const relative = (file: string) => path.relative(REPO_ROOT, file);

/**
 * Compress JPEGs that are over the size limit. Panoramas are allowed to be
 * very wide; everything else is capped by height.
 */
export const cleanImages = async ({
  targets,
  maxKb,
  quality,
  dryRun,
}: {
  targets: string[];
  maxKb: number;
  quality: number;
  dryRun: boolean;
}) => {
  const files = collectJpegs(targets.length ? targets : [DOCS_DIR], {
    includePlaceholders: true,
  });
  let numOversized = 0;
  let numFixed = 0;
  let numUnchanged = 0;
  let bytesSaved = 0;

  for (const file of files) {
    const size = fs.statSync(file).size;
    if (size <= maxKb * 1024) continue;
    numOversized += 1;

    const originalDims = await dimensions(file);
    const row = `${relative(file).padEnd(80)}${humanBytes(size).padEnd(
      14,
    )}${originalDims.padEnd(12)}`;
    if (dryRun) {
      console.log(row);
      continue;
    }

    const output = await sharp(file)
      .rotate()
      .resize({
        width: 15000,
        height: 3000,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();

    if (output.length >= size) {
      numUnchanged += 1;
      console.log(`${row}skipped (re-encode would not shrink it)`);
      continue;
    }

    await fs.promises.writeFile(file, output);
    numFixed += 1;
    bytesSaved += size - output.length;
    console.log(
      `${row}-> ${humanBytes(output.length).padEnd(14)}${(
        await dimensions(file)
      ).padEnd(12)}-${humanBytes(size - output.length)}`,
    );
  }

  console.log(`
Image Cleaning ${dryRun ? "(dry run) " : ""}Complete:
    🛠️ Oversized: ${numOversized} over ${humanBytes(maxKb * 1024)}
    ✅ Compressed: ${numFixed}
    ⏭️ Unchanged: ${numUnchanged}
    📷 Scanned: ${files.length} images
    🗃️ Saved: ${humanBytes(bytesSaved)}`);
  if (dryRun && numOversized > 0) {
    console.log("\nRe-run with --no-dry-run to compress.");
  }
};

/**
 * Generate `.placeholder.jpg` thumbnails for photos that are missing one or
 * whose thumbnail is over the size limit.
 */
export const generateThumbnails = async ({
  targets,
  maxKb,
  size,
  quality,
  force,
  dryRun,
}: {
  targets: string[];
  maxKb: number;
  size: number;
  quality: number;
  force: boolean;
  dryRun: boolean;
}) => {
  const files = collectJpegs(targets.length ? targets : [PHOTOGRAPHY_DIR], {
    includePlaceholders: false,
  });
  let numGenerated = 0;
  let numOversized = 0;
  let numSkipped = 0;

  for (const file of files) {
    const thumbnailPath = thumbnailPathFor(file);
    if (fs.existsSync(thumbnailPath) && !force) {
      if (fs.statSync(thumbnailPath).size <= maxKb * 1024) {
        numSkipped += 1;
        continue;
      }
      numOversized += 1;
    }

    if (dryRun) {
      console.log(`[dry run] Generating thumbnail for ${relative(file)}`);
      continue;
    }

    await resizeJpeg(file, thumbnailPath, {
      width: size,
      height: size,
      quality,
    });
    numGenerated += 1;
    console.log(`Generated ${relative(thumbnailPath)}`);
  }

  console.log(`
Thumbnail Generation ${dryRun ? "(dry run) " : ""}Complete:
    ✅ Generated: ${numGenerated}
    🛠️ Oversized: ${numOversized} over ${maxKb}KB
    ⏭️ Skipped: ${numSkipped} existing
    📷 Total: ${files.length} photos`);
  if (dryRun && numSkipped < files.length) {
    console.log("\nRe-run with --no-dry-run to generate.");
  }
};

/**
 * Regenerate `src/utils/cdn/cdnAssets.generated.ts` and `asset-catalog.md`.
 */
export const generateAssetMap = () => {
  const script = path.join(REPO_ROOT, "scripts/generate_assets.py");
  for (const python of ["python3", "python"]) {
    const result = spawnSync(python, [script], { stdio: "inherit" });
    if (result.error && "code" in result.error) {
      if (result.error.code === "ENOENT") continue;
    }
    if (result.status !== 0) {
      throw new CliError(`generate_assets.py failed (exit ${result.status})`);
    }
    console.log("Regenerated the CDN asset map.");
    return;
  }
  throw new CliError("Python is required to regenerate the asset map.");
};
