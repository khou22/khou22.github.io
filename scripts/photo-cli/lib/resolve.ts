import { CliError } from "./errors";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { tagMetadata } from "@/constants/photoTags/tagMetadata";
import { getPhotoName, isPhotoID, PhotoIdType } from "@/utils/cdn/cdnAssets";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";

const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9/]+/g, "_");

/**
 * Resolve user input to a photo ID. Accepts a photo ID, a path to the photo
 * (relative to the repo root or the docs/ folder), or a unique file name.
 */
export const resolvePhotoID = (input: string): PhotoIdType => {
  const photoIDs = getPhotoIDs();
  if (isPhotoID(input)) return input as PhotoIdType;

  // Treat the input as a path.
  let candidate = input.replace(/^\.?\//, "").replace(/^docs\//, "");
  candidate = sanitize(candidate);
  if (!candidate.startsWith("photography/")) {
    candidate = `photography/${candidate}`;
  }
  if (isPhotoID(candidate)) return candidate as PhotoIdType;

  // Match on the file name (ie. the last ID component).
  const fileName = sanitize(input.split("/").pop() ?? input);
  const byFileName = photoIDs.filter(
    (id) =>
      id.endsWith(`/${fileName}`) || id.split("/").pop() === `${fileName}_jpg`,
  );
  if (byFileName.length === 1) return byFileName[0];

  const query = input.toLowerCase();
  const fuzzy = photoIDs.filter(
    (id) =>
      id.toLowerCase().includes(query) ||
      getPhotoName(id).toLowerCase().includes(query),
  );
  const matches = byFileName.length > 1 ? byFileName : fuzzy;
  if (matches.length === 1) return matches[0];

  if (matches.length > 1) {
    throw new CliError(
      `"${input}" matches ${
        matches.length
      } photos, be more specific:\n  ${matches.slice(0, 10).join("\n  ")}${
        matches.length > 10 ? "\n  ..." : ""
      }`,
    );
  }
  throw new CliError(
    `Unknown photo "${input}". If it's a new file, run \`pnpm photos assets\` to regenerate the asset map.`,
  );
};

export const resolvePhotoIDs = (inputs: string[]): PhotoIdType[] => {
  if (inputs.length === 0) {
    throw new CliError("Expected at least one photo.");
  }
  return Array.from(new Set(inputs.map(resolvePhotoID)));
};

/**
 * Human friendly aliases for each tag: the enum value, the enum key, the
 * value without its prefix, and the tag metadata slug and name.
 */
const tagAliases = (tag: PhotoTags): string[] => {
  const key = Object.entries(PhotoTags).find(([, v]) => v === tag)?.[0];
  const meta = tagMetadata[tag];
  return [tag, key, tag.replace(/^[a-z]+_/, ""), meta?.slug, meta?.name]
    .filter((alias): alias is string => Boolean(alias))
    .map((alias) => sanitize(alias.toLowerCase()));
};

/**
 * Resolve user input to a tag. Optionally restrict to a tag prefix (ie.
 * "category_" or "location_").
 */
export const resolveTag = (input: string, prefix?: string): PhotoTags => {
  const normalized = sanitize(input.trim().toLowerCase());
  const candidates = Object.values(PhotoTags).filter(
    (tag) => !prefix || tag.startsWith(prefix),
  );
  const matches = candidates.filter((tag) =>
    tagAliases(tag).includes(normalized),
  );

  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    throw new CliError(
      `Tag "${input}" is ambiguous: ${matches.join(", ")}. Use the full tag.`,
    );
  }
  throw new CliError(
    `Unknown tag "${input}". Run \`pnpm photos tags\` to see valid tags.`,
  );
};

/**
 * Resolve a list of tags, splitting comma separated values.
 */
export const resolveTags = (
  inputs: string[] | undefined,
  prefix?: string,
): PhotoTags[] =>
  Array.from(
    new Set(
      (inputs ?? [])
        .flatMap((input) => input.split(","))
        .filter((input) => input.trim().length > 0)
        .map((input) => resolveTag(input, prefix)),
    ),
  );

export const tagGroup = (tag: string): string => tag.split("_")[0];

export const tagLabel = (tag: string): string =>
  tagMetadata[tag as PhotoTags]?.name ?? tag;
