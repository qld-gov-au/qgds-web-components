/**
 * Generate Icon List Script
 *
 * This script extracts icon names from the SCSS icon list file and generates
 * a TypeScript file with all available icon names for use in the component.
 *
 * Usage:
 *   npm run generate:icons
 *   # or directly:
 *   node scripts/generate-icon-list.js
 *
 * When to run:
 *   Run this script whenever new icons are added to src/scss/utilities/_icons.list.scss
 *   to regenerate the icon-names.ts file used by Storybook and the component.
 *
 * Input:  src/scss/utilities/_icons.list.scss
 * Output: src/components/qgds-icon/icon-names.ts
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the SCSS file
const scssPath = path.join(__dirname, "../src/scss/utilities/_icons.list.scss");
const scssContent = fs.readFileSync(scssPath, "utf-8");

// Extract icon names using regex
const iconNames = [];
const regex = /^\s*(\w[\w-]*)\s*:/gm;
let match;

while ((match = regex.exec(scssContent)) !== null) {
  iconNames.push(match[1]);
}

// Generate TypeScript file
const tsContent = `// This file is auto-generated. Do not edit directly!
// Generated from src/scss/utilities/_icons.list.scss

export const ICON_NAMES = [
${iconNames.map((name) => `  "${name}",`).join("\n")}
] as const;

export type IconName = typeof ICON_NAMES[number];
`;

// Write the TypeScript file
const outputPath = path.join(
  __dirname,
  "../src/components/qgds-icon/icon-names.ts",
);
fs.writeFileSync(outputPath, tsContent, "utf-8");

console.log(`✓ Generated icon-names.ts with ${iconNames.length} icons`); // eslint-disable-line no-undef
