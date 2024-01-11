import findIndex from "lodash/findIndex";
import { PhotoTags, tagMetadata } from "@/constants/photoTags";

/**
 * Get `n` suggested photo tags based on the supplied photo tag. The suggestions are chosen
 * at random, but they are deteriministic based on the tag given.
 */
export const getSuggestedPhotoTags = (photoTag: PhotoTags, n: number) => {
  const allTags = Object.values(PhotoTags) as PhotoTags[];
  const tagIdx = findIndex(allTags, (tag) => tag === photoTag);

  const suggestions: PhotoTags[] = [];
  let idx = tagIdx;
  while (suggestions.length < n) {
    const tag = allTags[idx % allTags.length];
    if (idx !== tagIdx && !tagMetadata[tag].hidden) {
      suggestions.push(tag);
    }
    idx += 6;
  }

  return suggestions;
};
