/// <reference types="vitest/config" />
// vite.config.ts
import { defineConfig } from "vite";
import path from "node:path";
import glob from "fast-glob";
import { fileURLToPath } from "url";
import { viteStaticCopy } from "vite-plugin-static-copy";

const visualizer = await import("rollup-plugin-visualizer").then((m) => m.visualizer).catch(() => null);

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolves component entry points for the Vite build.
 * Maps 'src/components/qgds-button/qgds-button.ts' to 'button'
 */
export function resolveComponentInputs(): Record<string, string> {
  // Use glob.sync instead of globSync
  const entries: string[] = glob.sync(["src/components/**/index.ts", "src/components/**/qgds-[!.]*.ts"], {
    // This is the crucial fix: prevent story files from becoming entry points
    ignore: ["**/*.stories.ts", "**/*.test.ts", "**/*.styles.ts"],
  });

  const inputs: Record<string, string> = {};

  for (const entry of entries) {
    const dirName = path.dirname(entry).split(path.sep).pop();

    if (dirName?.startsWith("qgds-")) {
      const shortName = dirName.replace("qgds-", "");
      const isIndex = path.basename(entry) === "index.ts";

      if (isIndex || !inputs[shortName]) {
        // Use path.resolve to provide Rollup with the absolute path
        inputs[shortName] = path.resolve(process.cwd(), entry);
      }
    }
  }

  return inputs;
}

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // Using modern Sass API
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: true,
    cssCodeSplit: true,
    target: "es2020",
    lib: {
      entry: {
        // The key 'index' will be used for the main library bundle
        index: path.resolve(__dirname, "src/index.ts"),
        "qgds-grid": path.resolve(__dirname, "src/styles/grid/index.ts"),
        ...resolveComponentInputs(),
      },
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: (chunkInfo) => {
          // If the entry is our 'index' key, put it in the dist/assets/js root
          if (chunkInfo.name === "index") {
            return "assets/js/qgds-web-components.js";
          }
          // Everything else (the components) goes into the dist/assets/js/components folder
          return "assets/js/components/[name].js";
        },

        manualChunks: (id) => {
          // Force all storybook and preview-api related files into one chunk
          if (id.includes("storybook") || id.includes("@storybook") || id.includes("preview-api")) {
            return "storybook-vendor";
          }
        },

        chunkFileNames: "assets/js/chunks/[name]-[hash].js",

        // Other non JS assets from input object (CSS/Images):
        assetFileNames: (assetInfo) => {
          //Original filename
          let name = Array.isArray(assetInfo.names) ? assetInfo.names[0] : assetInfo.name;
          console.log("Asset name:", name);

          // If for some reason the name is missing, fall back to standard pattern
          if (!name) return "assets/[name][extname]";

          // Clean up the name (remove -js or -css suffixes if they exist)
          name = name.replace("-css", "");

          if (name === "index.css") {
            return "assets/css/qgds-web-components.css";
          }

          // CSS files are placed in assets/css/ folder
          if (name.endsWith(".css")) {
            return `assets/css/${name}`;
          }

          // All other assets (images, fonts, etc.) are placed in assets/ folder
          return "assets/[name][extname]";
        },
      },
      //rollup plugins
      plugins: [],
    },
  },
  // vite plugins
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/demo/index-built.html",
          dest: ".",
          rename: "examples/demo/index.html",
        },
        {
          src: "src/demo/demo.css",
          dest: "examples/demo/demo.css",
        },
        {
          src: "src/templates/component-list.html",
          dest: "examples/component-list",
          rename: "index.html",
        },
        {
          src: "src/templates/content-page.html",
          dest: "examples/templates",
          rename: "content-page.html",
        },
      ],
    }) as any,
    visualizer ? visualizer({ open: false, filename: "_dev/bundle-analysis.html" }) : null,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
