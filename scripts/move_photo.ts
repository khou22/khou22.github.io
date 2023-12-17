// TODO: This script does not run with `ts-node`
import { renamePhotoID } from "@/data/photos/photoDbManager";
import { castPhotoID, isPhotoID, pathToPhotoID } from "@/utils/cdn/cdnAssets";
import fs from "fs";
import { parseArgs } from "node:util";

const args = parseArgs({
  options: {
    src: {
      type: "string",
    },
    dest: {
      type: "string",
    },
    "dry-run": {
      type: "boolean",
      default: true,
    },
  },
});

const main = async () => {
  const { src, dest, "dry-run": dryRun } = args.values;
  if (!src) throw new Error("--src not provided");
  if (!dest) throw new Error("--dest not provided");

  const origPhotoID = castPhotoID(pathToPhotoID(src));
  const destPhotoID = pathToPhotoID(dest);

  if (!origPhotoID || !isPhotoID(origPhotoID)) {
    throw new Error("original photo is not an ID");
  }

  console.log(`Moving Photo
Source: ${src}
Destination: ${dest}
Original Photo ID: ${origPhotoID}

The new photo ID will be:
${destPhotoID}`);

  if (!dryRun) {
    // Rename all entries in the SQLite DB.
    await renamePhotoID(origPhotoID, destPhotoID);

    // Move the file.
    await fs.renameSync(src, dest);
  }
};

main();
