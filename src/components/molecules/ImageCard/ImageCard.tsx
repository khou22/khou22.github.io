import React from "react";
import { classNames } from "@/utils/style";

type ImageCardProps = {
  title: string;
  description?: string;
  imageSrc: string;
  containerClassName?: string;
  contentClassName?: string;
};

export const ImageCard: React.FC<ImageCardProps> = ({
  title,
  description,
  imageSrc,
  containerClassName,
  contentClassName,
}) => {
  return (
    <div
      className={classNames(
        "group relative overflow-hidden",
        containerClassName,
      )}
    >
      {/* Card text */}
      <div
        className={classNames(
          "absolute left-0 top-0 z-10 flex min-h-full w-full flex-col items-center justify-center transition-all duration-300 group-hover:min-h-0 group-hover:py-1",
          contentClassName,
        )}
      >
        <h5 className="font-medium leading-relaxed text-white transition-all duration-300 group-hover:text-base">
          {title}
        </h5>
        {description && (
          <p className="text-sm text-gray-200 opacity-100 transition-opacity duration-100 group-hover:opacity-0">
            {description}
          </p>
        )}
      </div>

      {/* Image background */}
      <div className="absolute left-0 top-0 z-0 flex h-full w-full items-center justify-center">
        <img
          className={classNames(
            "h-full w-full object-cover transition-all duration-300",

            // Animate the filter on the background image.
            "brightness-[0.7] saturate-[0.8] group-hover:brightness-100 group-hover:saturate-100",
          )}
          src={imageSrc}
          alt={title}
        />
      </div>
    </div>
  );
};
