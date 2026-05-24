import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { palettes } from "../../utils/palettes";

// Import custom element definitions
import "./qgds-footer";
import "../qgds-link/qgds-link";

// Import types for controls and API tables
import type { QGDSFooter } from "./qgds-footer";

const { args, argTypes, template } = getStorybookHelpers<QGDSFooter>("qgds-footer");
type QGDSFooterStoryArgs = typeof args;

const meta: Meta<QGDSFooterStoryArgs> = {
  title: "Components/Footer",
  component: "qgds-footer",
  tags: ["autodocs"],
  args: {
    ...args,
    "contact-heading": "Contact us",
    "social-heading": "Follow us",
    "aoc-heading": "Acknowledgement of Country",
    "copyright-label": "© The State of Queensland (Organisation) 2026",
    "heading-level": 2,
    palette: "default",
    "hide-site-social-divider": false,
  },
  argTypes: {
    ...argTypes,
    palette: {
      control: { type: "select" },
      options: Object.keys(palettes),
    },
    "hide-site-social-divider": {
      control: { type: "boolean" },
      description: "Hide the border between site links and social columns",
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
    "copyright-label": "© The State of Queensland (Organisation) 2026",
    palette: "bold",
  },
  render: (storyArgs) =>
    template(
      storyArgs,
      html`
        <!-- Contact Links -->
        <qgds-link
          slot="contact-link"
          icon-name="phone"
          href="https://www.qld.gov.au/contact-us"
          label="Phone: 13 QGOV (13 74 68)"
        ></qgds-link>

        <qgds-link
          slot="contact-link"
          icon-name="facebook"
          href="https://www.facebook.com/QueenslandGovernment"
          label="/QueenslandGovernment"
          aria-label="Visit Queensland Government Facebook page"
        ></qgds-link>

        <!-- Custom Links -->
        <qgds-link slot="footer-custom-link" href="https://www.qld.gov.au/about" label="About Queensland"></qgds-link>
        <qgds-link
          slot="footer-custom-link"
          href="https://www.qld.gov.au/about/how-government-works"
          label="How government works"
        ></qgds-link>
        <qgds-link
          slot="footer-custom-link"
          href="https://www.qld.gov.au/about/contact-government"
          label="Contact government"
        ></qgds-link>

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
          label="Facebook page"
        ></qgds-link>
        <qgds-link
          slot="footer-social-link"
          href="https://www.linkedin.com/company/queensland-government"
          icon-name="linkedin"
          label="LinkedIn page"
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

        <!-- Logo -->
        <img
          slot="footer-logo"
          src="https://www.qld.gov.au/__data/assets/image/0026/152474/qg-logo.svg"
          alt="Queensland Government"
        />

        <!-- Main Government Link -->
        <qgds-link slot="site-main-link" href="https://www.qld.gov.au/" label="Queensland Government"></qgds-link>
      `
    ),
};

export const Minimal: Story = {
  args: {
    "contact-heading": "Contact us",
    "contact-statement": "Get in touch for enquiries, feedback, complaints and compliments.",
    "aoc-heading": "Acknowledgement of Country",
    "copyright-label": "© The State of Queensland (Organisation) 2026",
    palette: "default",
  },

  render: (storyArgs) =>
    template(
      storyArgs,
      html`
        <!-- Contact Links -->
        <qgds-link
          slot="contact-link"
          icon-name="phone"
          href="https://www.qld.gov.au/contact-us"
          label="Phone: 13 QGOV (13 74 68)"
        ></qgds-link>

        <qgds-link
          slot="contact-link"
          icon-name="facebook"
          href="https://www.facebook.com/QueenslandGovernment"
          label="/QueenslandGovernment"
          aria-label="Visit Queensland Government Facebook page"
        ></qgds-link>

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
