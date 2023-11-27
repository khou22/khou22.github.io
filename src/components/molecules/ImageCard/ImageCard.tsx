import { classNames } from "@/utils/style";
import Link from "next/link";
import React from "react";

type ImageCardProps = {
  title: string;
  description?: string;
  link: string;
  imageSrc: string;
  containerClassName?: string;
  contentClassName?: string;
};

export const ImageCard: React.FC<ImageCardProps> = ({
  title,
  description,
  link,
  imageSrc,
  containerClassName,
  contentClassName,
}) => {
  return (
    <Link href={link}>
      <div
        className={classNames(
          "group relative overflow-hidden",
          containerClassName,
        )}
      >
        {/* Card text */}
        <div
          className={classNames(
            "absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center",
            contentClassName,
          )}
        >
          <h5 className="font-medium leading-relaxed text-white">{title}</h5>
          {description && (
            <p className="text-sm text-gray-200">{description}</p>
          )}
        </div>

        {/* Image background */}
        <div className="absolute left-0 top-0 z-0 flex h-full w-full items-center justify-center">
          <img
            className={classNames(
              "h-full w-full object-cover transition-all duration-300",

              // Animate the filter on the background image.
              "brightness-50 saturate-50 group-hover:brightness-100 group-hover:saturate-100",
            )}
            src={imageSrc}
            alt={title}
          />
        </div>
      </div>
    </Link>
  );
};
