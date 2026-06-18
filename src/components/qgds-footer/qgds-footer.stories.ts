import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { palettes } from "../../utils/palettes";
import { chromaticModes, allModes } from "../../../.storybook/modes"; //allModes

// Import custom element definitions
import "./qgds-footer";
import "./qgds-footer-contact-item";
import "../qgds-link/qgds-link";

// Import types for controls and API tables
import type { QGDSFooter } from "./qgds-footer";

const { args, argTypes, template } = getStorybookHelpers<QGDSFooter>("qgds-footer");
type QGDSFooterStoryArgs = typeof args;

const meta: Meta<QGDSFooterStoryArgs> = {
  title: "Components/Footer",
  component: "qgds-footer",
  tags: ["autodocs"],
  subcomponents: {
    "Contact Item": "qgds-footer-contact-item",
  },
  args: {
    ...args,
    "contact-heading": "Contact us",
    "social-heading": "Follow us",
    "aoc-heading": "Acknowledgement of Country",
    "copyright-label": "© The State of Queensland 2026",
    "heading-level": 2,
    "contact-statement": "Get in touch for enquiries, feedback, complaints and compliments.",
    palette: "default",
  },
  argTypes: {
    ...argTypes,
    palette: {
      control: { type: "select" },
      options: Object.keys(palettes),
    },
  },
};

export default meta;
type Story = StoryObj<QGDSFooterStoryArgs>;

export const Default: Story = {
  args: {
    "contact-heading": "Contact us",
    "contact-statement": "Get in touch for enquiries, feedback, complaints and compliments.",
    "custom-links-heading": "About us",
    "social-heading": "Follow us",
    "aoc-heading": "Acknowledgement of Country",
    "copyright-label": "© The State of Queensland 2026",
    palette: "bold",
  },
  render: (storyArgs) =>
    template(
      storyArgs,
      html`
        <!-- Contact Links -->
        <qgds-footer-contact-item
          icon-id="phone"
          label="Phone"
          href="tel:137468"
          value="13 QGOV (13 74 68)"
        ></qgds-footer-contact-item>
        <qgds-footer-contact-item
          icon-id="email"
          label="Email"
          href="mailto:email@qld.gov.au"
          value="email@qld.gov.au"
        ></qgds-footer-contact-item>
        <qgds-footer-contact-item
          icon-id="facebook"
          href="https://www.facebook.com/QueenslandGovernment"
          value="/QueenslandGovernment"
        ></qgds-footer-contact-item>

        <!-- Contact Buttons via contact-cta slot -->
        <qgds-button
          href="https://qld.gov.au/contact"
          slot="contact-cta"
          label="Contact us"
          variant="secondary"
          target="_blank"
        ></qgds-button>

        <!-- Site Links -->
        <qgds-link slot="footer-site-link" href="https://www.qld.gov.au/help" label="Help"></qgds-link>
        <qgds-link slot="footer-site-link" href="https://www.qld.gov.au/legal/copyright" label="Copyright"></qgds-link>
        <qgds-link
          slot="footer-site-link"
          href="https://www.qld.gov.au/legal/disclaimer"
          label="Disclaimer"
        ></qgds-link>
        <qgds-link slot="footer-site-link" href="https://www.qld.gov.au/legal/privacy" label="Privacy"></qgds-link>
        <qgds-link
          slot="footer-site-link"
          href="https://www.qld.gov.au/about/rights-accountability/right-to-information"
          label="Right to information"
        ></qgds-link>
        <qgds-link
          slot="footer-site-link"
          href="https://www.qld.gov.au/help/accessibility"
          label="Accessibility"
        ></qgds-link>
        <qgds-link
          slot="footer-site-link"
          href="https://smartjobs.qld.gov.au/"
          label="Jobs in Queensland Government"
        ></qgds-link>
        <qgds-link
          slot="footer-site-link"
          href="https://www.qld.gov.au/help/languages"
          label="Other languages"
        ></qgds-link>

        <!-- Social Links -->
        <qgds-link
          slot="footer-social-link"
          href="https://www.facebook.com/QueenslandGovernment"
          icon-name="facebook"
          label="Facebook"
        ></qgds-link>
        <qgds-link
          slot="footer-social-link"
          href="https://www.linkedin.com/company/queensland-government"
          icon-name="linkedin"
          label="LinkedIn"
        ></qgds-link>
        <qgds-link slot="footer-social-link" href="https://twitter.com/qldgov" icon-name="x" label="X page"></qgds-link>
        <qgds-link
          slot="footer-social-link"
          href="https://www.youtube.com/user/QueenslandGovt"
          icon-name="youtube"
          label="Youtube"
        ></qgds-link>
        <qgds-link
          slot="footer-social-link"
          href="https://www.instagram.com/Queensland/"
          icon-name="instagram"
          label="Instagram"
        ></qgds-link>

        <!-- Acknowledgement of Country -->
        <div slot="aoc">
          <p>
            We pay our respects to the Aboriginal and Torres Strait Islander ancestors of this land, their spirits and
            their legacy. The foundations laid by these ancestors &mdash; our First Nations peoples &mdash; give
            strength, inspiration and courage to current and future generations towards creating a better Queensland.
          </p>
        </div>

        <!-- Main Government Link -->
        <qgds-link slot="site-main-link" href="https://www.qld.gov.au/" label="Queensland Government"></qgds-link>
      `
    ),

  parameters: {
    ...chromaticModes,
    allModes,
  },

  decorators: [
    (Story, context) => html`
      <div style="margin-inline: -2rem; margin-block-start: 2rem;" palette=${ifDefined(context.args.palette)}>
        <div style="margin-inline: auto">${Story()}</div>
      </div>
    `,
  ],
};

export const Minimal: Story = {
  args: {
    "contact-heading": "Contact us",
    "contact-statement": "Get in touch for enquiries, feedback, complaints and compliments.",
    "aoc-heading": "Acknowledgement of Country",
    "copyright-label": "© The State of Queensland 2026",
    palette: "default",
  },

  render: (storyArgs) =>
    template(
      storyArgs,
      html`
        <!-- Contact Links -->
        <qgds-footer-contact-item
          icon-id="phone"
          label="Phone"
          href="tel:137468"
          value="13 QGOV (13 74 68)"
        ></qgds-footer-contact-item>
        <qgds-footer-contact-item
          icon-id="email"
          label="Email"
          href="mailto:email@qld.gov.au"
          value="email@qld.gov.au"
        ></qgds-footer-contact-item>
        <qgds-footer-contact-item
          icon-id="facebook"
          href="https://www.facebook.com/QueenslandGovernment"
          value="/QueenslandGovernment"
        ></qgds-footer-contact-item>

        <!-- Site Links -->
        <qgds-link slot="footer-site-link" href="https://www.qld.gov.au/help" label="Help"></qgds-link>
        <qgds-link slot="footer-site-link" href="https://www.qld.gov.au/legal/copyright" label="Copyright"></qgds-link>
        <qgds-link
          slot="footer-site-link"
          href="https://www.qld.gov.au/legal/disclaimer"
          label="Disclaimer"
        ></qgds-link>
        <qgds-link slot="footer-site-link" href="https://www.qld.gov.au/legal/privacy" label="Privacy"></qgds-link>
        <qgds-link
          slot="footer-site-link"
          href="https://www.qld.gov.au/about/rights-accountability/right-to-information"
          label="Right to information"
        ></qgds-link>
        <qgds-link
          slot="footer-site-link"
          href="https://www.qld.gov.au/help/accessibility"
          label="Accessibility"
        ></qgds-link>
        <qgds-link
          slot="footer-site-link"
          href="https://smartjobs.qld.gov.au/"
          label="Jobs in Queensland Government"
        ></qgds-link>
        <qgds-link
          slot="footer-site-link"
          href="https://www.qld.gov.au/help/languages"
          label="Other languages"
        ></qgds-link>

        <!-- Acknowledgement of Country -->
        <div slot="aoc">
          <p>
            We pay our respects to the Aboriginal and Torres Strait Islander ancestors of this land, their spirits and
            their legacy. The foundations laid by these ancestors &mdash; our First Nations peoples &mdash; give
            strength, inspiration and courage to current and future generations towards creating a better Queensland.
          </p>
        </div>

        <!-- Main Government Link -->
        <qgds-link slot="site-main-link" href="https://www.qld.gov.au/" label="Queensland Government"></qgds-link>
      `
    ),
};

export const WithCustomLinks: Story = {
  args: {
    "contact-heading": "Contact us",
    "contact-statement": "Get in touch for enquiries, feedback, complaints and compliments.",
    "aoc-heading": "Acknowledgement of Country",
    "copyright-label": "© The State of Queensland 2026",
    palette: "deep",
  },

  render: (storyArgs) =>
    template(
      storyArgs,
      html`
        <!-- Contact Links -->
        <qgds-footer-contact-item
          icon-id="phone"
          label="Phone"
          href="tel:137468"
          value="13 QGOV (13 74 68)"
        ></qgds-footer-contact-item>
        <qgds-footer-contact-item
          icon-id="email"
          label="Email"
          href="mailto:email@qld.gov.au"
          value="email@qld.gov.au"
        ></qgds-footer-contact-item>
        <qgds-footer-contact-item
          icon-id="facebook"
          label="Facebook"
          href="https://www.facebook.com/QueenslandGovernment"
          value="/QueenslandGovernment"
        ></qgds-footer-contact-item>

        <!-- Custom Links -->
        <qgds-link slot="footer-custom-link" href="/link-1" label="Custom Link 1"></qgds-link>
        <qgds-link slot="footer-custom-link" href="/link-2" label="Custom Link 2"></qgds-link>
        <qgds-link slot="footer-custom-link" href="/link-3" label="Custom Link 3"></qgds-link>
        <qgds-link slot="footer-custom-link" href="/link-4" label="Custom Link 4"></qgds-link>
        <qgds-link slot="footer-custom-link" href="/link-5" label="Custom Link 5"></qgds-link>

        <!-- Site Links -->
        <qgds-link slot="footer-site-link" href="https://www.qld.gov.au/help" label="Help"></qgds-link>
        <qgds-link slot="footer-site-link" href="https://www.qld.gov.au/legal/copyright" label="Copyright"></qgds-link>
        <qgds-link
          slot="footer-site-link"
          href="https://www.qld.gov.au/legal/disclaimer"
          label="Disclaimer"
        ></qgds-link>
        <qgds-link slot="footer-site-link" href="https://www.qld.gov.au/legal/privacy" label="Privacy"></qgds-link>
        <qgds-link
          slot="footer-site-link"
          href="https://www.qld.gov.au/about/rights-accountability/right-to-information"
          label="Right to information"
        ></qgds-link>
        <qgds-link
          slot="footer-site-link"
          href="https://www.qld.gov.au/help/accessibility"
          label="Accessibility"
        ></qgds-link>
        <qgds-link
          slot="footer-site-link"
          href="https://smartjobs.qld.gov.au/"
          label="Jobs in Queensland Government"
        ></qgds-link>
        <qgds-link
          slot="footer-site-link"
          href="https://www.qld.gov.au/help/languages"
          label="Other languages"
        ></qgds-link>

        <!-- Social Links -->
        <qgds-link
          slot="footer-social-link"
          href="https://www.facebook.com/QueenslandGovernment"
          icon-name="facebook"
          label="Facebook"
        ></qgds-link>
        <qgds-link
          slot="footer-social-link"
          href="https://www.linkedin.com/company/queensland-government"
          icon-name="linkedin"
          label="LinkedIn"
        ></qgds-link>
        <qgds-link slot="footer-social-link" href="https://twitter.com/qldgov" icon-name="x" label="X page"></qgds-link>
        <qgds-link
          slot="footer-social-link"
          href="https://www.youtube.com/user/QueenslandGovt"
          icon-name="youtube"
          label="Youtube"
        ></qgds-link>
        <qgds-link
          slot="footer-social-link"
          href="https://www.instagram.com/Queensland/"
          icon-name="instagram"
          label="Instagram"
        ></qgds-link>

        <!-- Contact Buttons via contact-cta slot -->
        <qgds-button slot="contact-cta" label="Contact us" variant="secondary"></qgds-button>

        <!-- Acknowledgement of Country -->
        <div slot="aoc">
          <p>
            We pay our respects to the Aboriginal and Torres Strait Islander ancestors of this land, their spirits and
            their legacy. The foundations laid by these ancestors &mdash; our First Nations peoples &mdash; give
            strength, inspiration and courage to current and future generations towards creating a better Queensland.
          </p>
        </div>

        <!-- Main Government Link -->
        <qgds-link slot="site-main-link" href="https://www.qld.gov.au/" label="Queensland Government"></qgds-link>
      `
    ),
};
