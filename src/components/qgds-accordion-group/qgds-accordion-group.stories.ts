import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import type { QGDSAccordionGroup } from "./qgds-accordion-group";
import "./qgds-accordion-group";
import type { QGDSAccordion } from "./../qgds-accordion/qgds-accordion";
import "./../qgds-accordion/qgds-accordion";
import { Closed, Open } from "./../qgds-accordion/qgds-accordion.stories";
import { chromaticModes } from "../../../.storybook/modes";

const { args, argTypes, template } = getStorybookHelpers<QGDSAccordionGroup>("qgds-accordion-group");
const { template: childTemplate } = getStorybookHelpers<QGDSAccordion>("qgds-accordion");
type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Accordion group",
  component: "qgds-accordion-group",
  tags: ["autodocs"],
  args,
  argTypes,
  render: (args) =>
    template(
      args,
      html`${childTemplate({ ...Open.args })} ${childTemplate({ ...Closed.args })} ${childTemplate({ ...Closed.args })}`
    ),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  parameters: {
    ...chromaticModes,
  },
};
