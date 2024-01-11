"use client";

import React, { useEffect, useRef, useState } from "react";
import { classNames } from "@/utils/style";

interface FadeInViewProps {
  once?: boolean;
  delayMS?: number;
  durationMS?: number;
  threshold?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Creates a fading animation effect for a React component when it becomes visible in the viewport.
 */
export const FadeInView: React.FC<FadeInViewProps> = ({
  once = false,
  delayMS = 0,
  durationMS = 500,
  threshold = 0.1,
  className = "",
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && currentRef) {
            observer.unobserve(currentRef);
          }
        } else {
          if (!once) {
            setIsVisible(false);
          }
        }
      },
      { threshold: threshold },
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      className={classNames(
        "transition-opacity",
        className,
        isVisible ? "opacity-100" : "opacity-0",
      )}
      style={{
        transitionDuration: `${durationMS}ms`,
        transitionDelay: `${delayMS}ms`,
      }}
    >
      {children}
    </div>
  );
};
