"use client";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon/ArrowRightIcon";
import { classNames } from "@/utils/style";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

export type ImageStoryType = {
  title: string;
  link: string;

  /**
   * Image URL.
   */
  imageSrc: string;
};

type ImageStoryProps = {
  stories: ImageStoryType[];
  autoForward?: boolean;
  storyDuration?: number;
  className?: string;
};

export const ImageStory: React.FC<ImageStoryProps> = ({
  stories,
  autoForward = false,
  storyDuration = 3000,
  className,
}) => {
  const [storyIdx, setStoryIdx] = useState(0);
  const timer = useRef<NodeJS.Timeout>();

  const currentStory = stories[storyIdx];
  const nextStory =
    storyIdx + 1 < stories.length ? stories[storyIdx + 1] : undefined;

  const incrementStory = useCallback(() => {
    setStoryIdx((idx) => idx + (1 % stories.length));
    if (autoForward) {
      clearTimeout(timer.current);
      timer.current = setTimeout(incrementStory, storyDuration);
    }
  }, [autoForward, stories.length, storyDuration]);

  useEffect(() => {
    if (autoForward) {
      timer.current = setTimeout(incrementStory, storyDuration);
    }
    return () => {
      clearTimeout(timer.current);
    };
  }, [autoForward, incrementStory, storyDuration]);

  return (
    <div className={classNames("relative", className)}>
      {/* Progress bar at the bottom of the overlay */}
      <div className="absolute bottom-0 left-0 z-10 flex h-1.5 w-full flex-row items-center justify-evenly space-x-0.5">
        {stories.map((story, idx) => (
          <div
            key={story.title}
            className={classNames(
              "h-full w-full cursor-pointer",
              storyIdx === idx
                ? "bg-white/80"
                : "bg-gray-100/60 hover:bg-gray-100/70",
            )}
            onClick={() => setStoryIdx(idx)}
          />
        ))}
      </div>

      {/* Button to view more. */}
      <div className="absolute left-2 top-2 z-10">
        <Link href={currentStory?.link}>
          <p className="leading-tight">{currentStory?.title}</p>
          <p className="caption leading-tight">
            See More <ArrowRightIcon className="inline h-3 w-3" />
          </p>
        </Link>
      </div>

      {currentStory && (
        <Image
          fill
          src={currentStory.imageSrc}
          alt={currentStory.title}
          className="object-cover"
          onClick={(e) => {
            // If click on the left, move backwards.
            if (e.clientX < e.currentTarget.clientWidth / 2) {
              setStoryIdx((idx) => {
                if (idx === 0) {
                  return stories.length - 1;
                }
                return idx - 1;
              });
            } else {
              setStoryIdx((idx) => (idx + 1) % stories.length);
            }
          }}
        />
      )}

      {/* Preload the asset for the next story */}
      {nextStory && (
        <img
          src={currentStory.imageSrc}
          alt={currentStory.title}
          className="h-0 w-0"
        />
      )}
    </div>
  );
};
