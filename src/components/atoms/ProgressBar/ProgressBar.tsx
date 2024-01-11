import React from "react";
import { classNames } from "@/utils/style";

type ProgressBarProps = {
  className?: string;
  fillClassName?: string;
  fillStyle?: React.CSSProperties;

  /**
   * Percentage: 0 to 1.
   */
  progress: number;
  onClick?: () => void;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  fillClassName,
  fillStyle,
  progress,
  onClick,
}) => {
  return (
    <div
      className={classNames("relative overflow-clip", className)}
      onClick={onClick}
    >
      <div
        className={classNames(
          "absolute left-0 top-0 h-full w-full",
          fillClassName,
        )}
        style={{ ...fillStyle, width: `${progress * 100}%` }}
      />
    </div>
  );
};
