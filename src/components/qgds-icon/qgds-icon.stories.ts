import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import "./qgds-icon.ts";
import { ICON_NAMES } from "./icon-names.js";

export interface QGDSIconProps {
  /** Icon identifier */
  iconId: string;
  /** Icon size */
  size: "sm" | "md" | "lg" | "xl";
  /** ARIA label for accessibility */
  ariaLabel: string;
}

/** QGDS Icon Web Component */
const renderIcon = ({
  iconId = "home",
  size = "md",
  ariaLabel = "",
}: QGDSIconProps) => {
  return html`
    <qgds-icon
      iconId="${iconId}"
      size="${size}"
      ariaLabel="${ifDefined(ariaLabel || undefined)}"
    >
    </qgds-icon>
  `;
};

const meta: Meta<QGDSIconProps> = {
  title: "Components/QGDS Icon",
  tags: ["autodocs"],
  render: (args) => renderIcon(args),
  argTypes: {
    iconId: {
      control: "select",
      options: [...ICON_NAMES],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    ariaLabel: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<QGDSIconProps>;

export const Default: Story = {
  args: {
    iconId: "home",
    size: "md",
  },
};

/** Multiple icons at small size */
export const Small: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;"
    >
      <qgds-icon iconId="home" size="sm" ariaLabel="Home"></qgds-icon>
      <qgds-icon
        iconId="alert-success"
        size="sm"
        ariaLabel="Success"
      ></qgds-icon>
      <qgds-icon iconId="alert-error" size="sm" ariaLabel="Error"></qgds-icon>
      <qgds-icon
        iconId="alert-warning"
        size="sm"
        ariaLabel="Warning"
      ></qgds-icon>
      <qgds-icon
        iconId="alert-information"
        size="sm"
        ariaLabel="Information"
      ></qgds-icon>
      <qgds-icon iconId="calendar" size="sm" ariaLabel="Calendar"></qgds-icon>
      <qgds-icon
        iconId="arrow-right"
        size="sm"
        ariaLabel="Arrow Right"
      ></qgds-icon>
      <qgds-icon
        iconId="accessibility"
        size="sm"
        ariaLabel="Accessibility"
      ></qgds-icon>
      <qgds-icon
        iconId="announcement"
        size="sm"
        ariaLabel="Announcement"
      ></qgds-icon>
    </div>
  `,
};

/** Multiple icons at medium size */
export const Medium: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;"
    >
      <qgds-icon iconId="home" size="md" ariaLabel="Home"></qgds-icon>
      <qgds-icon
        iconId="alert-success"
        size="md"
        ariaLabel="Success"
      ></qgds-icon>
      <qgds-icon iconId="alert-error" size="md" ariaLabel="Error"></qgds-icon>
      <qgds-icon
        iconId="alert-warning"
        size="md"
        ariaLabel="Warning"
      ></qgds-icon>
      <qgds-icon
        iconId="alert-information"
        size="md"
        ariaLabel="Information"
      ></qgds-icon>
      <qgds-icon iconId="calendar" size="md" ariaLabel="Calendar"></qgds-icon>
      <qgds-icon
        iconId="arrow-right"
        size="md"
        ariaLabel="Arrow Right"
      ></qgds-icon>
      <qgds-icon
        iconId="accessibility"
        size="md"
        ariaLabel="Accessibility"
      ></qgds-icon>
      <qgds-icon
        iconId="announcement"
        size="md"
        ariaLabel="Announcement"
      ></qgds-icon>
    </div>
  `,
};

/** Multiple icons at large size */
export const Large: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;"
    >
      <qgds-icon iconId="home" size="lg" ariaLabel="Home"></qgds-icon>
      <qgds-icon
        iconId="alert-success"
        size="lg"
        ariaLabel="Success"
      ></qgds-icon>
      <qgds-icon iconId="alert-error" size="lg" ariaLabel="Error"></qgds-icon>
      <qgds-icon
        iconId="alert-warning"
        size="lg"
        ariaLabel="Warning"
      ></qgds-icon>
      <qgds-icon
        iconId="alert-information"
        size="lg"
        ariaLabel="Information"
      ></qgds-icon>
      <qgds-icon iconId="calendar" size="lg" ariaLabel="Calendar"></qgds-icon>
      <qgds-icon
        iconId="arrow-right"
        size="lg"
        ariaLabel="Arrow Right"
      ></qgds-icon>
      <qgds-icon
        iconId="accessibility"
        size="lg"
        ariaLabel="Accessibility"
      ></qgds-icon>
      <qgds-icon
        iconId="announcement"
        size="lg"
        ariaLabel="Announcement"
      ></qgds-icon>
    </div>
  `,
};

/** Multiple icons at extra large size */
export const ExtraLarge: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;"
    >
      <qgds-icon iconId="home" size="xl" ariaLabel="Home"></qgds-icon>
      <qgds-icon
        iconId="alert-success"
        size="xl"
        ariaLabel="Success"
      ></qgds-icon>
      <qgds-icon iconId="alert-error" size="xl" ariaLabel="Error"></qgds-icon>
      <qgds-icon
        iconId="alert-warning"
        size="xl"
        ariaLabel="Warning"
      ></qgds-icon>
      <qgds-icon
        iconId="alert-information"
        size="xl"
        ariaLabel="Information"
      ></qgds-icon>
      <qgds-icon iconId="calendar" size="xl" ariaLabel="Calendar"></qgds-icon>
      <qgds-icon
        iconId="arrow-right"
        size="xl"
        ariaLabel="Arrow Right"
      ></qgds-icon>
      <qgds-icon
        iconId="accessibility"
        size="xl"
        ariaLabel="Accessibility"
      ></qgds-icon>
      <qgds-icon
        iconId="announcement"
        size="xl"
        ariaLabel="Announcement"
      ></qgds-icon>
    </div>
  `,
};

export const Decorative: Story = {
  args: {
    iconId: "home",
    size: "md",
  },
};
