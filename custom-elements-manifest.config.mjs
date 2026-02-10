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

import path from "path";
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

  /**
   * Give the plugin access to the TypeScript type checker.
   * Filter to only include component files where filename matches parent folder.
   * e.g., qgds-icon/qgds-icon.ts is included, but qgds-icon/icon-names.ts is excluded.
   */
  overrideModuleCreation({ ts, globs }) {
    const program = getTsProgram(ts, globs, "tsconfig.json");
    return program.getSourceFiles().filter((sf) => {
      if (!sf.fileName.endsWith(".ts")) return false;
      const dirname = path.basename(path.dirname(sf.fileName));
      const basename = path.basename(sf.fileName, ".ts");
      return basename === dirname;
    });
  },

  /** Additional plugins for enhanced analysis */
  plugins: [typeParserPlugin()],
};
