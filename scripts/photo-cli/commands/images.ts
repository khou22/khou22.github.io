import fs from "fs";
import path from "path";
import {
  Command,
  dryRunOptions,
  isDryRun,
  optionalNumber,
  parseNumber,
} from "../lib/args";
import { generateAssetMap } from "../lib/assetMap";
import { displayPath, docsDir } from "../lib/config";
import { CliError } from "../lib/errors";
import {
  cleanImages,
  dimensions,
  generateThumbnails,
  humanBytes,
  resizeJpeg,
} from "../lib/imaging";
import { resolvePhotoID } from "../lib/resolve";
import { getPhotoPath } from "@/utils/cdn/cdnAssets";

const CLEAN_MAX_KB = "2100";
const THUMBNAIL_MAX_KB = "250";
const THUMBNAIL_SIZE = "800";
const QUALITY = "75";

export const clean: Command = {
  usage: "clean [path]... [--max-kb <kb>] [--quality <q>] [--no-dry-run]",
  description: `Compress JPEGs over --max-kb (default ${CLEAN_MAX_KB}) under docs/ or the given paths.`,
  options: {
    ...dryRunOptions,
    "max-kb": { type: "string", default: CLEAN_MAX_KB },
    quality: { type: "string", default: QUALITY },
  },
  run: async (positionals, values) => {
    await cleanImages({
      targets: positionals,
      maxKb: parseNumber(values["max-kb"], "max-kb"),
      quality: parseNumber(values.quality, "quality"),
      dryRun: isDryRun(values),
    });
  },
};

export const thumbnails: Command = {
  usage:
    "thumbnails [path]... [--max-kb <kb>] [--size <px>] [--quality <q>] [--force] [--no-dry-run]",
  description: `Generate missing/oversized .placeholder.jpg thumbnails (default ${THUMBNAIL_SIZE}px, ${THUMBNAIL_MAX_KB}KB) under docs/photography or the given paths.`,
  options: {
    ...dryRunOptions,
    "max-kb": { type: "string", default: THUMBNAIL_MAX_KB },
    size: { type: "string", default: THUMBNAIL_SIZE },
    quality: { type: "string", default: QUALITY },
    force: { type: "boolean" },
  },
  run: async (positionals, values) => {
    await generateThumbnails({
      targets: positionals,
      maxKb: parseNumber(values["max-kb"], "max-kb"),
      size: parseNumber(values.size, "size"),
      quality: parseNumber(values.quality, "quality"),
      force: Boolean(values.force),
      dryRun: isDryRun(values),
    });
  },
};

export const resize: Command = {
  usage:
    "resize <file|photo>... (--max <px> | --width <px> | --height <px>) [--quality <q>] [--out <dir>]",
  description:
    "Resize images to fit within the given bounds (never enlarging). Overwrites in place unless --out is given.",
  options: {
    max: { type: "string" },
    width: { type: "string" },
    height: { type: "string" },
    quality: { type: "string", default: "80" },
    out: { type: "string", short: "o" },
  },
  run: async (positionals, values) => {
    const max = optionalNumber(values.max, "max");
    const width = optionalNumber(values.width, "width") ?? max;
    const height = optionalNumber(values.height, "height") ?? max;
    const quality = parseNumber(values.quality, "quality");
    if (!width && !height) {
      throw new CliError("Specify --max, --width, and/or --height.");
    }
    if (positionals.length === 0) throw new CliError("Expected a file.");

    const files = positionals.map((input) =>
      fs.existsSync(input)
        ? path.resolve(input)
        : path.join(docsDir(), getPhotoPath(resolvePhotoID(input))),
    );
    const outDir = values.out as string | undefined;
    if (outDir) await fs.promises.mkdir(outDir, { recursive: true });

    for (const file of files) {
      const dest = outDir ? path.join(outDir, path.basename(file)) : file;
      const before = await dimensions(file);
      const output = await resizeJpeg(file, dest, { width, height, quality });
      const after = await dimensions(output);
      console.log(
        `${displayPath(dest)}: ${before.width}x${before.height} -> ${
          after.width
        }x${after.height} (${humanBytes(output.length)})`,
      );
    }
  },
};

export const assets: Command = {
  usage: "assets",
  description:
    "Regenerate the CDN asset map (cdnAssets.generated.ts and asset-catalog.md).",
  run: async () => generateAssetMap(),
};

export const ingest: Command = {
  usage: "ingest [path]... [--max-kb <kb>]",
  description:
    "Full new-photo pipeline: clean -> assets -> thumbnails -> assets, then list photos that still need tags.",
  options: { "max-kb": { type: "string", default: CLEAN_MAX_KB } },
  run: async (positionals, values) => {
    await cleanImages({
      targets: positionals,
      maxKb: parseNumber(values["max-kb"], "max-kb"),
      quality: Number(QUALITY),
      dryRun: false,
    });
    generateAssetMap();
    await generateThumbnails({
      targets: positionals,
      maxKb: Number(THUMBNAIL_MAX_KB),
      size: Number(THUMBNAIL_SIZE),
      quality: Number(QUALITY),
      force: false,
      dryRun: false,
    });
    generateAssetMap();
    console.log(
      "\nDone. Find photos that still need metadata with:\n  pnpm photos list --untagged",
    );
  },
};
