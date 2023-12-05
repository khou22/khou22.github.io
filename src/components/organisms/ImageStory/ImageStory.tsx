"use client";

import { ProgressBar } from "@/components/atoms/ProgressBar/ProgressBar";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon/ArrowRightIcon";
import { useCountdown } from "@/hooks/useCountdown/useCountdown";
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

const animationFrequency = 1000;

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
    play: resetCountdown,
    pause: pauseCountdown,
  } = useCountdown({
    time: 3000,
    decrementFrequency: 1000,
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

  const currentStory = stories[storyIdx];
  const nextStory =
    storyIdx + 1 < stories.length ? stories[storyIdx + 1] : undefined;

  // // Increment by the animation duration.
  // const incrementStoryAnimation = useCallback(() => {
  //   console.log("incrementStoryAnimation");
  //   setMsRemaining((ms) => {
  //     const remaining = ms - animationFrequency;

  //     // If the slide is over, go to the next slide and restart the animation timer.
  //     console.log(remaining);
  //     if (remaining <= 0) {
  //       setStoryIdx((idx) => {
  //         if (idx + 1 >= stories.length) {
  //           return 0;
  //         }
  //         return idx + 1;
  //       });
  //     }

  //     // If the slide is still going, return the remaining time.
  //     if (remaining > 0) {
  //       return remaining;
  //     }

  //     // If auto advancing, reset the counter.
  //     return autoForward ? storyDuration : 0;
  //   });

  //   // Kick off the next animation.
  //   console.log("Kick off the next animation", autoForward);
  //   if (autoForward) {
  //     clearTimeout(timer.current);
  //     timer.current = setTimeout(incrementStoryAnimation, animationFrequency);
  //   }
  // }, [autoForward, stories.length, storyDuration]);

  // useEffect(() => {
  //   console.log("Mounting the autoforward");
  //   if (autoForward) {
  //     console.log("Timer, autoForward", timer.current);
  //     if (!timer.current) {
  //       console.log("Beginning the automated animation");
  //       timer.current = setTimeout(incrementStoryAnimation, animationFrequency);
  //     }
  //   }
  //   return () => {
  //     console.log("Unmounting the autoforward");
  //     clearTimeout(timer.current);
  //     timer.current = undefined;
  //   };
  // }, [autoForward, incrementStoryAnimation, storyDuration]);

  // Manually go to a slide.
  const goToSlide = useCallback(
    (idx: React.SetStateAction<number>, animate: boolean = false) => {
      setStoryIdx(idx);

      if (animate) {
        resetCountdown();
      } else {
        pauseCountdown();
      }
    },
    [pauseCountdown, resetCountdown, storyDuration],
  );

  return (
    <div className={classNames("relative", className)}>
      {/* Progress bar at the bottom of the overlay */}
      <div className="absolute bottom-0 left-0 z-10 flex h-1.5 w-full flex-row items-center justify-evenly space-x-0.5">
        {stories.map((story, idx) => (
          <ProgressBar
            key={story.title}
            progress={
              idx === storyIdx
                ? isPaused
                  ? 1
                  : (storyDuration - countdown) / storyDuration
                : 0
            }
            className="h-full w-full cursor-pointer bg-gray-100/60 hover:bg-gray-100/70"
            fillClassName="bg-white/80 linear"
            fillStyle={{ transitionDuration: `${animationFrequency}ms` }}
            onClick={() => goToSlide(idx)}
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
              goToSlide((idx) => {
                if (idx === 0) {
                  return stories.length - 1;
                }
                return idx - 1;
              });
            } else {
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
