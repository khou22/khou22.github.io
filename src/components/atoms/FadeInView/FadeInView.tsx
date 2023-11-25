"use client";

import { classNames } from "@/utils/style";
import React, { useRef, useEffect, useState } from "react";

interface FadeInViewProps {
  once?: boolean;
  durationMS?: number;
  children: React.ReactNode;
}

/**
 * Creates a fading animation effect for a React component when it becomes visible in the viewport.
 */
export const FadeInView: React.FC<FadeInViewProps> = ({
  once = false,
  durationMS = 500,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else {
          if (!once) {
            setIsVisible(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [once]);

  return (
    <div
      ref={ref}
      className={classNames(
        "transition-opacity",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{
        transitionDuration: `${durationMS}ms`,
      }}
    >
      {children}
    </div>
  );
};
