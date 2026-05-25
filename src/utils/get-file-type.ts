/**
 * Determine a simplified file type for a `File` object.
 * Returns one of: "word", "pdf", "image", "video", "audio", "spreadsheet", "text" or `null`.
 */
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

const textMimePrefixes = ["text/"];

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

export function getFileType(file: File): FileType | null {
  if (!file) return null;

  const mime = (file.type || "").toLowerCase();

  // Check mime-based rules first
  if (mime) {
    if (mime === pdfMime) return "pdf";
    if (wordMime.has(mime)) return "word";
    if (spreadsheetMime.has(mime)) return "spreadsheet";
    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime.startsWith("audio/")) return "audio";
    if (textMimePrefixes.some((p) => mime.startsWith(p))) return "text";

    // Some vendor-specific or suffix based types (e.g. +xml, +json) can be treated as text
    if (mime.endsWith("+xml") || mime.endsWith("+json")) return "text";
  }

  // Fallback to file extension
  const name = file.name || "";
  const idx = name.lastIndexOf(".");
  if (idx === -1) return null;
  const ext = name.slice(idx + 1).toLowerCase();
  return extensionMap[ext] ?? null;
}
