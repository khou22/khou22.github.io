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

    // Start listening for scroll events.
    window.addEventListener("scroll", scrollListener, false);

    // Since this is run client side, immediately call the listener when the page loads in case the user instantiates to a scroll position.
    scrollListener();

    // Stop listening for scroll events when the component unmounts.
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return scrollPageOffset;
};
