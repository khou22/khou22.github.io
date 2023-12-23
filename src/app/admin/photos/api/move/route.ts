import { NextRequest } from "next/server";
import fs from "fs";
import { connectToPhotoDb, renamePhotoID } from "@/data/photos/photoDbManager";
import { PhotoMoveRequest } from "./types";
import {
  castPhotoID,
  getPhotoPath,
  getPhotoThumbnail,
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

    const origThumbnailID = getPhotoThumbnail(origPhotoID);

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

    // Ensure destination folder directories exist.
    await fs.promises.mkdir(path.dirname(destPath), { recursive: true });

    // Move the file.
    await fs.promises.rename(srcPath, destPath);

    // Remove the original thumbnail image if it exists.
    if (origThumbnailID && origThumbnailID !== origPhotoID) {
      const srcThumbnailPath = path.join(
        process.cwd(),
        "docs",
        getPhotoPath(origThumbnailID),
      );
      if (fs.existsSync(srcThumbnailPath)) {
        console.log("Removing original thumbnail", srcThumbnailPath);
        await fs.promises.unlink(srcThumbnailPath);
      }
    }

    // Rename all entries in the SQLite DB.
    await renamePhotoID(origPhotoID, destPhotoID);

    // TODO (kevin): Regenerate the thumbnails and the asset map.

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
