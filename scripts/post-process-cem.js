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

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// eslint-disable-next-line no-undef
const cemPath = resolve(process.cwd(), "custom-elements.json");

const cem = JSON.parse(readFileSync(cemPath, "utf-8"));

/**
 * Recursively process declarations to move parsedType to type.text
 */
function processDeclarations(declarations) {
  for (const declaration of declarations) {
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
