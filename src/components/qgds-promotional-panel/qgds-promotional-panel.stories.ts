import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { chromaticModes } from "../../../.storybook/modes";
import type { QGDSPromotionalPanel } from "./qgds-promotional-panel";
import "./qgds-promotional-panel";

const { args, argTypes, template } = getStorybookHelpers<QGDSPromotionalPanel>("qgds-promotional-panel");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Promotional Panel",
  component: "qgds-promotional-panel",
  tags: ["autodocs"],
  args: {
    ...args,
    promoType: "indent-text",
    promoImage: "/src/img/children-walk-school.jpg",
    promoImageDescription: "Promotional image",
    contentAlignment: "content-left",
    icon: "design",
    promoPalette: "muted",
    title: "Title goes here and has a maximum of 65 character limit",
    abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tortor, leo vulputate ut odio mattis.",
  },
  argTypes,
  render: (args) => template(args),
};
export default meta;

export const Default: Story = {
  args: meta.args,
  parameters: {
    ...chromaticModes,
  },
  render: (args) => html`
    <div style="padding-bottom: 4rem;">
      <qgds-promotional-panel
        promoType=${args.promoType}
        promoImage=${args.promoImage}
        promoImageDescription=${args.promoImageDescription}
        contentAlignment=${args.contentAlignment}
        icon=${args.icon}
        title=${args.title}
        abstract=${args.abstract}
        palette=${args.promoPalette}
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tortor, leo vulputate ut odio mattis. Vel
          suspendisse mi quisque consequat aliquet egestas.
        </p>
        <a slot="footer-ctalinks" href="https://www.qld.gov.au" target="_blank" label="Call to Action Link"
          >Call to Action Link</a
        >
        <a slot="footer-ctalinks" href="https://www.qld.gov.au" target="_blank" label="Call to Action Last Link"
          >Call to Action Last Link</a
        >
        <qgds-button
          slot="footer-buttons"
          target=""
          type="button"
          aria-label="Primary Action"
          label="Primary"
          variant="primary"
          href=""
          id=""
        >
        </qgds-button>
        <qgds-button
          slot="footer-buttons"
          target=""
          type="button"
          aria-label="Secondary Action"
          label="Secondary"
          variant="secondary"
          href=""
          id=""
        >
        </qgds-button>
      </qgds-promotional-panel>
    </div>
  `,
};
