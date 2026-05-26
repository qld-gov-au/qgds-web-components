/* eslint-env node */
/* global console, process */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

import customElements from "../../custom-elements.json" with { type: "json" };
import pkg from "../../package.json" with { type: "json" };
import dxpConfig from "./dxp.config.js";

const DEFAULT_SCHEMA = "http://localhost:3000/schemas/v1.json#";
const DEFAULT_NAMESPACE = "qgds-web-components";
const DEFAULT_ICON = {
  id: "widgets",
  color: {
    type: "hex",
    value: "#2D2D2D",
  },
};

const DEFAULT_OUTPUT_DIR = "dist/dxp";
const DEFAULT_ASSETS_DIR = "scripts/dxp/_assets";
const SUPPORTING_FILES = ["main.mjs", "preview-wrapper.html", "README.md"];

function findComponentDeclarations(cem) {
  return (cem.modules || []).flatMap((module) =>
    (module.declarations || [])
      .filter((declaration) => declaration.tagName)
      .map((declaration) => ({
        ...declaration,
        modulePath: module.path,
      }))
  );
}

function normaliseComponentName(tagName) {
  return tagName.replace(/[^a-z0-9]/g, "");
}

function toDisplayName(declaration) {
  return declaration.tagName
    .replace(/^qgds-/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toFieldName(attribute) {
  if (attribute.fieldName) {
    return attribute.fieldName;
  }

  return attribute.name.replace(/-([a-z])/g, (_, character) => character.toUpperCase());
}

function parseDefaultValue(value) {
  if (value === undefined || value === null) {
    return undefined;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value.replace(/^["']|["']$/g, "");
  }
}

function parseEnumValues(typeText) {
  const parts = typeText
    .split("|")
    .map((part) => part.trim())
    .filter((part) => part && !["undefined", "null"].includes(part));

  const isLiteral = (part) =>
    /^["'][^"']*["']$/.test(part) || /^-?\d+(\.\d+)?$/.test(part) || ["true", "false"].includes(part);

  if (!parts.length || !parts.every(isLiteral)) {
    return undefined;
  }

  const values = parts.map((part) => {
    if (/^["'][^"']*["']$/.test(part)) {
      return part.replace(/^["']|["']$/g, "");
    }

    if (["true", "false"].includes(part)) {
      return part === "true";
    }

    return Number(part);
  });

  const unsupportedCharacters = ["[", "]", "<", ">", "{", "}", "(", ")"];
  if (
    !values.length ||
    values.some((value) => unsupportedCharacters.some((character) => String(value).includes(character)))
  ) {
    return undefined;
  }

  return values;
}

function toJsonSchemaType(typeText = "string") {
  const normalisedType = typeText.toLowerCase();

  if (normalisedType.includes("boolean")) {
    return { type: "boolean" };
  }

  if (normalisedType.includes("number")) {
    return { type: "number" };
  }

  if (normalisedType.includes("integer")) {
    return { type: "integer" };
  }

  if (normalisedType.includes("[]") || normalisedType.includes("array")) {
    return {
      type: "array",
      items: { type: "string" },
    };
  }

  const enumValues = typeText.includes("|") ? parseEnumValues(typeText) : undefined;
  if (enumValues?.length) {
    return {
      type: "string",
      enum: enumValues,
    };
  }

  return { type: "string" };
}

function toInputProperty(attribute) {
  const property = {
    ...toJsonSchemaType(attribute.type?.text),
  };

  if (attribute.description) {
    property.description = attribute.description;
  }

  const defaultValue = parseDefaultValue(attribute.default);
  if (defaultValue !== undefined) {
    property.default = defaultValue;
  }

  return property;
}

function getOverrides(tagName) {
  return dxpConfig.overrides?.[tagName] || {};
}

function createInputSchema(declaration) {
  const overrides = getOverrides(declaration.tagName);
  const excludedFields = new Set(overrides.excludeFields || []);
  const properties = {};

  for (const attribute of declaration.attributes || []) {
    const fieldName = toFieldName(attribute);

    if (!fieldName || excludedFields.has(fieldName) || excludedFields.has(attribute.name)) {
      continue;
    }

    properties[fieldName] = {
      ...toInputProperty(attribute),
      ...(overrides.properties?.[fieldName] || {}),
    };
  }

  if (overrides.properties) {
    for (const [fieldName, schema] of Object.entries(overrides.properties)) {
      if (!excludedFields.has(fieldName)) {
        properties[fieldName] = {
          ...(properties[fieldName] || {}),
          ...schema,
        };
      }
    }
  }

  return {
    type: "object",
    properties,
    required: overrides.required || [],
  };
}

function createManifest(declaration) {
  const overrides = getOverrides(declaration.tagName);

  return {
    $schema: dxpConfig.schema || DEFAULT_SCHEMA,
    version: overrides.version || pkg.version,
    name: overrides.name || normaliseComponentName(declaration.tagName),
    displayName: overrides.displayName || toDisplayName(declaration),
    namespace: overrides.namespace || dxpConfig.namespace || DEFAULT_NAMESPACE,
    icon: overrides.icon || dxpConfig.icon || DEFAULT_ICON,
    description:
      overrides.description ||
      declaration.description?.replace(/\s+/g, " ").trim() ||
      `${toDisplayName(declaration)} component.`,
    mainFunction: "main",
    type: "edge",
    functions: [
      {
        name: "main",
        entry: overrides.entry || "main.mjs",
        input: createInputSchema(declaration),
        output: { responseType: "html" },
      },
    ],
  };
}

function getTemplateContext(declaration) {
  const overrides = getOverrides(declaration.tagName);
  const excludedFields = new Set(overrides.excludeFields || []);
  const displayName = overrides.displayName || toDisplayName(declaration);
  const description =
    overrides.description || declaration.description?.replace(/\s+/g, " ").trim() || `${displayName} component.`;

  return {
    attributeMap: JSON.stringify(
      (declaration.attributes || [])
        .map((attribute) => ({
          attributeName: attribute.name,
          fieldName: toFieldName(attribute),
        }))
        .filter(
          ({ attributeName, fieldName }) =>
            fieldName && !excludedFields.has(fieldName) && !excludedFields.has(attributeName)
        ),
      null,
      2
    ),
    componentDescription: description,
    componentDisplayName: displayName,
    componentName: overrides.name || normaliseComponentName(declaration.tagName),
    componentTagName: declaration.tagName,
    packageName: pkg.name,
    packageVersion: pkg.version,
  };
}

function replaceTemplateTokens(contents, context) {
  return contents.replace(/\{\{([a-zA-Z0-9]+)\}\}/g, (match, token) => {
    if (Object.hasOwn(context, token)) {
      return context[token];
    }

    return match;
  });
}

function writeSupportingFiles(declaration, componentDir) {
  const assetsDir = resolve(process.cwd(), dxpConfig.assetsDir || DEFAULT_ASSETS_DIR);
  const context = getTemplateContext(declaration);

  for (const fileName of SUPPORTING_FILES) {
    const templatePath = resolve(assetsDir, fileName);

    if (!existsSync(templatePath)) {
      throw new Error(`DXP supporting file template not found: ${templatePath}`);
    }

    const contents = readFileSync(templatePath, "utf-8");
    const outputPath = resolve(componentDir, fileName);

    writeFileSync(outputPath, replaceTemplateTokens(contents, context));
  }
}

function getConfiguredComponents() {
  const declarations = findComponentDeclarations(customElements);
  const declarationByTagName = new Map(declarations.map((declaration) => [declaration.tagName, declaration]));
  const configuredTags = dxpConfig.components || declarations.map((declaration) => declaration.tagName);
  const missingTags = configuredTags.filter((tagName) => !declarationByTagName.has(tagName));

  if (missingTags.length) {
    throw new Error(`DXP config references components not found in custom-elements.json: ${missingTags.join(", ")}`);
  }

  return configuredTags.map((tagName) => declarationByTagName.get(tagName));
}

// Generate manifest files for configured DXP components.
function generateManifests() {
  const outputDir = resolve(process.cwd(), dxpConfig.outputDir || DEFAULT_OUTPUT_DIR);
  const declarations = getConfiguredComponents();

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  for (const declaration of declarations) {
    const componentDir = resolve(outputDir, declaration.tagName);
    const manifestPath = resolve(componentDir, "manifest.json");

    mkdirSync(componentDir, { recursive: true });
    writeFileSync(manifestPath, `${JSON.stringify(createManifest(declaration), null, 2)}\n`);
    writeSupportingFiles(declaration, componentDir);
  }

  console.log(
    `Generated ${declarations.length} DXP component export${declarations.length === 1 ? "" : "s"} in ${outputDir}`
  );
}

try {
  generateManifests();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
