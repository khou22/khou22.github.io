"use client";

import { ProgressBar } from "@/components/atoms/ProgressBar/ProgressBar";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon/ArrowRightIcon";
import { PauseIcon } from "@/components/icons/PauseIcon/PauseIcon";
import { PlayIcon } from "@/components/icons/PlayIcon/PlayIcon";
import { useCountdown } from "@/hooks/useCountdown/useCountdown";
import { classNames } from "@/utils/style";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

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

const animationFrequency = 100;

/**
 * Instagram story-like image carousel that automatically transitions between
 * images.
 */
export const ImageStory: React.FC<ImageStoryProps> = ({
  stories,
  autoForward = false,
  storyDuration = 3000,
  className,
}) => {
  const [storyIdx, setStoryIdx] = useState(0);
  const {
    currentValue: countdown,
    isPaused,
    reset: resetCountdown,
    play: playCountdown,
    pause: pauseCountdown,
  } = useCountdown({
    time: storyDuration,
    decrementFrequency: animationFrequency,
    repeat: true,
    onFinish: () => {
      setStoryIdx((idx) => {
        if (idx + 1 >= stories.length) {
          return 0;
        }
        return idx + 1;
      });
    },
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  // The animation should be trailing so that we are at 100% at the end.
  const currentPercentageComplete =
    (storyDuration - countdown + animationFrequency) / storyDuration;

  const currentStory = stories[storyIdx];
  const nextStory =
    storyIdx + 1 < stories.length ? stories[storyIdx + 1] : undefined;

  // Manually go to a slide.
  const goToSlide = useCallback(
    (idx: React.SetStateAction<number>) => {
      setStoryIdx(idx);

      if (autoForward) {
        resetCountdown();
        playCountdown();
      } else {
        pauseCountdown();
      }
    },
    [autoForward, pauseCountdown, playCountdown, resetCountdown],
  );

  return (
    <div className={classNames("relative", className)}>
      {/* Progress bar at the bottom of the overlay */}
      <div className="absolute bottom-0 left-0 z-10 flex h-1.5 w-full flex-row items-center justify-evenly space-x-0.5">
        {stories.map((story, idx) => (
          <ProgressBar
            key={story.title}
            progress={
              // If we're not mounted, start at 0 so that we can animate from 0.
              !mounted
                ? 0
                : idx === storyIdx
                  ? isPaused
                    ? 1 // When paused, show 100%.
                    : currentPercentageComplete // When playing, show the current percentage.
                  : 0
            }
            className="h-full w-full cursor-pointer bg-gray-100/60 hover:bg-gray-100/70"
            fillClassName="bg-white/80 ease-linear"
            fillStyle={{
              // Only animate the current slide's progress bar.
              transitionDuration:
                idx === storyIdx && !isPaused
                  ? `${animationFrequency}ms`
                  : "0ms",
            }}
            onClick={() => goToSlide(idx)}
          />
        ))}
      </div>

      {/* Button to view more. */}
      <div className="absolute left-2 top-2 z-10">
        <Link href={currentStory?.link}>
          <div className="flex flex-col rounded-lg bg-white/90 px-2 py-1 shadow-lg hover:bg-white/100">
            <p className="gradient-accent-roy gradient-text font-bold leading-none">
              {currentStory?.title.toUpperCase()}
            </p>
            <p className="caption leading-tight">
              See More <ArrowRightIcon className="inline h-3 w-3" />
            </p>
          </div>
        </Link>
      </div>

      {/* Play / pause controls */}
      <div className="absolute right-2 top-2 z-10">
        <button
          className="cursor-pointer text-white"
          onClick={() => {
            if (isPaused) {
              playCountdown();
            } else {
              pauseCountdown();
            }
          }}
        >
          {isPaused ? (
            <PlayIcon className="h-5 w-5" />
          ) : (
            <PauseIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {currentStory && (
        <Image
          fill
          src={currentStory.imageSrc}
          alt={currentStory.title}
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
          onClick={(e) => {
            // If click on the left, move backwards.
            if (e.clientX < e.currentTarget.clientWidth / 2) {
              goToSlide((idx) => {
                if (idx === 0) {
                  return stories.length - 1;
                }
                return idx - 1;
              });
            } else {
              // If click on the right, move forward.
              goToSlide((idx) => (idx + 1) % stories.length);
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
