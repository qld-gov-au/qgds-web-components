import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { ref } from "lit/directives/ref.js";

import "./qgds-button.ts";

export interface QGDSButtonProps {
  /** Button contents */
  label: string;
  /** Message to log on click */
  message?: string;
  /** Anchor target */
  target?: string;
  /** ARIA label */
  ariaLabel?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Icon slot content */
  myIcon?: string;
  /** Button text content */
  // buttonText?: string;
  trailingIcon?: boolean;
  /** Whether the button is a link */
  isLink?: boolean;
  /** Loading text to display */
  loadingText?: string;
  /** Whether the button is loading */
  isLoading?: boolean;
  /** Event title */
  eventTitle?: string;
  /** Unique identifier */
  uniqueID?: string;

  StoryPalette?: string;
  variant?: string;
}

/** QGDS Button Web Component */
const renderButton = ({
  label,
  disabled = false,
  target = "",
  ariaLabel = "",
  myIcon = `<span slot="icon" class="icon-test"></span>`,
  trailingIcon = false,
  variant = "primary",
  isLink = false,
  loadingText = "Loading...",
  isLoading = false,
  eventTitle = "onClick",
  uniqueID = "",
}: QGDSButtonProps) => {
  // Create a handler that logs the event to console
  const handleEvent = (e: CustomEvent) => {
    // eslint-disable-next-line no-console
    console.log(`✅ Event "${e.type}" bubbled up to light DOM`);
    // eslint-disable-next-line no-console
    console.log(`   Full event detail:`, e.detail);
  };

  const attachListener = (el?: Element) => {
    if (el) {
      el.addEventListener(eventTitle, handleEvent as EventListener);
    }
  };

  return html`
    <div ${ref(attachListener)}>
      <qgds-button
        ?disabled=${disabled}
        target="${ifDefined(target || undefined)}"
        aria-label="${ifDefined(ariaLabel || undefined)}"
        button-text="${label}"
        ?trailing-icon=${trailingIcon}
        variant="${variant}"
        ?is-link=${isLink}
        loading-text="${ifDefined(loadingText || undefined)}"
        ?is-loading=${isLoading}
        event-title="${eventTitle}"
        unique-id="${ifDefined(uniqueID || undefined)}"
      >
        ${myIcon ? unsafeHTML(myIcon) : ""}
      </qgds-button>
    </div>
  `;
};

const meta: Meta<QGDSButtonProps> = {
  title: "Components/QGDS Button",
  tags: ["autodocs"],
  render: (args) => renderButton(args),

  argTypes: {
    StoryPalette: {
      control: "select",
      options: ["default", "pale", "muted", "bold", "deep"],
      mapping: {
        default: "palette-default",
        pale: "palette-pale",
        muted: "palette-muted",
        bold: "palette-bold",
        deep: "palette-deep",
      },
      name: "story palette",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      name: "button variant type",
    },
    label: { control: "text" },
    disabled: { control: "boolean" },
    target: {
      control: "select",
      options: ["_self", "_blank", "_parent", "_top"],
      if: { arg: "isLink" },
    },
    ariaLabel: { control: "text" },
    trailingIcon: { control: "boolean", name: "has trailing icon" },
    isLink: { control: "boolean", name: "is link" },
    loadingText: {
      control: "text",
      name: "loading text",
      if: { arg: "isLink", truthy: false },
    },
    isLoading: {
      control: "boolean",
      name: "is loading",
      if: { arg: "isLink", truthy: false },
    },
    eventTitle: {
      control: "text",
      name: "event title",
    },
    uniqueID: { control: "text", name: "unique ID" },
  },
  globals: {
    backgrounds: { value: "default" },
  },
};

export default meta;
type Story = StoryObj<QGDSButtonProps>;

export const Button: Story = {
  args: {
    label: "QGDS Button",
  },
  decorators: [
    (Story, context) => html`
      <div class="parent-container ${context.args.StoryPalette ?? ""}">
        ${Story()}
      </div>
    `,
  ],
};

export const Default: Story = {
  args: {
    label: "Default",
  },
  decorators: [
    (Story, context) => html`
      <div class="parent-container ${context.args.StoryPalette ?? ""}">
        ${Story()}
      </div>
    `,
  ],
};

export const NoIcon: Story = {
  args: {
    label: "No icon",
    myIcon: "",
  },
  decorators: [
    (Story, context) => html`
      <div class="parent-container ${context.args.StoryPalette ?? ""}">
        ${Story()}
      </div>
    `,
  ],
};

export const Disabled: Story = {
  args: {
    label: "Disabled Button",
    disabled: true,
  },
  decorators: [
    (Story, context) => html`
      <div class="parent-container ${context.args.StoryPalette ?? ""}">
        ${Story()}
      </div>
    `,
  ],
};

export const CustomMessage: Story = {
  args: {
    label: "Custom Message",
    message: "Custom click message!",
  },
  decorators: [
    (Story, context) => html`
      <div class="parent-container ${context.args.StoryPalette ?? ""}">
        ${Story()}
      </div>
    `,
  ],
};

export const Loading: Story = {
  args: {
    label: "Loading Button",
    isLoading: true,
    loadingText: "Loading...",
  },
  decorators: [
    (Story, context) => html`
      <div class="parent-container ${context.args.StoryPalette ?? ""}">
        ${Story()}
      </div>
    `,
  ],
};
