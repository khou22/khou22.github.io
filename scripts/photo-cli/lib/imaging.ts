import fs from "fs";
import path from "path";
import sharp from "sharp";
import { displayPath, docsDir, photographyDir } from "./config";
import { CliError } from "./errors";

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
 * Recursively collect JPEGs under the given files/directories, sorted.
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

export const dimensions = async (file: string | Buffer) => {
  const { width, height } = await sharp(file).metadata();
  return { width: width ?? 0, height: height ?? 0 };
};

const formatDimensions = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => `${width}x${height}`;

/**
 * Re-encode an image to fit within the given bounds (never enlarging) as an
 * optimized JPEG. EXIF orientation is baked into the pixels.
 */
export const encodeJpeg = (
  src: string,
  {
    width,
    height,
    quality,
  }: { width?: number; height?: number; quality: number },
): Promise<Buffer> =>
  sharp(src)
    .rotate()
    .resize({ width, height, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();

/**
 * Resize `src` and write the result to `dest` (which may be `src`).
 */
export const resizeJpeg = async (
  src: string,
  dest: string,
  options: { width?: number; height?: number; quality: number },
): Promise<Buffer> => {
  const output = await encodeJpeg(src, options);
  await fs.promises.writeFile(dest, output);
  return output;
};

export type CleanStats = {
  scanned: number;
  oversized: number;
  compressed: number;
  unchanged: number;
  bytesSaved: number;
};

/**
 * Compress JPEGs that are over the size limit. Panoramas are allowed to be
 * very wide; everything else is capped at 3000px tall.
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
}): Promise<CleanStats> => {
  const files = collectJpegs(targets.length ? targets : [docsDir()], {
    includePlaceholders: true,
  });
  const stats: CleanStats = {
    scanned: files.length,
    oversized: 0,
    compressed: 0,
    unchanged: 0,
    bytesSaved: 0,
  };

  for (const file of files) {
    const size = fs.statSync(file).size;
    if (size <= maxKb * 1024) continue;
    stats.oversized += 1;

    const row = `${displayPath(file).padEnd(80)}${humanBytes(size).padEnd(
      14,
    )}${formatDimensions(await dimensions(file)).padEnd(12)}`;
    if (dryRun) {
      console.log(row);
      continue;
    }

    const output = await encodeJpeg(file, {
      width: 15000,
      height: 3000,
      quality,
    });
    if (output.length >= size) {
      stats.unchanged += 1;
      console.log(`${row}skipped (re-encode would not shrink it)`);
      continue;
    }

    await fs.promises.writeFile(file, output);
    stats.compressed += 1;
    stats.bytesSaved += size - output.length;
    console.log(
      `${row}-> ${humanBytes(output.length).padEnd(14)}${formatDimensions(
        await dimensions(output),
      ).padEnd(12)}-${humanBytes(size - output.length)}`,
    );
  }

  console.log(`
Image Cleaning ${dryRun ? "(dry run) " : ""}Complete:
    🛠️ Oversized: ${stats.oversized} over ${humanBytes(maxKb * 1024)}
    ✅ Compressed: ${stats.compressed}
    ⏭️ Unchanged: ${stats.unchanged}
    📷 Scanned: ${stats.scanned} images
    🗃️ Saved: ${humanBytes(stats.bytesSaved)}`);
  if (dryRun && stats.oversized > 0) {
    console.log("\nRe-run with --no-dry-run to compress.");
  }
  return stats;
};

export type ThumbnailStats = {
  total: number;
  generated: number;
  pending: number;
  oversized: number;
  skipped: number;
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
}): Promise<ThumbnailStats> => {
  const files = collectJpegs(targets.length ? targets : [photographyDir()], {
    includePlaceholders: false,
  });
  const stats: ThumbnailStats = {
    total: files.length,
    generated: 0,
    pending: 0,
    oversized: 0,
    skipped: 0,
  };

  for (const file of files) {
    const thumbnailPath = thumbnailPathFor(file);
    if (fs.existsSync(thumbnailPath) && !force) {
      if (fs.statSync(thumbnailPath).size <= maxKb * 1024) {
        stats.skipped += 1;
        continue;
      }
      stats.oversized += 1;
    }

    if (dryRun) {
      stats.pending += 1;
      console.log(`[dry run] Generating thumbnail for ${displayPath(file)}`);
      continue;
    }

    await resizeJpeg(file, thumbnailPath, {
      width: size,
      height: size,
      quality,
    });
    stats.generated += 1;
    console.log(`Generated ${displayPath(thumbnailPath)}`);
  }

  console.log(`
Thumbnail Generation ${dryRun ? "(dry run) " : ""}Complete:
    ✅ Generated: ${stats.generated}
    🛠️ Oversized: ${stats.oversized} over ${maxKb}KB
    ⏭️ Skipped: ${stats.skipped} existing
    📷 Total: ${stats.total} photos`);
  if (stats.pending > 0) {
    console.log("\nRe-run with --no-dry-run to generate.");
  }
  return stats;
};
