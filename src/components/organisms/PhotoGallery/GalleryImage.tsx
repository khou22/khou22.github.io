import { RenderPhotoProps } from "react-photo-album";
import Image from "next/image";
import { PhotoRecord } from "./types";
import Link from "next/link";
import { PAGES } from "@/utils/pages";

export const GalleryImage = ({
  photo,
  imageProps: { alt, title, sizes, className, onClick },
  wrapperStyle,
}: RenderPhotoProps<PhotoRecord>) => {
  return (
    <Link
      href={PAGES.PHOTOGRAPHY.PHOTO(photo.photoID)}
      style={{ ...wrapperStyle, position: "relative" }}
    >
      <Image
        fill
        src={photo}
        placeholder={"blurDataURL" in photo ? "blur" : undefined}
        {...{ alt, title, sizes, className, onClick }}
      />
    </Link>
  );
};
