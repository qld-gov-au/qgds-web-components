import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import type { QGDSLogo } from "./qgds-logo";

import "./qgds-logo";
import { chromaticModes } from "../../../.storybook/modes";

const { args, argTypes } = getStorybookHelpers<QGDSLogo>("qgds-logo");
type Args = typeof args;

import sampleSlottedImage from "./assets/breast-screen-qld-logo.svg";

const meta: Meta<Args> = {
  title: "Components/Site Logo",
  component: "qgds-logo",
  tags: ["autodocs"],
  args: {
    ...args,
    logo: undefined,
    alt: "Queensland Government logo",
    href: "https://www.qld.gov.au",
  },
  argTypes: {
    ...argTypes,
    logo: {
      control: { type: "select" },
      options: ["none", "coa-stacked", "coa-delivering-for-qld"],
      mapping: {
        none: "",
        "coa-stacked": "coa-stacked",
        "coa-delivering-for-qld": "coa-delivering-for-qld",
      },
    },
  },
  render: (args) => html`
    <qgds-logo
      id="${ifDefined(args.id)}"
      variant="${ifDefined(args.variant)}"
      logo=${ifDefined(args.logo ?? undefined)}
      alt=${ifDefined(args.alt)}
      href=${ifDefined(args.href)}
      custom-logo=${ifDefined(args["custom-logo"] ?? undefined)}
      custom-logo-alt=${ifDefined(args["custom-logo-alt"] ?? undefined)}
    >
    </qgds-logo>
  `,

  parameters: {
    ...chromaticModes,
  },

  decorators: [(story) => html`<div palette="default">${story()}</div>`],
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    ...meta.args,
    logo: "coa-delivering-for-qld",
  },
  parameters: {
    ...chromaticModes,
  },
};

export const AllVariantsStatic: Story = {
  name: "All Variants",
  render: () => html`
    <!-- Delivering lockup (Masterbrand only) -->
    <qgds-logo
      logo="coa-delivering-for-qld"
      href="https://www.qld.gov.au"
      alt="Queensland Government delivering for Queensland logo"
    ></qgds-logo>

    <!-- Stacked Coat of Arms (Masterbrand, Subbrand) -->
    <qgds-logo
      logo="coa-stacked"
      href="https://www.qld.gov.au"
      alt="Queensland Government stacked COA logo"
    ></qgds-logo>

    <!-- Co-branded logos (Cobrand with partner) -->
    <qgds-logo
      logo="coa-stacked"
      custom-logo="${sampleSlottedImage}"
      custom-logo-alt="Partner Organisation"
      href="https://www.breastscreen.qld.gov.au"
      alt="Queensland Government co-brand with partner. COA stacked paired with a custom logo"
    ></qgds-logo>

    <!-- Custom Logos (Endorsed, Standalone) -->
    <qgds-logo logo="none" custom-logo="${sampleSlottedImage}" custom-logo-alt="Agency Name"></qgds-logo>
  `,
  decorators: [
    (Story) => html` <div style="padding: 1rem; display: flex; flex-direction: column; gap: 2rem;">${Story()}</div> `,
  ],
};
