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

  // StoryPalette?: string;
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
    // StoryPalette: {
    //   control: "select",
    //   options: [
    //     "palette-default",
    //     "palette-soft",
    //     "palette-muted",
    //     "palette-bold",
    //     "palette-deep",
    //   ],
    //   name: "story palette",
    //   description: "The Button colour palette and story palette",
    //   table: {
    //     defaultValue: { summary: "default" },
    //   },
    // },
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      name: "button variant type",
      description: "The Button variant type",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    label: {
      control: "text",
      description: "This is the Button content",
      type: "string",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
      type: "boolean",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    target: {
      control: "select",
      options: ["_self", "_blank", "_parent", "_top"],
      if: { arg: "isLink" },
    },
    ariaLabel: {
      control: "text",
      description: "The Button aria-label attribute",
      type: "string",
    },
    trailingIcon: {
      control: "boolean",
      name: "has trailing icon",
      description: "Whether the button has a trailing icon",
      type: "boolean",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLink: {
      control: "boolean",
      name: "is link",
      description: "Whether the button is a HTML link",
      type: "boolean",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    loadingText: {
      control: "text",
      name: "loading text",
      if: { arg: "isLink", truthy: false },
      description: "The text that appears when the button is loading",
      type: "string",
      table: {
        defaultValue: { summary: "Loading..." },
      },
    },
    isLoading: {
      control: "boolean",
      name: "is loading",
      if: { arg: "isLink", truthy: false },
      description: "Whether the button is in a loading state",
      table: {
        defaultValue: { summary: "false" },
      },
      type: "boolean",
    },
    eventTitle: {
      control: "text",
      name: "event title",
      description: "The event title for the button, e.g., onClick",
      type: "string",
    },
    uniqueID: {
      control: "text",
      name: "unique ID",
      description: "The unique identifier for the button",
      type: "string",
    },
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
  // decorators: [
  //   (Story, context) => html`
  //     <div class="parent-container ${context.args.StoryPalette ?? ""}">
  //       ${Story()}
  //     </div>
  //   `,
  // ],
};

export const Default: Story = {
  args: {
    label: "Default",
  },
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <qgds-button button-text="QGDS Button" variant="primary">
        <span slot="icon" class="icon-test"></span>
      </qgds-button>
      <qgds-button button-text="QGDS Button" variant="secondary">
        <span slot="icon" class="icon-test"></span>
      </qgds-button>
      <qgds-button button-text="QGDS Button" variant="tertiary">
        <span slot="icon" class="icon-test"></span>
      </qgds-button>
    </div>
  `,
};

export const NoIcon: Story = {
  args: {
    label: "No icon",
    myIcon: "",
  },
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <qgds-button button-text="QGDS Button" variant="primary">
        <slot name="icon"></slot>
      </qgds-button>
      <qgds-button button-text="QGDS Button" variant="secondary">
        <slot name="icon"></slot>
      </qgds-button>
      <qgds-button button-text="QGDS Button" variant="tertiary">
        <slot name="icon"></slot>
      </qgds-button>
    </div>
  `,
};
