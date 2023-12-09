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
