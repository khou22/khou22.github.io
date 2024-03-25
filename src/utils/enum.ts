/**
 * Converts an enum value to its corresponding string key.
 *
 * @param {E} enumValue - the enum value to convert
 * @param {Record<string, unknown>} enumType - the enum type to search for the value in
 * @return {string | undefined} the string key corresponding to the enum value, or undefined if not found
 */
export function enumToString<E>(
  enumValue: E,
  enumType: Record<string, unknown>,
): string | undefined {
  const keys = Object.keys(enumType);
  const key = keys.find(
    (k) => enumType[k as keyof typeof enumType] === enumValue,
  );
  return key;
}

/**
 * Finds the key in the enumType and returns the corresponding value.
 *
 * @param {unknown} key - The key to search for in the enumType.
 * @param {Record<string, unknown>} enumType - The enumType to search within.
 * @return {E | undefined} The corresponding value of the key if found, otherwise undefined.
 */
export function stringToEnum<E>(
  key: unknown,
  enumType: Record<string, unknown>,
): E | undefined {
  const keys = Object.keys(enumType);

  // Find the key in the enum.
  for (let i = 0; i < keys.length; i++) {
    const candidateKey = keys[i];
    if (enumType[candidateKey as keyof typeof enumType] === key) {
      return enumType[candidateKey as keyof typeof enumType] as E;
    }
  }

  // Not found.
  return undefined;
}
