"use client";

import { useEffect, useState } from "react";

/**
 * Hook that returns a boolean indicating whether the specified element is currently
 * visible in the viewport.
 *
 * @param {React.RefObject<HTMLElement>} ref - The ref object representing the element
 * to observe.
 * @return {boolean} A boolean indicating whether the element is currently visible.
 */
export const useIsVisible = (ref: React.RefObject<HTMLElement>) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return isVisible;
};
