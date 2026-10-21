import fs from "fs";
import path from "path";
import { Command } from "../lib/args";
import { generateAssetMap } from "../lib/assetMap";
import { docsDir } from "../lib/config";
import { CliError } from "../lib/errors";
import { thumbnailPathFor } from "../lib/imaging";
import { confirm } from "../lib/prompt";
import { resolvePhotoIDs } from "../lib/resolve";
import { deletePhoto, renamePhotoID } from "@/data/photos/photoDbManager";
import { getPhotoPath, isPhotoID, pathToPhotoID } from "@/utils/cdn/cdnAssets";

export const move: Command = {
  usage: "move <photo> <dest> [--no-regen]",
  description:
    "Move/rename a photo (dest is relative to docs/, ie. photography/sf/Name.jpg). Moves its thumbnail, updates the DB, and regenerates the asset map.",
  options: { "no-regen": { type: "boolean" } },
  run: async ([photoInput, destInput, ...rest], values) => {
    if (!photoInput || !destInput || rest.length > 0) {
      throw new CliError("Expected exactly a photo and a destination.");
    }
    const [id] = resolvePhotoIDs([photoInput]);
    const destPath = `/${destInput.replace(/^\//, "").replace(/^docs\//, "")}`;
    if (!/\.jpe?g$/i.test(destPath)) {
      throw new CliError("Destination must be a .jpg or .jpeg file.");
    }
    let destID: string;
    try {
      destID = pathToPhotoID(destPath);
    } catch (e) {
      throw new CliError((e as Error).message);
    }
    const srcAbs = path.join(docsDir(), getPhotoPath(id));
    const destAbs = path.join(docsDir(), destPath);
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
    console.log(`Moved ${id}\n   -> ${destID}\n(${changes} tag rows updated)`);

    if (!values["no-regen"]) generateAssetMap();
  },
};

export const remove: Command = {
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
      const file = path.join(docsDir(), getPhotoPath(id));
      for (const target of [file, thumbnailPathFor(file)]) {
        if (fs.existsSync(target)) await fs.promises.unlink(target);
      }
      await deletePhoto(id);
      console.log(`Deleted ${id}`);
    }
    if (!values["no-regen"]) generateAssetMap();
  },
};
