import { NextRequest } from "next/server";
import { PhotoTagUpdateRequest } from "./types";
import { connectToPhotoDb } from "@/data/photos/photoDb";

export async function POST(req: NextRequest) {
  const reqBody = (await req.json()) as PhotoTagUpdateRequest;
  const db = await connectToPhotoDb();

  try {
    // Add the correct number of placeholders.
    let placeholders = reqBody.addTags
      .map(() => `(${reqBody.photoID}, ?)`)
      .join(",");

    // Insert the new tags.
    await db.run(
      `INSERT OR IGNORE INTO photo_tags (photo_id, tag_name) 
VALUES ${placeholders}`,
      reqBody.addTags,
    );

    // Remove tags.
    await db.run(
      `DELETE FROM photo_tags WHERE photo_id = ? AND tag_name IN (${reqBody.removeTags
        .map(() => "?")
        .join(",")})`,
      [reqBody.photoID, ...reqBody.removeTags],
    );

    // Get all tags for this photo.
    const tags = await db.all(
      `SELECT tag_name FROM photo_tags WHERE photo_id = ?`,
      reqBody.photoID,
    );

    // Return a list of all tags.
    return new Response(JSON.stringify(tags), { status: 200 });
  } catch (error) {
    return new Response("Unknown error", { status: 500 });
  } finally {
    db.close();
  }
}
