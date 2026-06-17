import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import type { QGDSLogo } from "./qgds-logo";

import "./qgds-logo";
import { chromaticModes } from "../../../.storybook/modes";

const { args, argTypes } = getStorybookHelpers<QGDSLogo>("qgds-logo", { setComponentVariable: true });
type Args = typeof args;

import sampleSlottedImage from "./assets/breast-screen-qld-logo.svg";

const meta: Meta<Args> = {
  title: "Components/Logo",
  component: "qgds-logo",
  tags: ["autodocs"],
  args: {
    ...args,
    logo: undefined,
    alt: "Queensland Government logo",
    href: "https://www.qld.gov.au",
    "site-name": "Queensland Government",
    "hide-site-name": false,
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
      site-name-prefix=${ifDefined(args["site-name-prefix"] ?? undefined)}
      site-name=${ifDefined(args["site-name"] ?? undefined)}
      site-name-secondary=${ifDefined(args["site-name-secondary"] ?? undefined)}
      custom-logo=${ifDefined(args["custom-logo"] ?? undefined)}
      custom-logo-alt=${ifDefined(args["custom-logo-alt"] ?? undefined)}
      ?hide-site-name=${args["hide-site-name"]}
    >
    </qgds-logo>
  `,
};

export default meta;
type Story = StoryObj<Args>;

export const Masterbrand: Story = {
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
    <!-- Masterbrand - delivering lockup -->
    <qgds-logo
      variant="masterbrand"
      logo="coa-delivering-for-qld"
      site-name="qld.gov.au"
      href="https://www.qld.gov.au"
    ></qgds-logo>

    <!-- Masterbrand - stacked COA -->
    <qgds-logo
      variant="masterbrand"
      logo="coa-stacked"
      site-name="Smart jobs"
      href="https://www.qld.gov.au"
    ></qgds-logo>

    <!-- Subbrand -->
    <qgds-logo
      variant="subbrand"
      logo="coa-stacked"
      site-name-prefix="Department of"
      site-name="Local Government, Water and Volunteers"
      href="https://www.dlgwv.qld.gov.au"
    ></qgds-logo>

    <!-- Cobrand with name style -->
    <qgds-logo
      variant="cobrand"
      logo="coa-stacked"
      site-name="Co-brand with name style"
      style="--site-name-color: Chocolate; --divider-color: MediumVioletRed;"
      href="https://www.qld.gov.au"
    ></qgds-logo>

    <!-- Cobrand with partner -->
    <qgds-logo
      variant="cobrand"
      logo="coa-stacked"
      site-name="Co-brand with partner logo"
      hide-site-name
      custom-logo="${sampleSlottedImage}"
      custom-logo-alt="Partner Organisation"
      href="https://www.breastscreen.qld.gov.au"
    ></qgds-logo>

    <!-- Cobrand with name style -->
    <qgds-logo
      id="agency-brand"
      variant="cobrand"
      logo="coa-stacked"
      site-name="Name"
      site-name-secondary="Style"
    ></qgds-logo>
    <style>
      /* Customise parts of the the co-brand logo */
      #agency-brand {
        --logo-color: black;
        --divider-color: DarkRed;
        --site-name-main-color: Indigo;
        --site-name-secondary-color: DarkRed;
      }

      /* or target parts directly with ::part */
      #agency-brand::part(site-name-main) {
        --site-name-main-color: Indigo;
        font-weight: 700;
      }
      #agency-brand::part(site-name-secondary) {
        --site-name-secondary-color: DarkRed;
        font-weight: 400;
      }
    </style>

    <!-- Endorsed -->
    <qgds-logo
      variant="endorsed"
      custom-logo="${sampleSlottedImage}"
      custom-logo-alt="Agency Name"
      site-name="Department of Health"
    ></qgds-logo>

    <!-- Masterbrand (solo) -->
    <qgds-logo variant="masterbrand" logo="coa-stacked" hide-site-name></qgds-logo>
  `,
  decorators: [
    (Story) => html` <div style="padding: 1rem; display: flex; flex-direction: column; gap: 2rem;">${Story()}</div> `,
  ],
};

export const Subbrand: Story = {
  args: {
    ...meta.args,
    variant: "subbrand",
    logo: "coa-stacked",
    "site-name": "Department of Women, Aboriginal and Torres Strait Islander Partnerships and Multiculturalism",
  },
  parameters: {
    ...chromaticModes,
  },
};

export const SubbrandPrefix: Story = {
  name: "Subbrand (prefix)",
  args: {
    ...meta.args,
    variant: "subbrand",
    logo: "coa-stacked",
    "site-name-prefix": "Department of",
    "site-name": "Women, Aboriginal and Torres Strait Islander Partnerships and Multiculturalism",
  },
  parameters: {
    ...chromaticModes,
  },
};

export const Cobrand: Story = {
  args: {
    ...meta.args,
    variant: "cobrand",
    logo: "coa-stacked",
    "site-name": "BreastScreen Queensland",
    "hide-site-name": true,
    "custom-logo": sampleSlottedImage,
    "custom-logo-alt": "BreastScreen Queensland logo",
  },
  decorators: [
    (Story) => html`
      <style>
        qgds-logo {
          --logo-color: black;
          --divider-color: Indigo;
        }
      </style>
      ${Story()}
    `,
  ],
};

export const Endorsed: Story = {
  args: {
    ...meta.args,
    variant: "endorsed",
    logo: "coa-stacked",
    "site-name": "Vaccination Matters",
  },
  decorators: [
    (Story) => html`
      <style>
        qgds-logo {
          --site-name-main-color: #00248e;
          --logo-color: #131212;
          --divider-color: DarkOrange;
        }
      </style>
      ${Story()}
    `,
  ],
};

export const Standalone: Story = {
  args: {
    ...meta.args,
    variant: "standalone",
    "custom-logo": sampleSlottedImage,
    "custom-logo-alt": "Vaccination Matters logo",
    "site-name": "Standalone logo with site name hidden",
    "hide-site-name": true,
  },
};
