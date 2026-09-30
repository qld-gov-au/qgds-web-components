import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

// Register all components used by the template.
import "../index";

// WIPs
import categoryPage from "./wayfinder-category.html?raw";
import serviceSummaryPage from "./service-summary.html?raw";

const extractTemplateBodyHtml = (templateSource: string): string => {
  const bodyMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(templateSource);
  return (bodyMatch?.[1] ?? templateSource).trim();
};

const meta: Meta = {
  title: "Templates/Prototypes",
  component: "qgds-template-content-page",
  //Negate a global decorator with 2rem padding in preview.js
  decorators: [(Story) => html`<div style="margin: -2rem">${Story()}</div>`],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const CategoryPage: StoryObj = {
  name: "Wayfinder - Category",
  parameters: {
    docs: {
      source: {
        code: categoryPage,
        language: "html",
      },
    },
  },
  render: () =>
    html`<div class="qgds-template-wayfinder-category">${unsafeHTML(extractTemplateBodyHtml(categoryPage))}</div>`,
};

export const ServiceSummaryPage: StoryObj = {
  name: "Service Summary",
  parameters: {
    docs: {
      source: {
        code: serviceSummaryPage,
        language: "html",
      },
    },
  },
  render: () =>
    html`<div class="qgds-template-service-summary">${unsafeHTML(extractTemplateBodyHtml(serviceSummaryPage))}</div>`,
};
