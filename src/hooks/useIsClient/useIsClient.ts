"use client";

import { useEffect, useState } from "react";

/**
 * Returns whether the app is running in the browser or on the server.
 *
 * https://nextjs.org/docs/messages/react-hydration-error#solution-1-using-useeffect-to-run-on-the-client-only
 */
export const useIsClient = (): boolean => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
