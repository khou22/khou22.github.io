import { PhotoTags } from "@/constants/photoTags";
import { getSuggestedPhotoTags } from "./getSuggestedPhotoTags";

test("get suggested photo tags for a given photo tag", () => {
  const suggestions = getSuggestedPhotoTags(PhotoTags.City, 3);
  expect(suggestions).toHaveLength(3);

  // Expect all suggestions to be unique.
  expect(Array.from(new Set(suggestions))).toHaveLength(3);
});
