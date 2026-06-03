/**
 * Converts number of bytes to a human-readable string with the filesize in bytes, kB, MB, or GB
 * Uses metric system, not binary so 1MB = 1000kB rather than 1024kB
 * @param {number} size the file size in bytes
 * @returns string
 */
export const readableFileSize = (size: number): string => {
  const units = ["kB", "MB", "GB"];
  const threshold = 1024;

  if (!Number.isFinite(size) || size <= 0) {
    return "0 bytes";
  }

  if (size < threshold) {
    return `${size} bytes`;
  }

  let value = size;
  let unitIndex = -1;

  while (value >= threshold && unitIndex < units.length - 1) {
    value /= threshold;
    unitIndex += 1;
  }

  const roundedValue = Math.round(value * 100) / 100;
  return `${roundedValue} ${units[unitIndex]}`;
};
