type FileType = "word" | "pdf" | "image" | "video" | "audio" | "spreadsheet" | "text";

const spreadsheetMime = new Set([
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.ms-excel.sheet.macroEnabled.12",
]);

const wordMime = new Set([
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.oasis.opendocument.text",
]);

const pdfMime = "application/pdf";

const extensionMap: Record<string, FileType> = {
  // word
  doc: "word",
  docx: "word",
  odt: "word",
  rtf: "word",

  // pdf
  pdf: "pdf",

  // spreadsheet
  csv: "spreadsheet",
  xls: "spreadsheet",
  xlsx: "spreadsheet",
  xlsm: "spreadsheet",
  xlsb: "spreadsheet",
  ods: "spreadsheet",

  // images
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  bmp: "image",
  tiff: "image",
  tif: "image",

  // video
  mp4: "video",
  mov: "video",
  webm: "video",
  mkv: "video",
  avi: "video",
  mpeg: "video",
  mpg: "video",
  m4v: "video",

  // audio
  mp3: "audio",
  wav: "audio",
  m4a: "audio",
  ogg: "audio",
  oga: "audio",
  flac: "audio",
  aac: "audio",

  // text
  txt: "text",
  text: "text",
  md: "text",
  markdown: "text",
  log: "text",
};

// Centralized mime -> extension map (used by mimeToExtension)
const mimeToExtMap: Record<string, string> = {
  // pdf / word
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.oasis.opendocument.text": "odt",

  // spreadsheets
  "text/csv": "csv",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel.sheet.macroEnabled.12": "xlsm",
  "application/vnd.ms-excel.sheet.binary.macroEnabled.12": "xlsb",
  "application/vnd.oasis.opendocument.spreadsheet": "ods",

  // images
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/bmp": "bmp",
  "image/tiff": "tiff",

  // video
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
  "video/x-matroska": "mkv",
  "video/x-msvideo": "avi",
  "video/mpeg": "mpeg",

  // audio
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/mp4": "m4a",
  "audio/ogg": "ogg",
  "audio/opus": "opus",
  "audio/flac": "flac",
  "audio/aac": "aac",

  // text / other
  "text/plain": "txt",
  "text/markdown": "md",
  "application/json": "json",
  "application/xml": "xml",
  "application/rtf": "rtf",
};

/**
 * Determine a simplified file type for a `File` object.
 * Returns one of: "word", "pdf", "image", "video", "audio", "spreadsheet", "text" or `null`.
 */
export function getFileType(file: File): FileType | null {
  if (!file) return null;
  const mime = (file.type || "").toLowerCase();

  // Check mime-based rules first by asking mimeToExtension for an extension or category.
  if (mime) {
    const extOrCategory = mimeToExtension(mime);

    // If it matches a known extension, map to FileType via extensionMap
    const byExt = extensionMap[extOrCategory];
    if (byExt) return byExt;

    // If it's already a FileType-like category, return it
    if (
      extOrCategory === "pdf" ||
      extOrCategory === "word" ||
      extOrCategory === "spreadsheet" ||
      extOrCategory === "image" ||
      extOrCategory === "video" ||
      extOrCategory === "audio" ||
      extOrCategory === "text"
    ) {
      return extOrCategory as FileType;
    }
  }

  // Fallback to file extension
  const name = file.name || "";
  const idx = name.lastIndexOf(".");
  if (idx === -1) return null;
  const ext = name.slice(idx + 1).toLowerCase();
  return extensionMap[ext] ?? null;
}

/**
 * Resolve a mime type to a preferred file extension or generic file category.
 *
 * Known mime types return a canonical extension like `png`, `pdf`, or `xlsx`.
 * If the mime is only a broad type, it returns a generic category like `image`.
 * If the type is unrecognized, it returns the cleaned mime string and logs a warning.
 *
 * @param mimeType - The mime type to resolve, optionally with a charset suffix.
 * @returns A file extension, generic category, or the normalized mime string.
 */
export function mimeToExtension(mimeType: string): string {
  if (!mimeType) {
    console.warn("mimeToExtension: empty mimeType");
    return mimeType;
  }

  //
  const mime = mimeType.split(";")[0].toLowerCase().trim();

  if (mimeToExtMap[mime]) return mimeToExtMap[mime];

  // Handle +xml / +json suffixes
  if (mime.endsWith("+xml")) return "xml";
  if (mime.endsWith("+json")) return "json";

  // Category fallbacks
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("text/")) return "text";

  // Known sets
  if (mime === pdfMime) return "pdf";
  if (wordMime.has(mime)) return "word";
  if (spreadsheetMime.has(mime)) return "spreadsheet";

  console.warn(`mimeToExtension: unknown mime type "${mimeType}"`);
  return mime;
}

/**
 * Converts number of bytes to a human-readable string with the filesize in bytes, kB, MB, or GB
 * Uses binary system so 1MB = 1024kB rather than 1000kB
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
