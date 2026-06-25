import { UUID } from "crypto";
/**
 * Generates a v4 UUID in the browser without ESLint violations.
 * Uses native crypto.randomUUID() if available, otherwise falls back
 * to a cryptographically secure random values loop.
 */
export function generateUUID(): UUID {
  // 1. Safe check for native secure context method
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  // 2. Pure TypeScript fallback using standard crypto.getRandomValues
  const placeholder = "10000000-1000-4000-8000-100000000000";

  return placeholder.replace(/[018]/g, (char) => {
    const num = parseInt(char, 10);
    const randomByte = crypto.getRandomValues(new Uint8Array(1))[0];

    // Shift bitwise operations based on standard UUID v4 algorithm
    return (num ^ (randomByte & (15 >> (num / 4)))).toString(16);
  }) as UUID;
}
