import _ from "lodash";
import { PhotoIdType, getAllPhotographyPhotoIDs } from "../cdn/cdnAssets";

/**
 * Get `n` suggested photos based on the supplied photo ID. The suggestions are chosen
 * at random (in the future this can be a mix of random and explicit), but they are deteriministic
 * based on the ID given.
 *
 * This should only be used on the server because it loads the photo DB.
 */
export const getSuggestedPhotos = (photoID: PhotoIdType, n: number) => {
  const allPhotos = getAllPhotographyPhotoIDs();
  const photoIdx = _.findIndex(allPhotos, (id) => id === photoID);

  const suggestions: PhotoIdType[] = [];
  let idx = photoIdx;
  while (suggestions.length < n) {
    const photo = allPhotos[idx % allPhotos.length];
    if (idx !== photoIdx) {
      suggestions.push(photo);
    }
    idx = Math.floor(idx ** 1.2 * 2.5);
  }

  return suggestions;
};
