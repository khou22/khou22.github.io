import { NextRequest } from "next/server";
import { PhotoRatingUpdateRequest } from "./types";
import { connectToPhotoDb } from "@/data/photos/photoDbManager";
import { isPhotoID } from "@/utils/cdn/cdnAssets";

export async function POST(req: NextRequest) {
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
