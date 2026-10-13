import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

// Register all components used by the template.
import "../index";

import sourceContentPage from "./content-page.html?raw";
import sourceLandingPage from "./landing-page.html?raw";
import sourceFormPage from "./form-page.html?raw";

const extractTemplateBodyHtml = (templateSource: string): string => {
  const bodyMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(templateSource);
  return (bodyMatch?.[1] ?? templateSource).trim();
};

const meta: Meta = {
  title: "Templates/Examples",
  component: "qgds-template-content-page",
  //Negate a global decorator with 2rem padding in preview.js
  decorators: [(Story) => html`<div style="margin: -2rem">${Story()}</div>`],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Renders src/templates/content-page.html as a Storybook mockup source.",
      },
      source: {
        code: sourceContentPage,
        language: "html",
      },
    },
  },
  render: () =>
    html`<div class="qgds-template-content-page">${unsafeHTML(extractTemplateBodyHtml(sourceContentPage))}</div>`,
};

export default meta;

export const Default: StoryObj = {
  name: "Content Page",
};

export const SimpleFormPage: StoryObj = {
  parameters: {
    docs: {
      source: {
        code: sourceFormPage,
        language: "html",
      },
    },
  },
  render: () => html`<div class="qgds-template-form-page">${unsafeHTML(extractTemplateBodyHtml(sourceFormPage))}</div>`,
};

export const LandingPage: StoryObj = {
  parameters: {
    docs: {
      source: {
        code: sourceLandingPage,
        language: "html",
      },
    },
  },
  render: () =>
    html`<div class="qgds-template-landing-page">${unsafeHTML(extractTemplateBodyHtml(sourceLandingPage))}</div>`,
};
