/**
 * Custom Elements Manifest Analyzer Configuration
 *
 * This configuration file controls how the CEM analyzer extracts
 * documentation from Web Components.
 *
 * Usage:
 *   npm run analyze
 *
 * Output:
 *   custom-elements.json (project root)
 *
 * @see https://custom-elements-manifest.open-wc.org/analyzer/config/
 */

import { getTsProgram, typeParserPlugin } from "@wc-toolkit/type-parser";

export default {
  /** Glob patterns to analyze */
  globs: ["src/components/**/*.ts"],

  /** Glob patterns to exclude */
  exclude: ["**/*.stories.ts", "**/*.test.ts", "**/*.spec.ts"],

  /** Output file path */
  outdir: ".",

  /** Enable Lit-specific analysis */
  litelement: true,

  /** Give the plugin access to the TypeScript type checker */
  overrideModuleCreation({ ts, globs }) {
    const program = getTsProgram(ts, globs, "tsconfig.json");
    return program
      .getSourceFiles()
      .filter((sf) => globs.find((glob) => sf.fileName.includes(glob)));
  },

  /** Additional plugins for enhanced analysis */
  plugins: [typeParserPlugin()],
};
