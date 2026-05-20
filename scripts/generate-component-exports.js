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
 * Extract the first exported class name that matches the QGDS naming convention.
 * Returns null if no matching class is found, preventing helper or utility
 * classes from being silently included in the barrel export.
 */
function extractExportedClass(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const match = content.match(/^export class (qgds\w+)/im);
  return match ? match[1] : null;
}

const allFiles = findTsFiles(COMPONENTS_DIR);
const exportEntries = [];

for (const filePath of allFiles) {
  if (EXCLUDE_PATTERNS.some((pattern) => pattern.test(basename(filePath)))) continue;

  const className = extractExportedClass(filePath);
  if (!className) continue;

  // Path relative to src/index.ts, normalised to forward slashes
  const relativePath = "./" + relative(resolve(ROOT, "src"), filePath).replace(/\\/g, "/").replace(/\.ts$/, "");

  exportEntries.push({ className, relativePath });
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
// eslint-disable-next-line no-undef
console.table(exportEntries);

// Console warn if the "QGDS" prefix is not uppercase
exportEntries.forEach(({ className, relativePath }) => {
  if (!/^QGDS/.test(className)) {
    // eslint-disable-next-line no-undef
    console.warn(
      `⚠️  Ensure class name "${className}" in file "${relativePath}" uses QGDSComponentName naming convention.`
    );
  }
});
