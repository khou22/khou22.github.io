import React from "react";

export interface MapLegendProps {
  trackColor?: string;
  waypointColor?: string;
}

/**
 * Legend component for GPX map showing track/route and waypoint styling.
 * Can be server-rendered.
 */
export const MapLegend: React.FC<MapLegendProps> = ({
  trackColor = "#2563eb",
  waypointColor = "#10b981",
}) => {
  return (
    <div className="absolute right-3 top-3 z-[1000] rounded-2xl bg-white/80 p-3 shadow-lg backdrop-blur-sm">
      <div className="mb-1 text-xs font-medium">Legend</div>
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-[3px] w-6 rounded"
          style={{ background: trackColor }}
        />
        <span className="text-xs">Track/Route</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-full border-2"
          style={{ borderColor: waypointColor }}
        />
        <span className="text-xs">Waypoint</span>
      </div>
    </div>
  );
};
