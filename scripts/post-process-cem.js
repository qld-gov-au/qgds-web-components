/* eslint-env node */
/**
 * Post-process Custom Elements Manifest
 *
 * Moves parsedType values to type.text so Storybook can use the expanded types
 * for auto-generating select controls.
 *
 * Usage:
 *   node scripts/post-process-cem.js
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// eslint-disable-next-line no-undef
const cemPath = resolve(process.cwd(), "custom-elements.json");

// Check if CEM file exists
if (!existsSync(cemPath)) {
  // eslint-disable-next-line no-undef
  console.warn("⚠ custom-elements.json not found, skipping post-processing");
  // eslint-disable-next-line no-undef
  process.exit(0);
}

let cem;
try {
  cem = JSON.parse(readFileSync(cemPath, "utf-8"));
} catch (error) {
  // eslint-disable-next-line no-undef
  console.error("✗ Failed to parse custom-elements.json:", error.message);
  // eslint-disable-next-line no-undef
  process.exit(1);
}

// Fallback to empty modules array if not present
if (!cem.modules) {
  cem.modules = [];
}

/**
 * Recursively process declarations to move parsedType to type.text
 * and strip private members from the public API surface.
 */
function processDeclarations(declarations) {
  for (const declaration of declarations) {
    // Strip private members — they are internal implementation details and
    // should not appear in the public API surface of the manifest.
    if (declaration.members) {
      declaration.members = declaration.members.filter((m) => m.privacy !== "private");
    }

    // Process members (fields, methods)
    if (declaration.members) {
      for (const member of declaration.members) {
        if (member.parsedType?.text) {
          member.type = { text: member.parsedType.text };
          delete member.parsedType;
        }
      }
    }

    // Process attributes
    if (declaration.attributes) {
      for (const attr of declaration.attributes) {
        if (attr.parsedType?.text) {
          attr.type = { text: attr.parsedType.text };
          delete attr.parsedType;
        }
      }
    }
  }
}

// Process all modules
for (const module of cem.modules) {
  if (module.declarations) {
    processDeclarations(module.declarations);
  }
}

writeFileSync(cemPath, JSON.stringify(cem, null, 2));

// eslint-disable-next-line no-undef
console.log("✓ Custom Elements Manifest post-processed: private members stripped, parsedType → type.text");
