// build.ts
import * as esbuild from "esbuild";
import inlineCssPlugin from "./.esbuild/plugins/qgds-plugin-inline-css.js";
import { sassPlugin } from "esbuild-sass-plugin";
import minimist from "minimist";

// Type definitions for command line arguments
const argv = minimist(process.argv.slice(2)) as { watch?: boolean };

// Define types for entryPoints
interface EntryPoint {
  in: string;
  out: string;
}

interface BuildConfig extends esbuild.BuildOptions {
  entryPoints: EntryPoint[];
}

const buildConfig: BuildConfig = {
  bundle: true,
  sourcemap: true,
  minify: true,
  logLevel: "info",
  outdir: "dist",
  entryPoints: [
    { in: "src/index.js", out: "js/qgds-web-components" },
    { in: "src/scss/main.scss", out: "css/qgds-web-components" },
    { in: "node_modules/@qld-gov-au/qgds-tokens/dist/css/styles/qld-default-palette.css", out: "css/palettes/qld-default-palette" },
    { in: "node_modules/@qld-gov-au/qgds-tokens/dist/css/styles/qld-corporate-palette.css", out: "css/palettes/qld-corporate-palette" },
    { in: "node_modules/@qld-gov-au/qgds-tokens/dist/css/styles/qld-maroon-palette.css", out: "css/palettes/qld-maroon-palette" },
    { in: "node_modules/@qld-gov-au/qgds-tokens/dist/css/styles/qld-high-contrast-palette.css", out: "css/palettes/qld-high-contrast-palette" },
    { in: "node_modules/@qld-gov-au/qgds-tokens/dist/css/styles/campaign-neon-palette.css", out: "css/palettes/campaign-neon-palette" },
  ],
  format: "esm",
  target: ["es2020"],
  plugins: [
    inlineCssPlugin(false),
    sassPlugin({ type: "css" }),
  ],
  loader: {
    ".html": "text",
    ".hbs": "text",
    ".jpg": "file",
    ".png": "file",
  },
};

async function StartBuild(): Promise<void> {
  const ctx = await esbuild.context(buildConfig);

  if (argv.watch === true) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

StartBuild();
