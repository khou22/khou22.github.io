import { NextRequest } from "next/server";
import { PhotoTagUpdateRequest } from "./types";
import { connectToPhotoDb } from "@/data/photos/photoDbManager";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not allowed", { status: 403 });
  }

  const reqBody = (await req.json()) as PhotoTagUpdateRequest;
  const db = await connectToPhotoDb();

  try {
    if (reqBody.addTags.length > 0) {
      // Add the correct number of placeholders.
      let placeholders = reqBody.addTags.map(() => `(?, ?)`).join(",");
      const values = reqBody.addTags.reduce<string[]>(
        (acc, tag) => [...acc, reqBody.photoID, tag],
        [],
      );

      // Insert the new tags.
      await db.run(
        `INSERT OR IGNORE INTO photo_tags (photo_id, tag_name) 
VALUES ${placeholders}`,
        values,
      );
    }

    // Remove tags.
    if (reqBody.removeTags.length > 0) {
      await Promise.all(
        reqBody.removeTags.map(async (tag) => {
          console.log("Removing tag", tag);
          await db.run(
            `DELETE FROM photo_tags WHERE photo_id = ? AND tag_name = ?`,
            [reqBody.photoID, tag],
          );
        }),
      );
    }

    // Get all tags for this photo.
    const tags = await db.all(
      `SELECT tag_name FROM photo_tags WHERE photo_id = ?`,
      reqBody.photoID,
    );

    // Return a list of all tags.
    return new Response(JSON.stringify(tags), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  } finally {
    db.close();
  }
}
