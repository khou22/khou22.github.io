import { RenderPhotoProps } from "react-photo-album";
import Link from "next/link";
import { PhotoRecord } from "./types";
import { trackSelectItem } from "@/utils/analytics/ga";
import { PAGES } from "@/utils/pages";
import { classNames } from "@/utils/style";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";

type GalleryImageProps = RenderPhotoProps<PhotoRecord> & {
  listName?: string;
};

export const GalleryImage = ({
  photo,
  imageProps: { alt, title, sizes, className = "", onClick },
  wrapperStyle,
  layout,
  listName,
}: GalleryImageProps) => {
  return (
    <Link
      href={PAGES.PHOTOGRAPHY.PHOTO(photo.photoID)}
      style={{ ...wrapperStyle, position: "relative" }}
      onClick={() => trackSelectItem(photo.photoID, listName, layout.index)}
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
