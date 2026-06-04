import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { palettes } from "../../utils/palettes";
import { chromaticModes, allModes } from "../../../.storybook/modes"; //allModes

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
    "copyright-label": "© The State of Queensland 2026",
    "heading-level": 2,
    "contact-statement": "Get in touch for enquiries, feedback, complaints and compliments.",
    "contact-phone": "13 QGOV (13 74 68)",
    "contact-email": "email@qld.gov.au",
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
        <span slot="contact-link" class="contact-info">
          <qgds-icon icon-id="phone"></qgds-icon>
          <span class="sr-only">Phone:</span> 13 QGOV (13 74 68)
        </span>

        <span slot="contact-link" class="contact-info">
          <qgds-icon icon-id="email"></qgds-icon>
          <span class="sr-only">Email:</span>email@qld.gov.au
        </span>

        <span slot="contact-link" class="contact-info">
          <qgds-icon icon-id="facebook"></qgds-icon>
          <a
            href="https://www.facebook.com/QueenslandGovernment"
            title="Visit Queensland Government Facebook page"
            target="_blank"
            rel="noopener noreferrer"
            ><span class="sr-only">Facebook:</span>/QueenslandGovernment</a
          >
        </span>

        <!-- Contact Buttons via contact-cta slot -->
        <qgds-button slot="contact-cta" label="Contact us" variant="secondary"></qgds-button>

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
      <div style="margin-inline: -2rem; margin-block-start: 2rem;" palette="${context.args.palette}">
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
        <span slot="contact-link" class="contact-info">
          <qgds-icon icon-id="phone"></qgds-icon>
          <span class="sr-only">Phone:</span> 13 QGOV (13 74 68)
        </span>

        <span slot="contact-link" class="contact-info">
          <qgds-icon icon-id="email"></qgds-icon>
          <span class="sr-only">Email:</span>email@qld.gov.au
        </span>

        <span slot="contact-link" class="contact-info">
          <qgds-icon icon-id="facebook"></qgds-icon>
          <a
            href="https://www.facebook.com/QueenslandGovernment"
            title="Visit Queensland Government Facebook page"
            target="_blank"
            rel="noopener noreferrer"
            ><span class="sr-only">Facebook:</span>/QueenslandGovernment</a
          >
        </span>

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
        <span slot="contact-link" class="contact-info">
          <qgds-icon icon-id="phone"></qgds-icon>
          <span class="sr-only">Phone:</span> 13 QGOV (13 74 68)
        </span>

        <span slot="contact-link" class="contact-info">
          <qgds-icon icon-id="email"></qgds-icon>
          <span class="sr-only">Email:</span>email@qld.gov.au
        </span>

        <span slot="contact-link" class="contact-info">
          <qgds-icon icon-id="facebook"></qgds-icon>
          <a
            href="https://www.facebook.com/QueenslandGovernment"
            title="Visit Queensland Government Facebook page"
            target="_blank"
            rel="noopener noreferrer"
            ><span class="sr-only">Facebook:</span>/QueenslandGovernment</a
          >
        </span>

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
