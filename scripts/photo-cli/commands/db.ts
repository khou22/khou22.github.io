import { Command, dryRunOptions, isDryRun } from "../lib/args";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import {
  connectToPhotoDb,
  getAllPhotoIdsInDb,
  getAllPhotoTagsInDb,
} from "@/data/photos/photoDbManager";
import { isPhotoID } from "@/utils/cdn/cdnAssets";

const placeholders = (items: string[]) => items.map(() => "?").join(", ");

export const cleanDb: Command = {
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
    try {
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
    } finally {
      await db.close();
    }
  },
};
