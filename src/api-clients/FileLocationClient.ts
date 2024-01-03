import { PhotoMoveRequest } from "@/app/admin/photos/api/move/types";
import { PhotoIdType } from "@/utils/cdn/cdnAssets";

export class FileLocationClient {
  /**
   * Move a photo that's in the CDN to a different location.
   */
  movePhotoPath = async (photoID: PhotoIdType, destPath: string) => {
    // Only allow moving within the /photography site.
    if (!destPath.startsWith("/photography")) {
      throw new Error("Must only move photos within the /photography site");
    }

    // Send the request.
    const payload: PhotoMoveRequest = {
      photo_id: photoID,
      dest_path: destPath,
    };
    const response = await fetch(`/admin/photos/api/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error(response);
    }
  };

  /**
   * Delete a photo from the CDN and the database.
   */
  deletePhoto = async (photoID: PhotoIdType) => {
    const response = await fetch(`/admin/photos/api/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ photo_id: photoID }),
    });
    if (!response.ok) {
      console.error(response);
    }
  };
}
