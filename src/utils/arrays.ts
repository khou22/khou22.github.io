/**
 * Filter an array for only non-null and non-undefined values
 */
export const notEmpty = <ArgType>(
  v: ArgType | null | undefined
): v is ArgType => {
  return v !== null && v !== undefined;
};
