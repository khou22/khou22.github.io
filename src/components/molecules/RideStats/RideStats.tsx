'use client'

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StopwatchIcon, ArrowUpIcon, RulerHorizontalIcon } from "@radix-ui/react-icons";
import { cn } from "@/utils/shadcn"; // Assuming utils exists for cn, otherwise I'll check imports

type RideStatsProps = {
    distance: number; // in km
    elevation: number; // in meters
    movingTime: number; // in minutes
    className?: string;
};

export const RideStats: React.FC<RideStatsProps> = ({
    distance,
    elevation,
    movingTime,
    className = "",
}) => {
    const [isMetric, setIsMetric] = useState(true);

    const formatTime = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = Math.floor(minutes % 60);
        return `${h}h ${m}m`;
    };

    const displayDistance = isMetric ? distance : distance * 0.621371;
    const displayElevation = isMetric ? elevation : elevation * 3.28084;

    return (
        <div className={cn("w-full py-12 bg-white", className)}>
            <div className="flex justify-end mb-6 px-4">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="unit-mode" className={cn("text-sm font-medium", !isMetric ? "text-black" : "text-gray-400")}>Imperial</Label>
                    <Switch
                        id="unit-mode"
                        checked={isMetric}
                        onCheckedChange={setIsMetric}
                    />
                    <Label htmlFor="unit-mode" className={cn("text-sm font-medium", isMetric ? "text-black" : "text-gray-400")}>Metric</Label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
                {/* Moving Time */}
                <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 bg-gray-50 rounded-full">
                        <StopwatchIcon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold tracking-tight text-gray-900 font-heading">
                            {formatTime(movingTime)}
                        </div>
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">
                            Moving Time
                        </div>
                    </div>
                </div>

                {/* Elevation */}
                <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 bg-gray-50 rounded-full">
                        <ArrowUpIcon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold tracking-tight text-gray-900 font-heading">
                            {Math.round(displayElevation).toLocaleString()}
                            <span className="text-lg font-normal text-gray-400 ml-1">
                                {isMetric ? "m" : "ft"}
                            </span>
                        </div>
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">
                            Elevation
                        </div>
                    </div>
                </div>

                {/* Distance */}
                <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 bg-gray-50 rounded-full">
                        <RulerHorizontalIcon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold tracking-tight text-gray-900 font-heading">
                            {displayDistance.toFixed(1)}
                            <span className="text-lg font-normal text-gray-400 ml-1">
                                {isMetric ? "km" : "mi"}
                            </span>
                        </div>
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">
                            Distance
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

