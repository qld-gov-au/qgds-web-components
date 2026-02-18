import React from "react";
import { useOf } from "@storybook/addon-docs/blocks";
import { getComponentByTagName } from "@wc-toolkit/cem-utilities";
import manifest from "../../custom-elements.json";

const getComponentData = () => {
  const resolvedOf = useOf("meta", ["meta"]);
  const componentName = resolvedOf.preparedMeta?.component || "";
  const component = getComponentByTagName(manifest, componentName);

  // Exit early
  if (!component) {
    console.warn("No component found in manifest for:", componentName);
    return null;
  }

  // Return subset of metadata relevant to the links we want to render.
  // Any custom @tags usually contain name and description keys, refer custom-elements.json for structure
  return {
    uikit:
      typeof component.uikit === "string"
        ? component.uikit
        : (component.uikit?.name ?? component.uikit?.description),
    website:
      typeof component.website === "string"
        ? component.website
        : (component.website?.name ?? component.website?.description),
  };
};

// Returns the JSX block <ComponentLinks /> for use on the custom DocumentationTemplate page
export const ComponentLinks = () => {
  const metadata = getComponentData();

  // Check if some metadata exists
  if (!metadata || !Object.values(metadata).some(Boolean)) {
    return null;
  }

  //Render a simple UI with links to the Figma UI Kit and Guidelines if available in the metadata
  return (
    <>
      <p
        style={{
          marginBottom: "2rem",
          display: "flex",
          gap: "0.75rem",
        }}>
        {metadata.uikit && (
          <a href={metadata.uikit} target='_blank' rel='noopener noreferrer'>
            Figma UI Kit
          </a>
        )}
        {metadata.website && (
          <a href={metadata.website} target='_blank' rel='noopener noreferrer'>
            Guidelines
          </a>
        )}
      </p>
    </>
  );
};
