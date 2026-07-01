// Mock a File Object for now.
export const textFile: File = new File(["content"], "text-file.txt", {
  type: "text/plain",
});
export const wordFile: File = new File(["content"], "word-file.docx", {
  type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
});
export const pdfFile: File = new File(["content"], "pdf-file.pdf", {
  type: "application/pdf",
});
export const imageFile: File = new File(["content"], "image-file.jpg", {
  type: "image/jpeg",
});
export const csvFile: File = new File(["content"], "csv-file.csv", {
  type: "text/csv",
});
export const audioFile: File = new File(["content"], "audio-file.mp3", {
  type: "audio/mpeg",
});
export const videoFile: File = new File(["content"], "video-file.mp4", {
  type: "video/mp4",
});
export const errorFile: File = new File(["content"], "error-file.csv", {
  type: "text/plain",
});
export const successFile: File = new File(
  ["content"],
  "success-fileLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.csv",
  {
    type: "text/plain",
  }
);

Object.defineProperty(videoFile, "size", { value: 12_345_678, configurable: true });
Object.defineProperty(imageFile, "size", { value: 12_345, configurable: true });
Object.defineProperty(errorFile, "size", { value: 12_345_678_910, configurable: true });

export const allFilesArray = [
  successFile,
  errorFile,
  videoFile,
  audioFile,
  csvFile,
  imageFile,
  pdfFile,
  wordFile,
  textFile,
];
