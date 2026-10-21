import { asStrings, Command, parseOnOff, parseRating } from "../lib/args";
import { loadPhotosByID, printPhotos } from "../lib/catalog";
import { CliError } from "../lib/errors";
import {
  resolvePhotoIDs,
  resolveTag,
  resolveTags,
  tagGroup,
} from "../lib/resolve";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import {
  addPhotoTags,
  clearPhotoRating,
  removePhotoTags,
  setPhotoRating,
} from "@/data/photos/photoDbManager";

export const tag: Command = {
  usage: "tag <photo>... [--add <tag>]... [--remove <tag>]...",
  description:
    "Add and/or remove tags (comma separated or repeated) on photos.",
  options: {
    add: { type: "string", short: "a", multiple: true },
    remove: { type: "string", short: "r", multiple: true },
  },
  run: async (positionals, values) => {
    const add = resolveTags(asStrings(values.add));
    const remove = resolveTags(asStrings(values.remove));
    if (add.length + remove.length === 0) {
      throw new CliError("Specify --add and/or --remove.");
    }
    const ids = resolvePhotoIDs(positionals);
    for (const id of ids) {
      await addPhotoTags(id, add);
      await removePhotoTags(id, remove);
    }
    await printPhotos(ids);
  },
};

export const category: Command = {
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
    const add = resolveTags(asStrings(values.add), "category_");
    const remove = resolveTags(asStrings(values.remove), "category_");
    const set =
      values.set === undefined
        ? null
        : resolveTags(asStrings(values.set), "category_");
    if (add.length + remove.length === 0 && set === null) {
      throw new CliError("Specify --add, --remove, or --set.");
    }
    const ids = resolvePhotoIDs(positionals);
    for (const photo of await loadPhotosByID(ids)) {
      if (set) {
        await removePhotoTags(
          photo.id,
          photo.categories.filter((tag) => !set.includes(tag)),
        );
        await addPhotoTags(photo.id, set);
      } else {
        await addPhotoTags(photo.id, add);
        await removePhotoTags(photo.id, remove);
      }
    }
    await printPhotos(ids);
  },
};

export const location: Command = {
  usage: "location <location|none> <photo>...",
  description: "Set (replacing any existing) or clear the location tag.",
  run: async ([locationInput, ...photoInputs]) => {
    if (!locationInput) throw new CliError("Expected a location.");
    const newLocation = ["none", "clear"].includes(locationInput)
      ? null
      : resolveTag(locationInput, "location_");
    const ids = resolvePhotoIDs(photoInputs);
    for (const photo of await loadPhotosByID(ids)) {
      await removePhotoTags(
        photo.id,
        photo.tags.filter(
          (tag) => tagGroup(tag) === "location" && tag !== newLocation,
        ),
      );
      if (newLocation) await addPhotoTags(photo.id, [newLocation]);
    }
    await printPhotos(ids);
  },
};

export const sell: Command = {
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
    await printPhotos(ids);
  },
};

export const rate: Command = {
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
    await printPhotos(ids);
  },
};
