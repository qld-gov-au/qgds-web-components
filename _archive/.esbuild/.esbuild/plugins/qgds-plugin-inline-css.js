// This plugin inlines CSS files as text strings when they are imported into JS/TS.
// Usage:
// import { cssAsString } from path/to/cssfile.css?inline

import fs from "fs/promises";
import path from "path";
//import log from "../helpers/logger.js"; // Assuming you want logging

export default function inlineCssPlugin(showlog = false) {
  return {
    name: "inline-css",
    setup(build) {
      build.onResolve({ filter: /\.css\?inline$/ }, (args) => {
        const fullPath = path.resolve(
          args.resolveDir,
          args.path.replace(/\?inline$/, "")
        );
        console.log(`Resolving inline CSS: ${fullPath}`);

        return {
          path: fullPath,
          namespace: "inline-css-ns",
        };
      });

      build.onLoad(
        { filter: /.*/, namespace: "inline-css-ns" },
        async (args) => {
          const cssContent = await fs.readFile(args.path, "utf8");
          //if (showlog) log("magenta", `Inlining CSS: ${args.path}...`);
          return {
            contents: cssContent,
            loader: "text",
          };
        }
      );
    },
  };
}
