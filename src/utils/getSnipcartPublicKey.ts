/**
 * Get the Snipcart public key. If not found, throw an error.
 */
export const getSnipcartPublicKey = (): string => {
  const snipcartKey = process.env.NEXT_PUBLIC_SNIPCART_KEY;
  if (!snipcartKey) {
    throw new Error("No Snipcart public key found");
  }
  return snipcartKey;
};
