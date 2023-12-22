import { NextRequest } from "next/server";
import fs from "fs";
import { connectToPhotoDb, renamePhotoID } from "@/data/photos/photoDbManager";
import { PhotoMoveRequest } from "./types";
import {
  castPhotoID,
  getPhotoPath,
  isPhotoID,
  pathToPhotoID,
} from "@/utils/cdn/cdnAssets";
import path from "path";

export async function POST(req: NextRequest) {
  const reqBody = (await req.json()) as PhotoMoveRequest;
  const db = await connectToPhotoDb();

  try {
    const { photo_id: photoIdStr, dest_path } = reqBody;
    const destPath = path.join(process.cwd(), "docs", dest_path);
    const origPhotoID = castPhotoID(photoIdStr);
    if (!origPhotoID || !isPhotoID(origPhotoID)) {
      throw new Error("original photo is not an ID");
    }

    // Get the new photo ID.
    const destPhotoID = pathToPhotoID(destPath);
    const srcPath = path.join(process.cwd(), "docs", getPhotoPath(origPhotoID));

    // Move the file.
    console.log(`Moving Photo
  Original Photo ID: ${origPhotoID}
  Source: ${srcPath}
  Destination: ${destPath}
  
  The new photo ID will be:
  ${destPhotoID}`);

    // Rename all entries in the SQLite DB.
    await renamePhotoID(origPhotoID, destPhotoID);

    // Move the file.
    await fs.renameSync(srcPath, destPath);

    // TODO (kevin): Move the thumbnail as well and regenerate the asset map.

    // Return a list of all tags.
    return new Response(
      JSON.stringify({
        dest_path: destPath,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  } finally {
    db.close();
  }
}
