"use client";

import { useEffect, useMemo, useRef } from "react";

/**
 * Simple component that automatically scrolls to the element with the ID that is in the URL.
 */
export const Autoscroll = () => {
  // Only scroll once per ID.
  const hasScrolled = useRef<string | null>(null);

  useEffect(() => {
    const toID = window.location.hash?.replace("#", "");
    if (!toID) return;
    if (hasScrolled.current === toID) return;
    const el = document.getElementById(toID);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      hasScrolled.current = toID;
    }
  }, []);

  return <></>;
};
