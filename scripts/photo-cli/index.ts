import fs from "fs";
import path from "path";
import readline from "readline/promises";
import { parseArgs, ParseArgsConfig } from "node:util";
import sharp from "sharp";
import {
  CliError,
  resolvePhotoIDs,
  resolveTag,
  resolveTags,
  tagGroup,
  tagLabel,
} from "./resolve";
import {
  cleanImages,
  DOCS_DIR,
  generateAssetMap,
  generateThumbnails,
  humanBytes,
  REPO_ROOT,
  resizeJpeg,
  thumbnailPathFor,
} from "./images";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { tagMetadata } from "@/constants/photoTags/tagMetadata";
import {
  addPhotoTags,
  clearPhotoRating,
  connectToPhotoDb,
  deletePhoto,
  getAllPhotoIdsInDb,
  getAllPhotoTagsInDb,
  getMetadataByPhotoID,
  removePhotoTags,
  renamePhotoID,
  setPhotoRating,
} from "@/data/photos/photoDbManager";
import {
  getPhotoName,
  getPhotoPath,
  isPhotoID,
  PhotoIdType,
  pathToPhotoID,
} from "@/utils/cdn/cdnAssets";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";

type PhotoRecord = {
  id: PhotoIdType;
  name: string;
  path: string;
  rating: number | null;
  forSale: boolean;
  categories: PhotoTags[];
  location: PhotoTags | null;
  tags: PhotoTags[];
};

const loadPhotos = async (): Promise<PhotoRecord[]> => {
  const metadata = await getMetadataByPhotoID();
  return getPhotoIDs().map((id) => {
    const tags = (metadata[id]?.tags ?? []).slice().sort();
    return {
      id,
      name: getPhotoName(id),
      path: getPhotoPath(id),
      rating: metadata[id]?.rating ?? null,
      forSale: !tags.includes(PhotoTags.NotForSale),
      categories: tags.filter((tag) => tagGroup(tag) === "category"),
      location: tags.find((tag) => tagGroup(tag) === "location") ?? null,
      tags,
    };
  });
};

const stars = (rating: number | null) =>
  rating === null ? "unrated" : "★".repeat(rating) + "☆".repeat(5 - rating);

const printPhoto = (photo: PhotoRecord) => {
  const other = photo.tags.filter(
    (tag) => !["category", "location", "store"].includes(tagGroup(tag)),
  );
  console.log(`${photo.name}
  ID:         ${photo.id}
  Path:       docs${photo.path}
  Rating:     ${stars(photo.rating)}
  For Sale:   ${photo.forSale ? "yes" : "no"}
  Categories: ${photo.categories.map(tagLabel).join(", ") || "-"}
  Location:   ${photo.location ? tagLabel(photo.location) : "-"}
  Other:      ${other.map(tagLabel).join(", ") || "-"}`);
};

const printSummary = async (ids: PhotoIdType[]) => {
  const photos = await loadPhotos();
  photos
    .filter((photo) => ids.includes(photo.id))
    .forEach((photo) => {
      printPhoto(photo);
      console.log();
    });
};

const confirm = async (question: string): Promise<boolean> => {
  if (!process.stdin.isTTY) return false;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question(`${question} [y/N] `);
  rl.close();
  return answer.trim().toLowerCase().startsWith("y");
};

const parseRating = (input: string): number | null => {
  if (["clear", "none"].includes(input)) return null;
  const rating = Number(input);
  if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
    throw new CliError(`Rating must be 0-5 or "clear", got "${input}".`);
  }
  return rating;
};

const parseOnOff = (input: string | undefined): boolean => {
  if (input && ["on", "yes", "true", "1"].includes(input)) return true;
  if (input && ["off", "no", "false", "0"].includes(input)) return false;
  throw new CliError(`Expected "on" or "off", got "${input}".`);
};

const parseNumber = (input: string | undefined, name: string) => {
  const value = Number(input);
  if (input === undefined || !Number.isFinite(value) || value <= 0) {
    throw new CliError(`--${name} must be a positive number.`);
  }
  return value;
};

// Supports `--dry-run` (default) and `--no-dry-run` like the Python scripts.
const dryRunOptions = {
  "dry-run": { type: "boolean" },
  "no-dry-run": { type: "boolean" },
} as const;
const isDryRun = (values: { "no-dry-run"?: boolean }) => !values["no-dry-run"];

type Command = {
  usage: string;
  description: string;
  options?: ParseArgsConfig["options"];
  run: (
    positionals: string[],
    values: Record<string, string | boolean | (string | boolean)[] | undefined>,
  ) => Promise<void>;
};

const commands: Record<string, Command> = {
  list: {
    usage: `list [--query <text>] [--subdir <dir>] [--tag <tag>]... [--without-tag <tag>]...
       [--untagged] [--no-category] [--no-location] [--for-sale | --not-for-sale]
       [--min-rating <n>] [--unrated] [--limit <n>] [--ids | --json]`,
    description: "List photos with their metadata, optionally filtered.",
    options: {
      query: { type: "string", short: "q" },
      subdir: { type: "string" },
      tag: { type: "string", short: "t", multiple: true },
      "without-tag": { type: "string", multiple: true },
      untagged: { type: "boolean" },
      "no-category": { type: "boolean" },
      "no-location": { type: "boolean" },
      "for-sale": { type: "boolean" },
      "not-for-sale": { type: "boolean" },
      "min-rating": { type: "string" },
      unrated: { type: "boolean" },
      limit: { type: "string", short: "n" },
      ids: { type: "boolean" },
      json: { type: "boolean" },
    },
    run: async (positionals, values) => {
      const withTags = resolveTags(values.tag as string[]);
      const withoutTags = resolveTags(values["without-tag"] as string[]);
      const query = ((values.query as string) ?? positionals.join(" "))
        .toLowerCase()
        .trim();
      const subdir = (values.subdir as string | undefined)?.replace(
        /^\/|\/$/g,
        "",
      );
      const minRating =
        values["min-rating"] !== undefined
          ? parseRating(values["min-rating"] as string)
          : null;

      let photos = (await loadPhotos()).filter((photo) => {
        if (
          query &&
          !photo.id.toLowerCase().includes(query) &&
          !photo.name.toLowerCase().includes(query)
        )
          return false;
        if (subdir && !photo.path.startsWith(`/photography/${subdir}/`))
          return false;
        if (!withTags.every((tag) => photo.tags.includes(tag))) return false;
        if (withoutTags.some((tag) => photo.tags.includes(tag))) return false;
        if (values.untagged && photo.tags.length > 0) return false;
        if (values["no-category"] && photo.categories.length > 0) return false;
        if (values["no-location"] && photo.location) return false;
        if (values["for-sale"] && !photo.forSale) return false;
        if (values["not-for-sale"] && photo.forSale) return false;
        if (values.unrated && photo.rating !== null) return false;
        if (minRating !== null && (photo.rating ?? -1) < minRating)
          return false;
        return true;
      });
      if (values.limit) {
        photos = photos.slice(0, parseNumber(values.limit as string, "limit"));
      }

      if (values.json) {
        console.log(JSON.stringify(photos, null, 2));
      } else if (values.ids) {
        photos.forEach((photo) => console.log(photo.id));
      } else {
        photos.forEach((photo) => {
          const tags = photo.tags
            .filter((tag) => tag !== PhotoTags.NotForSale)
            .map(tagLabel)
            .join(", ");
          console.log(
            `${stars(photo.rating).padEnd(8)} ${photo.forSale ? "$" : " "} ${
              photo.id
            }${tags ? `  [${tags}]` : ""}`,
          );
        });
        console.error(`\n${photos.length} photo(s)`);
      }
    },
  },

  show: {
    usage: "show <photo>... [--json]",
    description: "Show all metadata for one or more photos.",
    options: { json: { type: "boolean" } },
    run: async (positionals, values) => {
      const ids = resolvePhotoIDs(positionals);
      const photos = (await loadPhotos()).filter((photo) =>
        ids.includes(photo.id),
      );
      if (values.json) {
        console.log(JSON.stringify(photos, null, 2));
        return;
      }
      for (const photo of photos) {
        printPhoto(photo);
        const file = path.join(DOCS_DIR, photo.path);
        if (fs.existsSync(file)) {
          const { width, height } = await sharp(file).metadata();
          const thumbnail = thumbnailPathFor(file);
          console.log(
            `  File:       ${width}x${height}, ${humanBytes(
              fs.statSync(file).size,
            )}`,
          );
          console.log(
            `  Thumbnail:  ${
              fs.existsSync(thumbnail)
                ? humanBytes(fs.statSync(thumbnail).size)
                : "missing"
            }`,
          );
        } else {
          console.log("  File:       missing on disk");
        }
        console.log();
      }
    },
  },

  tags: {
    usage: "tags [--json]",
    description: "List all valid tags with aliases and photo counts.",
    options: { json: { type: "boolean" } },
    run: async (_positionals, values) => {
      const photos = await loadPhotos();
      const rows = Object.entries(PhotoTags).map(([key, tag]) => ({
        tag,
        key,
        name: tagMetadata[tag]?.name ?? key,
        slug: tagMetadata[tag]?.slug ?? null,
        count: photos.filter((photo) => photo.tags.includes(tag)).length,
      }));
      if (values.json) {
        console.log(JSON.stringify(rows, null, 2));
        return;
      }
      let group = "";
      rows.forEach((row) => {
        if (tagGroup(row.tag) !== group) {
          group = tagGroup(row.tag);
          console.log(`\n${group.toUpperCase()}`);
        }
        console.log(
          `  ${row.tag.padEnd(32)}${row.name.padEnd(24)}${String(
            row.count,
          ).padStart(5)}`,
        );
      });
      console.log(
        `\nTags can be referenced by their full value, name, slug, or without the prefix (ie. "landscape", "san-francisco", "drone").`,
      );
    },
  },

  subdirs: {
    usage: "subdirs",
    description: "List photography subdirectories with photo counts.",
    run: async () => {
      const counts = new Map<string, number>();
      getPhotoIDs().forEach((id) => {
        const dir = path.dirname(getPhotoPath(id)).replace(/^\//, "");
        counts.set(dir, (counts.get(dir) ?? 0) + 1);
      });
      Array.from(counts.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([dir, count]) =>
          console.log(`${String(count).padStart(5)}  ${dir}/`),
        );
    },
  },

  tag: {
    usage: "tag <photo>... [--add <tag>]... [--remove <tag>]...",
    description:
      "Add and/or remove tags (comma separated or repeated) on photos.",
    options: {
      add: { type: "string", short: "a", multiple: true },
      remove: { type: "string", short: "r", multiple: true },
    },
    run: async (positionals, values) => {
      const add = resolveTags(values.add as string[]);
      const remove = resolveTags(values.remove as string[]);
      if (add.length + remove.length === 0) {
        throw new CliError("Specify --add and/or --remove.");
      }
      const ids = resolvePhotoIDs(positionals);
      for (const id of ids) {
        await addPhotoTags(id, add);
        await removePhotoTags(id, remove);
      }
      await printSummary(ids);
    },
  },

  category: {
    usage:
      "category <photo>... [--add <cat>]... [--remove <cat>]... [--set <cat,...>]",
    description:
      "Edit category tags. --set replaces all categories (use --set '' to clear).",
    options: {
      add: { type: "string", short: "a", multiple: true },
      remove: { type: "string", short: "r", multiple: true },
      set: { type: "string", short: "s" },
    },
    run: async (positionals, values) => {
      const add = resolveTags(values.add as string[], "category_");
      const remove = resolveTags(values.remove as string[], "category_");
      const set =
        values.set !== undefined
          ? resolveTags([values.set as string], "category_")
          : null;
      if (add.length + remove.length === 0 && set === null) {
        throw new CliError("Specify --add, --remove, or --set.");
      }
      const ids = resolvePhotoIDs(positionals);
      const photos = await loadPhotos();
      for (const id of ids) {
        const current = photos.find((p) => p.id === id)?.categories ?? [];
        const toRemove = set
          ? current.filter((tag) => !set.includes(tag))
          : remove;
        await removePhotoTags(id, toRemove);
        await addPhotoTags(id, set ?? add);
      }
      await printSummary(ids);
    },
  },

  location: {
    usage: "location <location|none> <photo>...",
    description: "Set (replacing any existing) or clear the location tag.",
    run: async ([locationInput, ...photoInputs]) => {
      if (!locationInput) throw new CliError("Expected a location.");
      const location =
        locationInput === "none" || locationInput === "clear"
          ? null
          : resolveTag(locationInput, "location_");
      const ids = resolvePhotoIDs(photoInputs);
      const photos = await loadPhotos();
      for (const id of ids) {
        const existing = (photos.find((p) => p.id === id)?.tags ?? []).filter(
          (tag) => tagGroup(tag) === "location" && tag !== location,
        );
        await removePhotoTags(id, existing);
        if (location) await addPhotoTags(id, [location]);
      }
      await printSummary(ids);
    },
  },

  sell: {
    usage: "sell <on|off> <photo>...",
    description: "Mark photos as for sale (on) or not for sale (off).",
    run: async ([onOff, ...photoInputs]) => {
      const forSale = parseOnOff(onOff);
      const ids = resolvePhotoIDs(photoInputs);
      for (const id of ids) {
        if (forSale) {
          await removePhotoTags(id, [PhotoTags.NotForSale]);
        } else {
          await addPhotoTags(id, [PhotoTags.NotForSale]);
        }
      }
      await printSummary(ids);
    },
  },

  rate: {
    usage: "rate <0-5|clear> <photo>...",
    description: "Set or clear the star rating.",
    run: async ([ratingInput, ...photoInputs]) => {
      if (!ratingInput) throw new CliError("Expected a rating.");
      const rating = parseRating(ratingInput);
      const ids = resolvePhotoIDs(photoInputs);
      for (const id of ids) {
        if (rating === null) {
          await clearPhotoRating(id);
        } else {
          await setPhotoRating(id, rating);
        }
      }
      await printSummary(ids);
    },
  },

  move: {
    usage: "move <photo> <dest> [--no-regen]",
    description:
      "Move/rename a photo (dest is relative to docs/, ie. photography/sf/Name.jpg). Moves its thumbnail, updates the DB, and regenerates the asset map.",
    options: { "no-regen": { type: "boolean" } },
    run: async ([photoInput, destInput, ...rest], values) => {
      if (!photoInput || !destInput || rest.length > 0) {
        throw new CliError("Expected exactly a photo and a destination.");
      }
      const [id] = resolvePhotoIDs([photoInput]);
      const destPath = `/${destInput
        .replace(/^\//, "")
        .replace(/^docs\//, "")}`;
      if (!/\.jpe?g$/i.test(destPath)) {
        throw new CliError("Destination must be a .jpg or .jpeg file.");
      }
      const destID = pathToPhotoID(destPath);
      const srcAbs = path.join(DOCS_DIR, getPhotoPath(id));
      const destAbs = path.join(DOCS_DIR, destPath);
      if (fs.existsSync(destAbs) || (isPhotoID(destID) && destID !== id)) {
        throw new CliError(`Destination already exists: ${destID}`);
      }
      if (!fs.existsSync(srcAbs)) {
        throw new CliError(`Source file is missing: ${srcAbs}`);
      }

      await fs.promises.mkdir(path.dirname(destAbs), { recursive: true });
      await fs.promises.rename(srcAbs, destAbs);
      const srcThumbnail = thumbnailPathFor(srcAbs);
      if (fs.existsSync(srcThumbnail)) {
        await fs.promises.rename(srcThumbnail, thumbnailPathFor(destAbs));
      }
      const changes = await renamePhotoID(id, destID);
      console.log(
        `Moved ${id}\n   -> ${destID}\n(${changes} tag rows updated)`,
      );

      if (!values["no-regen"]) generateAssetMap();
    },
  },

  delete: {
    usage: "delete <photo>... [--yes] [--no-regen]",
    description:
      "Delete photos, their thumbnails, and their DB metadata. Prompts unless --yes.",
    options: {
      yes: { type: "boolean", short: "y" },
      "no-regen": { type: "boolean" },
    },
    run: async (positionals, values) => {
      const ids = resolvePhotoIDs(positionals);
      console.log(`About to delete:\n  ${ids.join("\n  ")}`);
      if (!values.yes && !(await confirm("Delete these photos?"))) {
        console.log("Aborted (pass --yes to skip the prompt).");
        return;
      }
      for (const id of ids) {
        const file = path.join(DOCS_DIR, getPhotoPath(id));
        for (const target of [file, thumbnailPathFor(file)]) {
          if (fs.existsSync(target)) await fs.promises.unlink(target);
        }
        await deletePhoto(id);
        console.log(`Deleted ${id}`);
      }
      if (!values["no-regen"]) generateAssetMap();
    },
  },

  "clean-db": {
    usage: "clean-db [--no-dry-run]",
    description:
      "Find (and with --no-dry-run, delete) DB rows for photos that no longer exist or tags that are not valid.",
    options: dryRunOptions,
    run: async (_positionals, values) => {
      const validTags = Object.values(PhotoTags) as string[];
      const corruptIDs = Array.from(await getAllPhotoIdsInDb()).filter(
        (id) => !isPhotoID(id),
      );
      const corruptTags = Array.from(await getAllPhotoTagsInDb()).filter(
        (tag) => !validTags.includes(tag),
      );
      console.log(
        `Found ${corruptIDs.length} unknown photo IDs:\n\t${corruptIDs.join(
          "\n\t",
        )}`,
      );
      console.log(
        `Found ${corruptTags.length} invalid tags:\n\t${corruptTags.join(
          "\n\t",
        )}`,
      );
      if (isDryRun(values)) {
        if (corruptIDs.length + corruptTags.length > 0) {
          console.log("\nRe-run with --no-dry-run to delete them.");
        }
        return;
      }

      const db = await connectToPhotoDb();
      const placeholders = (items: string[]) => items.map(() => "?").join(", ");
      const tagRows = await db.run(
        `DELETE FROM photo_tags WHERE photo_id IN (${placeholders(
          corruptIDs,
        )}) OR tag_name IN (${placeholders(corruptTags)})`,
        [...corruptIDs, ...corruptTags],
      );
      const metadataRows = await db.run(
        `DELETE FROM photo_metadata WHERE photo_id IN (${placeholders(
          corruptIDs,
        )})`,
        corruptIDs,
      );
      console.log(
        `Deleted ${tagRows.changes} tag rows and ${metadataRows.changes} metadata rows.`,
      );
    },
  },

  clean: {
    usage: "clean [path]... [--max-kb <kb>] [--quality <q>] [--no-dry-run]",
    description:
      "Compress JPEGs over --max-kb (default 2100) under docs/ or the given paths.",
    options: {
      ...dryRunOptions,
      "max-kb": { type: "string", default: "2100" },
      quality: { type: "string", default: "75" },
    },
    run: async (positionals, values) => {
      await cleanImages({
        targets: positionals,
        maxKb: parseNumber(values["max-kb"] as string, "max-kb"),
        quality: parseNumber(values.quality as string, "quality"),
        dryRun: isDryRun(values),
      });
    },
  },

  thumbnails: {
    usage:
      "thumbnails [path]... [--max-kb <kb>] [--size <px>] [--quality <q>] [--force] [--no-dry-run]",
    description:
      "Generate missing/oversized .placeholder.jpg thumbnails (default 800px, 250KB) under docs/photography or the given paths.",
    options: {
      ...dryRunOptions,
      "max-kb": { type: "string", default: "250" },
      size: { type: "string", default: "800" },
      quality: { type: "string", default: "75" },
      force: { type: "boolean" },
    },
    run: async (positionals, values) => {
      await generateThumbnails({
        targets: positionals,
        maxKb: parseNumber(values["max-kb"] as string, "max-kb"),
        size: parseNumber(values.size as string, "size"),
        quality: parseNumber(values.quality as string, "quality"),
        force: Boolean(values.force),
        dryRun: isDryRun(values),
      });
    },
  },

  resize: {
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
      const max = values.max
        ? parseNumber(values.max as string, "max")
        : undefined;
      const width = values.width
        ? parseNumber(values.width as string, "width")
        : max;
      const height = values.height
        ? parseNumber(values.height as string, "height")
        : max;
      if (!width && !height) {
        throw new CliError("Specify --max, --width, and/or --height.");
      }
      if (positionals.length === 0) throw new CliError("Expected a file.");

      const files = positionals.map((input) =>
        fs.existsSync(input)
          ? path.resolve(input)
          : path.join(DOCS_DIR, getPhotoPath(resolvePhotoIDs([input])[0])),
      );
      const outDir = values.out as string | undefined;
      if (outDir) await fs.promises.mkdir(outDir, { recursive: true });

      for (const file of files) {
        const dest = outDir ? path.join(outDir, path.basename(file)) : file;
        const before = await sharp(file).metadata();
        const output = await resizeJpeg(file, dest, {
          width,
          height,
          quality: parseNumber(values.quality as string, "quality"),
        });
        const after = await sharp(output).metadata();
        console.log(
          `${path.relative(REPO_ROOT, dest)}: ${before.width}x${
            before.height
          } -> ${after.width}x${after.height} (${humanBytes(output.length)})`,
        );
      }
    },
  },

  assets: {
    usage: "assets",
    description:
      "Regenerate the CDN asset map (cdnAssets.generated.ts and asset-catalog.md).",
    run: async () => generateAssetMap(),
  },

  ingest: {
    usage: "ingest [path]... [--max-kb <kb>]",
    description:
      "Full new-photo pipeline: clean -> assets -> thumbnails -> assets, then list photos that still need tags.",
    options: { "max-kb": { type: "string", default: "2100" } },
    run: async (positionals, values) => {
      await cleanImages({
        targets: positionals,
        maxKb: parseNumber(values["max-kb"] as string, "max-kb"),
        quality: 75,
        dryRun: false,
      });
      generateAssetMap();
      await generateThumbnails({
        targets: positionals,
        maxKb: 250,
        size: 800,
        quality: 75,
        force: false,
        dryRun: false,
      });
      generateAssetMap();
      console.log(
        "\nDone. Find photos that still need metadata with:\n  pnpm photos list --untagged",
      );
    },
  },
};

const printHelp = () => {
  console.log(`Photo catalog CLI

Usage: pnpm photos <command> [options]

Photos can be referenced by ID (photography/foo/Bar_jpg), path
(docs/photography/foo/Bar.jpg), file name, or any unique substring.
Tags can be referenced by full value, name, slug, or short name.
`);
  Object.entries(commands).forEach(([, command]) => {
    console.log(`  ${command.usage}\n      ${command.description}\n`);
  });
};

const main = async () => {
  const [name, ...argv] = process.argv.slice(2);
  if (!name || ["help", "--help", "-h"].includes(name)) {
    printHelp();
    return;
  }
  const command = commands[name];
  if (!command) {
    throw new CliError(`Unknown command "${name}". Run with --help.`);
  }
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(
      `Usage: pnpm photos ${command.usage}\n\n${command.description}`,
    );
    return;
  }

  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      options: command.options ?? {},
      allowPositionals: true,
    });
  } catch (e) {
    throw new CliError(
      `${(e as Error).message}\nUsage: pnpm photos ${command.usage}`,
    );
  }
  await command.run(parsed.positionals, parsed.values);
};

main()
  .then(() => process.exit(0))
  .catch((e) => {
    if (e instanceof CliError) {
      console.error(`Error: ${e.message}`);
    } else {
      console.error(e);
    }
    process.exit(1);
  });
