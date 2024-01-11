import React from "react";
import { classNames } from "@/utils/style";

type CoordinatesLabelProps = {
  latitude: number;
  longitude: number;
  precision?: number;
  className?: string;
};

export const CoordinatesLabel: React.FC<CoordinatesLabelProps> = ({
  latitude,
  longitude,
  className = "",
  precision = 5,
}) => {
  return (
    <p className={classNames("caption break-all font-mono", className)}>
      {Math.abs(latitude).toFixed(precision)}° {latitude > 0 ? "N" : "S"},{" "}
      {Math.abs(longitude).toFixed(precision)}° {longitude > 0 ? "E" : "W"}
    </p>
  );
};
