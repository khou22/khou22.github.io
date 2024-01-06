// TODO: This script does not run with `ts-node`
import {
  connectToPhotoDb,
  getAllPhotoIdsInDb,
  renamePhotoID,
} from "@/data/photos/photoDbManager";
import { castPhotoID, isPhotoID, pathToPhotoID } from "@/utils/cdn/cdnAssets";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";
import fs from "fs";
import { parseArgs } from "node:util";

const args = parseArgs({
  options: {
    "dry-run": {
      type: "boolean",
      default: true,
    },
  },
});

const main = async () => {
  const photoIdsInDB = await getAllPhotoIdsInDb();
  console.log(Array.from(photoIdsInDB));

  const { "dry-run": dryRun } = args.values;

  // Corrupt IDs in the SQLite DB.
  const corruptIDs = new Set();

  photoIdsInDB.forEach((photoID) => {
    if (!isPhotoID(photoID)) {
      corruptIDs.add(photoID);
    }
  });

  console.log(
    `Found ${corruptIDs.size} corrupt IDs:\n\t${Array.from(corruptIDs).join(
      ",\n\t",
    )}`,
  );

  if (!dryRun) {
    const toDelete = Array.from(corruptIDs);
    const db = await connectToPhotoDb();

    // Remove corrupt IDs from the DB.
    const deletedTags = await db.run(
      `DELETE FROM photo_tags WHERE photo_id IN (${toDelete
        .map(() => "?")
        .join(", ")})`,
      ...toDelete,
    );
    console.log(`Deleted ${deletedTags.changes} tags from the DB`);

    const deletedPhotos = await db.run(
      `DELETE FROM photo_metadata WHERE photo_id IN (${toDelete
        .map(() => "?")
        .join(", ")})`,
      ...toDelete,
    );
    console.log(
      `Deleted ${deletedPhotos.changes} photo metadata records from the DB`,
    );
  }
};

main();
