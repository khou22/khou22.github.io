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
      <div className="pointer-events-none absolute z-10 flex h-full w-full items-center justify-center">
        <p className="w-full text-center text-white/0">{title}</p>
      </div>
      <Image
        fill
        src={photo}
        placeholder={"blurDataURL" in photo ? "blur" : undefined}
        {...{ alt, title, sizes, className, onClick }}
      />
    </Link>
  );
};
