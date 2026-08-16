import type { Meta, StoryObj } from "@storybook/web-components";
import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { action } from "storybook/actions";
import { chromaticModes } from "../../../../.storybook/modes";
import { withEventActions } from "../../../../.storybook/storybook-helpers";
import type { QGDSHeader } from "../qgds-header";
import type { QGDSNavigation } from "../../qgds-navigation/qgds-navigation";
import type { QGDSAttributionBar } from "../../qgds-attribution-bar/qgds-attribution-bar";
import "../qgds-header";
import "../../qgds-attribution-bar/qgds-attribution-bar";
import "../../qgds-link/qgds-link";
import "../../qgds-logo/qgds-logo";
import "../../qgds-search-input/qgds-search-input";
import "../../qgds-navigation/qgds-navigation";
import "../../qgds-navigation/qgds-navigation-item";

import sampleSlottedImage from "../../qgds-logo/assets/breast-screen-qld-logo.svg";
import sampleSlottedImageHealthOmb from "../../qgds-logo/assets/office-health-ombudsman-logo.svg";

const { args: _args, argTypes, template } = getStorybookHelpers<QGDSHeader>("qgds-header");
const { args: navArgs, template: navTemplate } = getStorybookHelpers<QGDSNavigation>("qgds-navigation");
const { args: attributionArgs, template: attributionTemplate } =
  getStorybookHelpers<QGDSAttributionBar>("qgds-attribution-bar");

type Args = typeof _args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Header/Brand",
  component: "qgds-header",
  argTypes,
  parameters: {
    controls: {
      exclude: ["search-open"],
    },
  },
  render: (args) => template(args),
};

export default meta;

// The mobile buttons only fire payload-less events; the slotted components own what
// happens next. Search has no mobile design yet, so it just logs to the Actions
// panel. Menu toggles the demo nav's `open` attribute, standing in for a real
// mega-menu component that would manage its own open state.
const logSearchToggle = action("qgds-toggle-search-mobile");
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const onSearchToggle = () => logSearchToggle();

const storyStyles = html`
  <style>
    .story-heading {
      margin-block-end: 2rem;
    }

    .story-heading strong {
      font-size: 1.25rem;
      font-weight: var(--qgds-font-weight-bold, 700);
    }
  </style>
`;

const headerTemplate = (args: Args, children: TemplateResult) => html`
  <qgds-header
    palette=${ifDefined(args.palette ?? undefined)}
    site-name=${ifDefined(args["site-name"] ?? undefined)}
    site-url=${ifDefined(args["site-url"] ?? undefined)}
    mobile-top-content=${ifDefined(args["mobile-top-content"] ?? undefined)}
    ?hide-coa-logo=${args["hide-coa-logo"]}
    ?hide-mobile-bottom-row=${args["hide-mobile-bottom-row"]}
    @qgds-toggle-search-mobile=${onSearchToggle}
  >
    ${children}
  </qgds-header>
`;

const navItems = html`
  <qgds-navigation-item label="Home" href="#" icon-name="home" only-icon is-current></qgds-navigation-item>
  <qgds-navigation-item label="Services" href="#services"></qgds-navigation-item>
  <qgds-navigation-item label="About" href="#about"></qgds-navigation-item>
  <qgds-navigation-item label="Contact us" href="#contact" slot="mobile-cta" icon-name="phone"></qgds-navigation-item>
`;

const attributionLinks = html`
  <qgds-link icon-name="phone" href="https://www.qld.gov.au/contact-us" label="Contact us"></qgds-link>
`;

const eventActionDecorator = [
  withEventActions([
    "qgds-navigation-open",
    "qgds-navigation-opened",
    "qgds-navigation-close",
    "qgds-navigation-closed",
  ]),
];

export const CoatOfArms: Story = {
  args: meta.args,
  render: (args) =>
    headerTemplate(
      args,
      html`${attributionTemplate(
          {
            ...attributionArgs,
            slot: "pre-header",
            palette: "bold",
            url: "https://www.qld.gov.au",
            label: "qld.gov.au",
          },
          attributionLinks
        )}
        <qgds-search-input slot="search"></qgds-search-input>
        ${navTemplate(
          {
            ...navArgs,
            slot: "navigation",
            id: "mynav",
          },
          navItems
        )}`
    ),
  decorators: [
    ...eventActionDecorator,
    (story) =>
      html`${storyStyles}
        <div class="story-heading">
          <p><strong>Master brand</strong></p>
          <p>This style only for qld.gov.au</p>
        </div>
        ${story()}`,
  ],
  parameters: {
    ...chromaticModes,
  },
};

export const CoatOfArmsAndSiteName: Story = {
  args: {
    ...meta.args,
    "site-name": "Site name",
  },
  render: (args) =>
    headerTemplate(
      args,
      html`${attributionTemplate(
          {
            ...attributionArgs,
            slot: "pre-header",
            palette: "bold",
            url: "https://www.qld.gov.au",
            label: "qld.gov.au",
          },
          attributionLinks
        )}
        <qgds-logo slot="logo" logo="coa-stacked" alt="Queensland Government"></qgds-logo>
        <qgds-search-input slot="search"></qgds-search-input>
        ${navTemplate(
          {
            ...navArgs,
            slot: "navigation",
            id: "mynav",
          },
          navItems
        )}`
    ),
  decorators: [
    ...eventActionDecorator,
    (story) =>
      html`${storyStyles}
        <div class="story-heading">
          <p><strong>Master brand, Sub-Brand, Co-Brand, and Endorsed</strong></p>
          <p>Coat of Arms and Site Name</p>
        </div>
        ${story()}`,
  ],
};

export const CoatOfArmsAndBrandLogo: Story = {
  args: meta.args,
  render: (args) =>
    headerTemplate(
      args,
      html`${attributionTemplate(
          {
            ...attributionArgs,
            slot: "pre-header",
            palette: "bold",
            url: "https://www.qld.gov.au",
            label: "qld.gov.au",
          },
          attributionLinks
        )}
        <qgds-logo slot="logo" logo="coa-stacked" alt="Queensland Government"></qgds-logo>
        <qgds-logo
          slot="brand-logo"
          logo=""
          custom-logo="${sampleSlottedImage}"
          custom-logo-alt="Partner Organisation"
        ></qgds-logo>

        <qgds-search-input slot="search"></qgds-search-input>
        ${navTemplate(
          {
            ...navArgs,
            slot: "navigation",
            id: "mynav",
          },
          navItems
        )}`
    ),
  decorators: [
    ...eventActionDecorator,
    (story) =>
      html`${storyStyles}
        <style>
          qgds-logo {
            @media (min-width: 992px) {
              --qgds-color-crest-fill: #000;
            }
          }
        </style>
        <div class="story-heading">
          <p><strong>Co-Brand and Endorsed</strong></p>
          <p>Coat of Arms and Logo</p>
        </div>
        ${story()}`,
  ],
};

export const BrandLogoTwoMobileRows: Story = {
  args: {
    ...meta.args,
    "hide-coa-logo": true,
    "mobile-top-content": "site-name",
    "site-name": "Office of the Health Ombudsman",
  },
  render: (args) =>
    headerTemplate(
      args,
      html`${attributionTemplate(
          {
            ...attributionArgs,
            slot: "pre-header",
            palette: "bold",
            url: "https://oho.qld.gov.au",
            label: "oho.qld.gov.au",
          },
          attributionLinks
        )}
        <qgds-logo
          slot="brand-logo"
          logo=""
          custom-logo="${sampleSlottedImageHealthOmb}"
          custom-logo-alt="Partner Organisation"
        ></qgds-logo>

        <qgds-search-input slot="search"></qgds-search-input>${navTemplate(
          {
            ...navArgs,
            slot: "navigation",
            id: "mynav",
          },
          navItems
        )}`
    ),
  decorators: [
    ...eventActionDecorator,
    (story) =>
      html`${storyStyles}
        <div class="story-heading">
          <p><strong>Endorsed and Stand Alone</strong></p>
          <p>Brand Logo - No Coat of Arms</p>
          <p><strong>Mobile</strong> Top: Site Name - Bottom: Brand Logo</p>
        </div>
        ${story()}
        <div style="margin-top: 2rem">
          "hide-coa-logo": true, <br />
          "mobile-top-content": "site-name", <br />
          "site-name": "Office of the Health Ombudsman",
        </div>`,
  ],
};

export const BrandLogoMobileTopRowLogo: Story = {
  args: {
    ...meta.args,
    "hide-coa-logo": true,
    "mobile-top-content": "brand-logo",
    "hide-mobile-bottom-row": true,
  },
  render: (args) =>
    headerTemplate(
      args,
      html`${attributionTemplate(
          {
            ...attributionArgs,
            slot: "pre-header",
            palette: "bold",
            url: "https://oho.qld.gov.au",
            label: "oho.qld.gov.au",
          },
          attributionLinks
        )}
        <qgds-logo
          slot="brand-logo"
          logo=""
          custom-logo="${sampleSlottedImageHealthOmb}"
          custom-logo-alt="Partner Organisation"
        ></qgds-logo>
        <qgds-search-input slot="search"></qgds-search-input>${navTemplate(
          {
            ...navArgs,
            slot: "navigation",
            id: "mynav",
          },
          navItems
        )}`
    ),
  decorators: [
    ...eventActionDecorator,
    (story) =>
      html`${storyStyles}
        <div class="story-heading">
          <p><strong>Endorsed and Stand Alone</strong></p>
          <p>Brand Logo - No Coat of Arms</p>
          <p><strong>Mobile</strong> Top: Brand logo</p>
        </div>
        ${story()}
        <div style="margin-top: 2rem">
          "hide-coa-logo": true, <br />
          "mobile-top-content": "brand-logo", <br />
          "hide-mobile-bottom-row": true,
        </div>`,
  ],
};

export const BrandLogoMobileTopRowSiteName: Story = {
  args: {
    ...meta.args,
    "hide-coa-logo": true,
    "mobile-top-content": "site-name",
    "hide-mobile-bottom-row": true,
    "site-name": "Office of the Health Ombudsman",
  },
  render: (args) =>
    headerTemplate(
      args,
      html`${attributionTemplate(
          {
            ...attributionArgs,
            slot: "pre-header",
            palette: "bold",
            url: "https://oho.qld.gov.au",
            label: "oho.qld.gov.au",
          },
          attributionLinks
        )}
        <qgds-logo
          slot="brand-logo"
          logo=""
          custom-logo="${sampleSlottedImageHealthOmb}"
          custom-logo-alt="Partner Organisation"
        ></qgds-logo>

        <qgds-search-input slot="search"></qgds-search-input>${navTemplate(
          {
            ...navArgs,
            slot: "navigation",
            id: "mynav",
          },
          navItems
        )}`
    ),
  decorators: [
    ...eventActionDecorator,
    (story) =>
      html`${storyStyles}
        <div class="story-heading">
          <p><strong>Endorsed and Stand Alone</strong></p>
          <p>Brand Logo only - No Coat of Arms</p>
          <p><strong>Mobile</strong> Top: Site Name</p>
        </div>
        ${story()}
        <div style="margin-top: 2rem">
          "hide-coa-logo": true, <br />
          "mobile-top-content": "site-name", <br />
          "hide-mobile-bottom-row": true, <br />
          "site-name": "Office of the Health Ombudsman",
        </div>`,
  ],
};

export const BrandLogoWtSiteName: Story = {
  args: {
    ...meta.args,
    "hide-coa-logo": true,
    "mobile-top-content": "brand-logo",
    "site-name": "Site Name",
  },
  render: (args) =>
    headerTemplate(
      args,
      html`${attributionTemplate(
          {
            ...attributionArgs,
            slot: "pre-header",
            palette: "bold",
            url: "https://oho.qld.gov.au",
            label: "oho.qld.gov.au",
          },
          attributionLinks
        )}
        <qgds-logo
          slot="brand-logo"
          logo=""
          custom-logo="${sampleSlottedImageHealthOmb}"
          custom-logo-alt="Partner Organisation"
        ></qgds-logo>
        <qgds-search-input slot="search"></qgds-search-input>${navTemplate(
          {
            ...navArgs,
            slot: "navigation",
            id: "mynav",
          },
          navItems
        )}`
    ),
  decorators: [
    ...eventActionDecorator,
    (story) =>
      html`${storyStyles}
        <div class="story-heading">
          <p><strong>Endorsed and Stand Alone</strong></p>
          <p>Brand Logo with Site Name - No Coat of Arms</p>
          <p><strong>Mobile</strong> Top: Brand Logo</p>
        </div>
        ${story()}
        <div style="margin-top: 2rem">
          "mobile-top-content": "brand-logo",<br />
          "site-name": "Site Name for Desktop",
        </div>`,
  ],
};

export const BrandNameTwoMobileRows: Story = {
  args: {
    ...meta.args,
    "hide-coa-logo": true,
    "mobile-top-content": "preheader-url",
    "site-name": "Site name",
  },
  render: (args) =>
    headerTemplate(
      args,
      html`${attributionTemplate(
          {
            ...attributionArgs,
            slot: "pre-header",
            palette: "bold",
            url: "https://oho.qld.gov.au",
            label: "oho.qld.gov.au",
          },
          attributionLinks
        )} <qgds-search-input slot="search"></qgds-search-input>${navTemplate(
          {
            ...navArgs,
            slot: "navigation",
            id: "mynav",
          },
          navItems
        )}`
    ),
  decorators: [
    ...eventActionDecorator,
    (story) =>
      html`${storyStyles}
        <div class="story-heading">
          <p><strong>Endorsed and Stand Alone</strong></p>
          <p>Brand Name only - No Coat of Arms</p>
          <p><strong>Mobile</strong> Top: Site Name</p>
        </div>
        ${story()}
        <div style="margin-top: 2rem">
          "hide-coa-logo": true, <br />
          "mobile-top-content": "preheader-url", <br />
          "site-name": "Site name", <br />
        </div>`,
  ],
};

export const BrandNameMobileTopRowSiteName: Story = {
  args: {
    ...meta.args,
    "hide-coa-logo": true,
    "mobile-top-content": "site-name",
    "hide-mobile-bottom-row": true,
    "site-name": "Site name",
  },
  render: (args) =>
    headerTemplate(
      args,
      html`${attributionTemplate(
          {
            ...attributionArgs,
            slot: "pre-header",
            palette: "bold",
            url: "https://oho.qld.gov.au",
            label: "oho.qld.gov.au",
          },
          attributionLinks
        )} <qgds-search-input slot="search"></qgds-search-input>${navTemplate(
          {
            ...navArgs,
            slot: "navigation",
            id: "mynav",
          },
          navItems
        )}`
    ),
  decorators: [
    ...eventActionDecorator,
    (story) =>
      html`${storyStyles}
        <div class="story-heading">
          <p><strong>Endorsed and Stand Alone</strong></p>
          <p>Brand Name - No Coat of Arms</p>
          <p><strong>Mobile</strong> Top: Brand Name</p>
        </div>
        ${story()}
        <div style="margin-top: 2rem">
          "hide-coa-logo": true, <br />
          "mobile-top-content": "site-name",<br />
          "hide-mobile-bottom-row": true,<br />
          "site-name": "Site name",<br />
        </div>`,
  ],
};

export const BrandNameMobileTopRowUrl: Story = {
  args: {
    ...meta.args,
    "hide-coa-logo": true,
    "mobile-top-content": "preheader-url",
    "hide-mobile-bottom-row": true,
    "site-name": "Site name",
  },
  render: (args) =>
    headerTemplate(
      args,
      html`${attributionTemplate(
          {
            ...attributionArgs,
            slot: "pre-header",
            palette: "bold",
            url: "https://oho.qld.gov.au",
            label: "oho.qld.gov.au",
          },
          attributionLinks
        )} <qgds-search-input slot="search"></qgds-search-input>${navTemplate(
          {
            ...navArgs,
            slot: "navigation",
            id: "mynav",
          },
          navItems
        )}`
    ),
  decorators: [
    ...eventActionDecorator,
    (story) =>
      html`${storyStyles}
        <div class="story-heading">
          <p><strong>Endorsed and Stand Alone</strong></p>
          <p>Brand Name - No Coat of Arms</p>
          <p><strong>Mobile</strong> Top: Site Name</p>
        </div>
        ${story()}
        <div style="margin-top: 2rem">
          "hide-coa-logo": true, <br />
          "mobile-top-content": "preheader-url",<br />
          "hide-mobile-bottom-row": true,<br />
          "site-name": "Site name",
        </div>`,
  ],
};
