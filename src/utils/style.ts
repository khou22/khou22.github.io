import { notEmpty } from "./arrays";

/**
 * Combine multiple class names into a single string.
 */
export const classNames = (...args: (string | undefined | null)[]): string => {
  const validClasses = args.filter(notEmpty);
  return validClasses.join(" ");
};
