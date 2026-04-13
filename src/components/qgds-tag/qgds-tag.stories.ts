import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import type { QGDSTag } from "./qgds-tag";
import "./qgds-tag";

// Get auto-generated args, argTypes, and template from Custom Elements Manifest
const { args, argTypes, template } = getStorybookHelpers<QGDSTag>("qgds-tag");

type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Tag",
  component: "qgds-tag",
  argTypes,
  args,
  tags: ["autodocs"],
  render: (args: Args) => template(args),
};

export default meta;
type Story = StoryObj<Args>;

/**
 * The default tag variant
 */
export const AllVariants: Story = {
  args: {
    label: "Default Tag",
    variant: "default",
  },
  render: (args) =>
    html`<div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
      ${template({
        ...args,
        variant: "default",
        label: "cDefault Default Default DefaultDefaultDefaultv Default Default Default",
      })}
      ${template({ ...args, variant: "info", label: "Information" })}
      ${template({ ...args, label: "Action link", href: "#" })}
      ${template({ ...args, variant: "action", label: "Action button" })}
      ${template({ ...args, variant: "dismissible", label: "Dismissible" })}
    </div>`,
};

/**
 * Info tag variant for informational states
 */
export const Info: Story = {
  args: {
    label: "Info",
    variant: "info",
  },
};

/**
 * Removable tag with close button
 */
export const Removable: Story = {
  args: {
    label: "Click × to remove",
    variant: "default",
    removable: true,
  },
};

/**
 * Multiple tags grouped together
 */
export const MultipleTagsStory: Story = {
  render: () => html`
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <qgds-tag label="React" variant="default"></qgds-tag>
      <qgds-tag label="TypeScript" variant="info"></qgds-tag>
      <qgds-tag label="Active" variant="success"></qgds-tag>
      <qgds-tag label="Deprecated" variant="warning"></qgds-tag>
      <qgds-tag label="Breaking" variant="error"></qgds-tag>
    </div>
  `,
};

/**
 * Interactive removable tags
 */
export const RemovableTagsStory: Story = {
  render: () => html`
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <qgds-tag label="Feature" variant="success" removable></qgds-tag>
      <qgds-tag label="Enhancement" variant="info" removable></qgds-tag>
      <qgds-tag label="Bug Fix" variant="warning" removable></qgds-tag>
    </div>
  `,
};
