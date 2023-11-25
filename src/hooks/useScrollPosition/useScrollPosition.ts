"use client";

import { useEffect, useState } from "react";

export type ScrollPosition = {
  scrollY: number;
  scrollX: number;
};

/**
 * Returns the current scroll position of the window.
 *
 * @returns {ScrollPosition} The scroll position of the window.
 */
export const useScrollPosition = (): ScrollPosition => {
  const [scrollPageOffset, setScrollPageOffset] = useState<ScrollPosition>({
    scrollY: 0,
    scrollX: 0,
  });

  useEffect(() => {
    const scrollListener = () => {
      setScrollPageOffset({
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      });
    };
    window.addEventListener("scroll", scrollListener, false);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return scrollPageOffset;
};
