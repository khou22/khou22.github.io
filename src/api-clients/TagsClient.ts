import { PhotoTagUpdateRequest } from "@/app/admin/photos/api/tags/types";
import { PhotoTags } from "@/constants/photoTags";
import { PhotoIdType } from "@/utils/cdn/cdnAssets";

export class TagsClient {
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
}
