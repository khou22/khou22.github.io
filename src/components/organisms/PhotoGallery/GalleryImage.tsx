import { RenderPhotoProps } from "react-photo-album";
import Link from "next/link";
import { PhotoRecord } from "./types";
import { PAGES } from "@/utils/pages";
import { classNames } from "@/utils/style";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";

export const GalleryImage = ({
  photo,
  imageProps: { alt, title, sizes, className = "", onClick },
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
      <img
        src={getCdnAsset(photo.photoID)}
        className={classNames("h-full w-full object-cover", className)}
        placeholder={"blurDataURL" in photo ? "blur" : undefined}
        {...{ alt, title, sizes, onClick }}
      />
    </Link>
  );
};
