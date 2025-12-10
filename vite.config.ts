/// <reference types="vitest/config" />
// vite.config.ts
import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
    target: "es2020",
    rollupOptions: {
      input: {
        "qgds-web-components": "./src/index.ts",
        "qgds-web-components-css": "./src/scss/main.scss",
      },
      output: {
        // All JS assets from input object:
        // Automatically puts any JS entry into the assets/js/ folder using its input key
        entryFileNames: "assets/js/[name].js",
        // Other non JS assets from input object (CSS/Images):
        assetFileNames: (assetInfo) => {
          //Original filename
          let name = Array.isArray(assetInfo.names)
            ? assetInfo.names[0]
            : assetInfo.name;
          console.log("Asset name:", name);

          // If for some reason the name is missing, fall back to standard pattern
          if (!name) return "assets/[name][extname]";

          // Clean up the name (remove -js or -css suffixes if they exist)
          name = name.replace("-css", "");

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
  //vite plugins
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/templates/index.html",
          dest: "",
        },
      ],
    }) as any,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    projects: [
      // Unit tests project
      {
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            include: ["src/**/*.ts"],
            exclude: [
              "src/**/*.test.ts",
              "src/**/*.stories.ts",
              "src/**/*.d.ts",
            ],
          },
        },
      },
      // Storybook tests project
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(__dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
