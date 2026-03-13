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
import { jsDocTagsPlugin } from "@wc-toolkit/jsdoc-tags";
import { cemSorterPlugin } from "@wc-toolkit/cem-sorter";

export default {
  /** Glob patterns to analyze */
  globs: ["src/components/**/*.ts", "src/utils/abstracts/**/*.ts"],

  /** Glob patterns to exclude */
  exclude: ["**/*.stories.ts", "**/*.test.ts", "**/*.spec.ts"],

  /** Output file path */
  outdir: ".",

  /** Enable Lit-specific analysis */
  litelement: true,

  /**
   * Give the plugin access to the TypeScript type checker.
   * Filter to only include component files where filename matches parent folder,
   * plus all files in the abstracts directory.
   * e.g., qgds-icon/qgds-icon.ts is included, but qgds-icon/icon-names.ts is excluded.
   */
  overrideModuleCreation({ ts, globs }) {
    const program = getTsProgram(ts, globs, "tsconfig.json");
    return program.getSourceFiles().filter((sf) => {
      if (!sf.fileName.endsWith(".ts")) return false;

      // Include all files in abstracts directory
      if (sf.fileName.includes("/utils/abstracts/")) {
        return true;
      }

      // Include component files where filename matches parent folder
      const dirname = path.basename(path.dirname(sf.fileName));
      const basename = path.basename(sf.fileName, ".ts");
      return basename === dirname || basename.startsWith(dirname + "-");
    });
  },

  /** Additional plugins for enhanced analysis */
  plugins: [
    typeParserPlugin(),
    jsDocTagsPlugin({
      tags: {
        uikit: {},
        website: {},
        tagname: {},
      },
    }),
    cemSorterPlugin({
      deprecatedLast: true,
      customFields: ["customProperty"],
    }),
  ],
};
