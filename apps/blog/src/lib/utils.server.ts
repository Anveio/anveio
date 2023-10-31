export async function generate256BitToken(): Promise<string> {
  if (!crypto || !crypto.subtle) {
    throw new Error("Crypto API is not available in this environment.");
  }

  // Generate random values
  const randomValues = new Uint8Array(32); // 32 bytes (256 bits) for strong randomness
  crypto.getRandomValues(randomValues);

  // Convert the random values to a hex string for easier storage and handling
  const token = Array.from(randomValues)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return token;
}
