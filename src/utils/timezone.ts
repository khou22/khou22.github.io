/**
 * Get the current time zone.
 */
export const getCurrentTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
