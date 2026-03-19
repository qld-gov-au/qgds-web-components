import React from "react";
import { useOf } from "@storybook/addon-docs/blocks";
import { getComponentByTagName } from "@wc-toolkit/cem-utilities";
import manifest from "../../custom-elements.json";

const getComponentData = () => {
  const resolvedOf = useOf("meta", ["meta"]);

  const componentName = resolvedOf.preparedMeta?.component || "";

  if (componentName === "") {
    console.warn(
      `Please add a component name to Storybook Meta config. See example at https://wc-toolkit.com/integrations/storybook/#setup`
    );
  }

  const component = getComponentByTagName(manifest, componentName);

  // Exit early
  if (!component) {
    console.warn("No component found in manifest for:", componentName);
    return null;
  }

  // Return subset of metadata relevant to the links we want to render.
  // Any custom @tags usually contain name and description keys, refer custom-elements.json for structure
  return {
    tagname: component.tagName,
    uikit:
      typeof component.uikit === "string" ? component.uikit : (component.uikit?.name ?? component.uikit?.description),
    website:
      typeof component.website === "string"
        ? component.website
        : (component.website?.name ?? component.website?.description),
  };
};

// Returns the JSX block <ComponentLinks /> for use on the custom DocumentationTemplate page
export const Links = () => {
  const metadata = getComponentData();
  console.log("Component metadata for links:", metadata);

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
        }}
      >
        {metadata.uikit && (
          <a href={metadata.uikit} target="_blank" rel="noopener noreferrer">
            Figma UI Kit
          </a>
        )}
        {metadata.website && (
          <a href={metadata.website} target="_blank" rel="noopener noreferrer">
            Guidelines
          </a>
        )}
      </p>
    </>
  );
};

export const TagName = () => {
  const metadata = getComponentData();

  if (!metadata?.tagname || metadata.tagname.trim() === "") {
    return null;
  }

  return (
    <>
      <code
        style={{
          fontSize: "13px",
          padding: "0.25rem",
          border: "1px solid rgb(236, 242, 249)",
          backgroundColor: "rgb(246, 249, 252)",
          color: "#2e3338",
          borderRadius: "3px",
        }}
      >
        &lt;{metadata.tagname}&gt;
      </code>
    </>
  );
};
