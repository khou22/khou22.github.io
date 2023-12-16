import { renamePhotoID } from "@/data/photos/photoDbManager";
import { castPhotoID, isPhotoID } from "@/utils/cdn/cdnAssets";
import fs from "fs";

const dryRun = true;

const pathToPhotoID = (photoPath: string): string => {
  return photoPath.replace(/[^a-zA-Z0-9/]+/, "_");
};

const main = async () => {
  // Parse arguments.
  const args = process.argv;
  if (args.length != 2) {
    throw Error("Usage: src_path dest_path");
  }
  const [srcPath, destPath] = args;

  const origPhotoID = castPhotoID(pathToPhotoID(srcPath));
  const destPhotoID = pathToPhotoID(destPath);

  if (!origPhotoID || !isPhotoID(origPhotoID)) {
    throw new Error("original photo is not an ID");
  }

  console.log(`Moving Photo
Source: ${srcPath}
Destination: ${destPath}
Original Photo ID: ${origPhotoID}

The new photo ID will be:
${destPhotoID}`);

  if (!dryRun) {
    // Rename all entries in the SQLite DB.
    await renamePhotoID(origPhotoID, destPhotoID);

    // Move the file.
    await fs.renameSync(srcPath, destPath);
  }
};

main();
