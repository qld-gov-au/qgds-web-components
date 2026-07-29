import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import { action } from "storybook/actions";

// Button component and types
import type { QGDSButton } from "./qgds-button";
import "./qgds-button";

// Icon Object and Types
import { ICON_NAMES } from "../qgds-icon/icon-names";

// Get auto-generated args, argTypes, and template from Custom Elements Manifest
// The template function handles attribute/property name mapping automatically
const { args, argTypes, template } = getStorybookHelpers<QGDSButton>("qgds-button");

type QGDSButtonStoryArgs = typeof args;

const meta: Meta<QGDSButtonStoryArgs> = {
  title: "Components/Button",
  component: "qgds-button",
  tags: ["autodocs"],
  args: {
    ...args,
    href: undefined,
    label: "QGDS Button",
    variant: "primary",
    "loading-label": "",
  },
  argTypes: {
    ...argTypes,
    "icon-name": {
      control: "select",
      options: [...ICON_NAMES],
      description: "The icon to display in the button",
      table: {
        category: "QGDS Icon",
      },
    },
  },

  play: ({ canvasElement }) => {
    const logClick = action("qgds-click");
    const buttons = canvasElement.querySelectorAll("qgds-button");
    buttons.forEach((button) => {
      button.addEventListener("qgds-click", (e) => {
        e.preventDefault();
        logClick((e as CustomEvent).detail);
      });
    });
  },

  globals: {
    backgrounds: { value: "default" },
  },
  decorators: [
    (story) => {
      return html`
        <style>
          .sb-button-grid {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-bottom: 2rem;
          }

          h3 {
            margin-bottom: 0.5rem;
            font-weight: normal;
          }
        </style>

        <div class="sb-button-grid">${story()}</div>
      `;
    },
  ],
};

export default meta;
type Story = StoryObj<QGDSButtonStoryArgs>;

export const Default: Story = {
  args: {
    label: "Button",
    variant: "primary",
    type: "button",
  },
  render: (storyArgs) =>
    html`${template({ ...storyArgs, label: "Button" })}<!-- or <qgds-button>Button</qgds-button> -->`,
};

export const Primary: Story = {
  args: {
    label: "Button",
    variant: "primary",
  },
  render: (storyArgs) => {
    const buttons = [
      storyArgs,
      { ...storyArgs, type: "submit", label: "Submit" },
      { ...storyArgs, type: "reset", label: "Reset" },
      { ...storyArgs, "icon-name": "external-link" },
    ] as const;

    return html`${buttons.map((buttonArgs) => template(buttonArgs))}`;
  },
};

export const Secondary: Story = {
  args: {
    label: "Button",
    variant: "secondary",
  },
  render: (storyArgs) => {
    const buttons = [
      storyArgs,
      { ...storyArgs, type: "submit", label: "Submit" },
      { ...storyArgs, type: "reset", label: "Reset" },
      { ...storyArgs, "icon-name": "external-link" },
    ] as const;

    return html`${buttons.map((buttonArgs) => template(buttonArgs))}`;
  },
};

export const Tertiary: Story = {
  args: {
    label: "Button",
    variant: "tertiary",
  },
  render: (storyArgs) => {
    const buttons = [
      storyArgs,
      { ...storyArgs, type: "submit", label: "Submit" },
      { ...storyArgs, type: "reset", label: "Reset" },
      { ...storyArgs, "icon-name": "external-link" },
    ] as const;

    return html`${buttons.map((buttonArgs) => template(buttonArgs))}`;
  },
};

export const Group: Story = {
  args: {
    label: "Button",
    variant: "tertiary",
  },
  render: (storyArgs) => {
    const buttons = [
      {
        ...storyArgs,
        id: "place-order",
        variant: "primary",
        type: "submit",
        label: "Place order",
        "icon-name": "arrow-right",
        "icon-position": "trailing",
      },
      { ...storyArgs, variant: "secondary", label: "Save progress", id: "save-progress" },
      { ...storyArgs, variant: "tertiary", type: "reset", label: "Start again", id: "start-again" },
    ] as const;

    return html`${buttons.map((buttonArgs) => template(buttonArgs))}`;
  },
};

export const WithIcon: Story = {
  args: {
    label: "Button",
    variant: "primary",
    "icon-name": "external-link",
  },
  render: (storyArgs) => {
    const buttons = [storyArgs, { ...storyArgs, "icon-position": "trailing" }] as const;

    return html`${buttons.map((buttonArgs) => template(buttonArgs))}`;
  },
};

export const LinkAsButton: Story = {
  args: {
    label: "Button",
    variant: "primary",
  },
  render: (storyArgs) => {
    const buttons = [
      { ...storyArgs, href: "https://qld.gov.au", label: "Find out more", target: "_blank" },
      { ...storyArgs, href: "#", label: "Profile", "icon-name": "users" },
    ] as const;

    return html`${buttons.map((buttonArgs) => template(buttonArgs))}`;
  },
};

export const LoadingState: Story = {
  args: {
    label: "Button",
    variant: "primary",
    "is-loading": true,
  },
  render: (storyArgs) => {
    const buttons = [storyArgs, { ...storyArgs, "loading-label": "Please wait..." }] as const;

    return html`${buttons.map((buttonArgs) => template(buttonArgs))}`;
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    variant: "primary",
    disabled: true,
  },
  render: (args) => html`${template(args)}`,
};
