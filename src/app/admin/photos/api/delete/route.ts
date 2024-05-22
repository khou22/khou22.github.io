import { NextRequest } from "next/server";

import fs from "fs";
import path from "path";

import { connectToPhotoDb, deletePhoto } from "@/data/photos/photoDbManager";
import {
  castPhotoID,
  getPhotoPath,
  getPhotoThumbnail,
  isPhotoID,
} from "@/utils/cdn/cdnAssets";


import { DeletePhotoRequest } from "./types";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not allowed", { status: 403 });
  }

  const reqBody = (await req.json()) as DeletePhotoRequest;
  const db = await connectToPhotoDb();

  try {
    const { photo_id: photoIdStr } = reqBody;
    const photoID = castPhotoID(photoIdStr);
    if (!photoID || !isPhotoID(photoID)) {
      throw new Error("original photo is not an ID");
    }

    // Remove the original image.
    const srcPath = path.join(process.cwd(), "docs", getPhotoPath(photoID));
    if (fs.existsSync(srcPath)) {
      await fs.promises.unlink(srcPath);
    }

    // Remove the original thumbnail image if it exists.
    const origThumbnailID = getPhotoThumbnail(photoID);
    if (origThumbnailID && origThumbnailID !== photoID) {
      const srcThumbnailPath = path.join(
        process.cwd(),
        "docs",
        getPhotoPath(origThumbnailID),
      );
      if (fs.existsSync(srcThumbnailPath)) {
        await fs.promises.unlink(srcThumbnailPath);
      }
    }

    // Rename all entries in the SQLite DB.
    await deletePhoto(photoID);

    // TODO (kevin): Regenerate the thumbnails and the asset map.

    return new Response("Photo deleted", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  } finally {
    db.close();
  }
}
