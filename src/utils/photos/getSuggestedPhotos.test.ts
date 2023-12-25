import { getSuggestedPhotos } from "./getSuggestedPhotos";

test("get suggested photos for a given photo ID", () => {
  const suggestions = getSuggestedPhotos(
    "photography/Transamerica_Building_San_Francisco_Drone_Vertical_jpg",
    3,
  );
  expect(suggestions).toHaveLength(3);

  // Expect all suggestions to be unique.
  expect(Array.from(new Set(suggestions))).toHaveLength(3);
});
