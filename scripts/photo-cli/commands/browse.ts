import fs from "fs";
import path from "path";
import { asStrings, Command, parseNumber, parseRating } from "../lib/args";
import {
  filterPhotos,
  formatPhoto,
  formatPhotoRow,
  loadPhotos,
  loadPhotosByID,
} from "../lib/catalog";
import { docsDir } from "../lib/config";
import { dimensions, humanBytes, thumbnailPathFor } from "../lib/imaging";
import { resolvePhotoIDs, resolveTags, tagGroup } from "../lib/resolve";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { tagMetadata } from "@/constants/photoTags/tagMetadata";
import { getPhotoPath } from "@/utils/cdn/cdnAssets";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";

export const list: Command = {
  usage: `list [query] [--subdir <dir>] [--tag <tag>]... [--without-tag <tag>]...
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
    let photos = filterPhotos(await loadPhotos(), {
      query: (values.query as string | undefined) ?? positionals.join(" "),
      subdir: values.subdir as string | undefined,
      withTags: resolveTags(asStrings(values.tag)),
      withoutTags: resolveTags(asStrings(values["without-tag"])),
      untagged: Boolean(values.untagged),
      noCategory: Boolean(values["no-category"]),
      noLocation: Boolean(values["no-location"]),
      forSale: Boolean(values["for-sale"]),
      notForSale: Boolean(values["not-for-sale"]),
      unrated: Boolean(values.unrated),
      minRating:
        values["min-rating"] === undefined
          ? null
          : parseRating(values["min-rating"] as string),
    });
    if (values.limit !== undefined) {
      photos = photos.slice(0, parseNumber(values.limit, "limit"));
    }

    if (values.json) {
      console.log(JSON.stringify(photos, null, 2));
    } else if (values.ids) {
      photos.forEach((photo) => console.log(photo.id));
    } else {
      photos.forEach((photo) => console.log(formatPhotoRow(photo)));
      console.error(`\n${photos.length} photo(s)`);
    }
  },
};

export const show: Command = {
  usage: "show <photo>... [--json]",
  description: "Show all metadata for one or more photos.",
  options: { json: { type: "boolean" } },
  run: async (positionals, values) => {
    const photos = await loadPhotosByID(resolvePhotoIDs(positionals));
    if (values.json) {
      console.log(JSON.stringify(photos, null, 2));
      return;
    }
    for (const photo of photos) {
      console.log(formatPhoto(photo));
      const file = path.join(docsDir(), photo.path);
      if (fs.existsSync(file)) {
        const { width, height } = await dimensions(file);
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
};

export const tags: Command = {
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
};

export const subdirs: Command = {
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
};
