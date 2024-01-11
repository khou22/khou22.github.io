import { PhotoTagUpdateRequest } from "@/app/admin/photos/api/tags/types";
import { PhotoTags } from "@/constants/photoTags";
import { PhotoIdType } from "@/utils/cdn/cdnAssets";

export class PhotoMetadataClient {
  /**
   * Update the tags for a photo.
   */
  updateTags = async (
    photoID: PhotoIdType,
    tags: { tagID: PhotoTags; value: boolean }[],
  ) => {
    const addTags: PhotoTags[] = [];
    const removeTags: PhotoTags[] = [];

    for (const { tagID, value } of tags) {
      if (value) {
        addTags.push(tagID);
      } else {
        removeTags.push(tagID);
      }
    }

    const request: PhotoTagUpdateRequest = {
      photoID: photoID,
      addTags,
      removeTags,
    };
    const response = await fetch(`/admin/photos/api/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      console.error(response);
    }
  };

  /**
   * Update the rating for a photo via a REST API.
   */
  updateRating = async (photoID: PhotoIdType, rating: number) => {
    const response = await fetch(`/admin/photos/api/rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        photo_id: photoID,
        rating,
      }),
    });
    if (!response.ok) {
      console.error(response);
    }
  };
}
