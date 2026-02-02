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

export default {
  /** Glob patterns to analyze */
  globs: ["src/components/**/*.ts"],

  /** Glob patterns to exclude */
  exclude: ["**/*.stories.ts", "**/*.test.ts", "**/*.spec.ts"],

  /** Output file path */
  outdir: ".",

  /** Enable Lit-specific analysis */
  litelement: true,

  /** Additional plugins for enhanced analysis */
  plugins: [],
};
