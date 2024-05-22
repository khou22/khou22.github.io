import { NextRequest } from "next/server";

import { connectToPhotoDb } from "@/data/photos/photoDbManager";
import { isPhotoID } from "@/utils/cdn/cdnAssets";

import { PhotoRatingUpdateRequest } from "./types";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not allowed", { status: 403 });
  }

  const reqBody = (await req.json()) as PhotoRatingUpdateRequest;
  const db = await connectToPhotoDb();

  try {
    const { photo_id: photoID, rating } = reqBody;

    if (!photoID || !isPhotoID(photoID)) {
      throw new Error("original photo is not an ID");
    }

    // Upsert the rating.
    await db.run(
      `INSERT OR REPLACE INTO photo_metadata (photo_id, rating) VALUES (?, ?)`,
      [photoID, rating],
    );

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  } finally {
    db.close();
  }
}
