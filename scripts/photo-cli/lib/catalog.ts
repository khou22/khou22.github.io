import { tagGroup, tagLabel } from "./resolve";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { getMetadataByPhotoID } from "@/data/photos/photoDbManager";
import { getPhotoName, getPhotoPath, PhotoIdType } from "@/utils/cdn/cdnAssets";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";

export type PhotoRecord = {
  id: PhotoIdType;
  name: string;
  /** Path relative to the docs/ folder, ie. `/photography/Foo.jpg`. */
  path: string;
  rating: number | null;
  forSale: boolean;
  categories: PhotoTags[];
  location: PhotoTags | null;
  tags: PhotoTags[];
};

/**
 * Load every photo in the asset map joined with its DB metadata.
 */
export const loadPhotos = async (): Promise<PhotoRecord[]> => {
  const metadata = await getMetadataByPhotoID();
  return getPhotoIDs().map((id) => {
    const tags = (metadata[id]?.tags ?? []).slice().sort();
    return {
      id,
      name: getPhotoName(id),
      path: getPhotoPath(id),
      rating: metadata[id]?.rating ?? null,
      forSale: !tags.includes(PhotoTags.NotForSale),
      categories: tags.filter((tag) => tagGroup(tag) === "category"),
      location: tags.find((tag) => tagGroup(tag) === "location") ?? null,
      tags,
    };
  });
};

export const loadPhotosByID = async (ids: PhotoIdType[]) =>
  (await loadPhotos()).filter((photo) => ids.includes(photo.id));

export type PhotoFilter = {
  query?: string;
  subdir?: string;
  withTags?: PhotoTags[];
  withoutTags?: PhotoTags[];
  untagged?: boolean;
  noCategory?: boolean;
  noLocation?: boolean;
  forSale?: boolean;
  notForSale?: boolean;
  unrated?: boolean;
  minRating?: number | null;
};

export const filterPhotos = (
  photos: PhotoRecord[],
  filter: PhotoFilter,
): PhotoRecord[] => {
  const query = filter.query?.toLowerCase().trim();
  const subdir = filter.subdir?.replace(/^\/|\/$/g, "");
  return photos.filter((photo) => {
    if (
      query &&
      !photo.id.toLowerCase().includes(query) &&
      !photo.name.toLowerCase().includes(query)
    )
      return false;
    if (subdir && !photo.path.startsWith(`/photography/${subdir}/`))
      return false;
    if (!(filter.withTags ?? []).every((tag) => photo.tags.includes(tag)))
      return false;
    if ((filter.withoutTags ?? []).some((tag) => photo.tags.includes(tag)))
      return false;
    if (filter.untagged && photo.tags.length > 0) return false;
    if (filter.noCategory && photo.categories.length > 0) return false;
    if (filter.noLocation && photo.location) return false;
    if (filter.forSale && !photo.forSale) return false;
    if (filter.notForSale && photo.forSale) return false;
    if (filter.unrated && photo.rating !== null) return false;
    if (
      filter.minRating !== undefined &&
      filter.minRating !== null &&
      (photo.rating ?? -1) < filter.minRating
    )
      return false;
    return true;
  });
};

export const stars = (rating: number | null) =>
  rating === null ? "unrated" : "★".repeat(rating) + "☆".repeat(5 - rating);

/**
 * One-line summary for `list`.
 */
export const formatPhotoRow = (photo: PhotoRecord) => {
  const tags = photo.tags
    .filter((tag) => tag !== PhotoTags.NotForSale)
    .map(tagLabel)
    .join(", ");
  return `${stars(photo.rating).padEnd(8)} ${photo.forSale ? "$" : " "} ${
    photo.id
  }${tags ? `  [${tags}]` : ""}`;
};

/**
 * Multi-line detail view for `show` and after edits.
 */
export const formatPhoto = (photo: PhotoRecord) => {
  const other = photo.tags.filter(
    (tag) => !["category", "location", "store"].includes(tagGroup(tag)),
  );
  return `${photo.name}
  ID:         ${photo.id}
  Path:       docs${photo.path}
  Rating:     ${stars(photo.rating)}
  For Sale:   ${photo.forSale ? "yes" : "no"}
  Categories: ${photo.categories.map(tagLabel).join(", ") || "-"}
  Location:   ${photo.location ? tagLabel(photo.location) : "-"}
  Other:      ${other.map(tagLabel).join(", ") || "-"}`;
};

/**
 * Print the current state of the given photos (used after edits).
 */
export const printPhotos = async (ids: PhotoIdType[]) => {
  (await loadPhotosByID(ids)).forEach((photo) => {
    console.log(formatPhoto(photo));
    console.log();
  });
};
