import { notEmpty } from "./arrays";

/**
 * Combine multiple class names into a single string.
 */
export const classNames = (
  ...args: (string | boolean | undefined | null)[]
): string => {
  const validClasses = args
    .filter(notEmpty)
    .filter((v) => typeof v === "string");
  return validClasses.join(" ");
};
