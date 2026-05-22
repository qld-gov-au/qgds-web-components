/* eslint-env node */
/**
 * Generate Component Exports
 *
 * Scans src/components for all component TypeScript files and regenerates
 * src/index.ts with sorted, alphabetically-ordered export statements.
 *
 * Usage:
 *   node scripts/generate-component-exports.js
 */

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve, relative, basename, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const COMPONENTS_DIR = resolve(ROOT, "src/components");
const OUTPUT_FILE = resolve(ROOT, "src/index.ts");

const EXCLUDE_PATTERNS = [/\.test\.ts$/, /\.stories\.ts$/, /^_/];

/**
 * Recursively find all .ts files under a COMPONENTS_DIR.
 */
function findTsFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findTsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Extract the first exported custom element class that matches the QGDS naming convention.
 * Returns null if no matching class is found, preventing helper or utility
 * classes from being silently included in the barrel export.
 */
function extractComponentMetadata(filePath) {
  const content = readFileSync(filePath, "utf-8");

  const customElementMatch = content.match(/@customElement\(\s*["'](qgds-[\w-]+)["']\s*\)/);
  if (!customElementMatch) return null;

  const classMatch = content.match(/^export class (QGDS\w+)/m);
  if (!classMatch) {
    const mixedCaseMatch = content.match(/^export class (Qgds\w+)/im);
    const hint = mixedCaseMatch
      ? `\n  Found "${mixedCaseMatch[1]}" — class name must use all-caps QGDS prefix.\n  Rename to "${mixedCaseMatch[1].replace(/^Qgds/i, "QGDS")}" in ${filePath}`
      : `\n  No exported class with QGDS prefix found in ${filePath}\n  Ensure the class is exported and follows the QGDSComponentName convention.`;
    throw new Error(`Class naming error for <${customElementMatch[1]}>${hint}`);
  }

  return {
    tagName: customElementMatch[1],
    className: classMatch[1],
  };
}

const allFiles = findTsFiles(COMPONENTS_DIR);
const exportEntries = [];

try {
  for (const filePath of allFiles) {
    if (EXCLUDE_PATTERNS.some((pattern) => pattern.test(basename(filePath)))) continue;

    const metadata = extractComponentMetadata(filePath);
    if (!metadata) continue;

    // Path relative to src/index.ts, normalised to forward slashes
    const relativePath = "./" + relative(resolve(ROOT, "src"), filePath).replace(/\\/g, "/").replace(/\.ts$/, "");

    exportEntries.push({ tagName: metadata.tagName, className: metadata.className, relativePath });
  }
} catch (err) {
  // eslint-disable-next-line no-undef
  console.error(`\x1b[31m\n✖ ${err.message}\n\x1b[0m`);
  // eslint-disable-next-line no-undef
  process.exit(1);
}

// Alphabetical by class name for clean git diffs and predictable merge behaviour
exportEntries.sort((a, b) => a.className.localeCompare(b.className));

const exportLines = exportEntries
  .map(({ className, relativePath }) => `export { ${className} } from "${relativePath}";`)
  .join("\n");

const output = `/**
 * Queensland Government Design System (QGDS) - Web Component Library
 *
 * AUTO-GENERATED — do not edit manually.
 * Run \`npm run generate:exports\` to regenerate.
 *
 * @packageDocumentation
 */

import "./styles/main.scss";

// =============================================================================
// QGDS Components
// =============================================================================
${exportLines}
`;

writeFileSync(OUTPUT_FILE, output, "utf-8");

// eslint-disable-next-line no-undef
console.log(`✓ Generated ${exportEntries.length} component exports → src/index.ts`);

// Console warn if the "QGDS" prefix is not uppercase
exportEntries.forEach(({ className, relativePath }) => {
  // eslint-disable-next-line no-undef
  console.log(`\x1b[32m✓ "${className}" in file "${relativePath}"\x1b[0m`);
  if (!/^QGDS/.test(className)) {
    // eslint-disable-next-line no-undef
    console.warn(
      `⚠️  Ensure class name "${className}" in file "${relativePath}" uses QGDSComponentName naming convention.`
    );
  }
});
