import { parseArgs } from "node:util";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import {
  connectToPhotoDb,
  getAllPhotoIdsInDb,
  getAllPhotoTagsInDb,
} from "@/data/photos/photoDbManager";
import { isPhotoID } from "@/utils/cdn/cdnAssets";

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
  const photoTagsInDB = await getAllPhotoTagsInDb();
  console.log(Array.from(photoIdsInDB));

  const { "dry-run": dryRun } = args.values;

  // Corrupt IDs in the SQLite DB.
  const corruptIDs = new Set();
  const corruptTags = new Set();

  photoIdsInDB.forEach((photoID) => {
    if (!isPhotoID(photoID)) {
      corruptIDs.add(photoID);
    }
  });

  photoTagsInDB.forEach((tag) => {
    // Determine if the tag is a valid PhotoTags enum.
    if (!Object.values(PhotoTags).includes(tag as PhotoTags)) {
      corruptTags.add(tag);
    }
  });

  console.log(
    `Found ${corruptIDs.size} corrupt IDs:\n\t${Array.from(corruptIDs).join(
      ",\n\t",
    )}`,
  );
  console.log(
    `Found ${corruptTags.size} corrupt tags:\n\t${Array.from(corruptTags).join(
      ",\n\t",
    )}`,
  );

  if (!dryRun) {
    const photoIDsToDelete = Array.from(corruptIDs);
    const photoTagsToDelete = Array.from(corruptTags);
    const db = await connectToPhotoDb();

    // Remove corrupt IDs from the DB.
    const deletedTags = await db.run(
      `DELETE FROM photo_tags WHERE photo_id IN (${photoIDsToDelete
        .map(() => "?")
        .join(", ")})`,
      ...photoIDsToDelete,
    );
    console.log(`Deleted ${deletedTags.changes} tags from the DB`);

    // Remove the corrupt tags from the DB.
    const deletedPhotoTags = await db.run(
      `DELETE FROM photo_tags WHERE tag_name IN (${photoTagsToDelete
        .map(() => "?")
        .join(", ")})`,
      ...Array.from(photoTagsToDelete),
    );
    console.log(`Deleted ${deletedPhotoTags.changes} photo tags from the DB`);

    const deletedPhotos = await db.run(
      `DELETE FROM photo_metadata WHERE photo_id IN (${photoIDsToDelete
        .map(() => "?")
        .join(", ")})`,
      ...photoIDsToDelete,
    );
    console.log(
      `Deleted ${deletedPhotos.changes} photo metadata records from the DB`,
    );
  }
};

main();
