import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import type { QGDSSelect } from "./qgds-select.ts";
import "./qgds-select.ts";

// Get auto-generated args, argTypes, and template from Custom Elements Manifest
const { args, argTypes, template } =
  getStorybookHelpers<QGDSSelect>("qgds-select");

/**
 * Storybook args interface using kebab-case attribute names from CEM.
 */
type QGDSSelectStoryArgs = typeof args;

const meta: Meta<QGDSSelectStoryArgs> = {
  title: "Components/QGDS Select",
  tags: ["autodocs"],
  args: {
    ...args,
    label: "Form label",
    disabled: false,
    required: false,
    filled: false,
    valid: false,
    invalid: false,
    autofocus: false,
  },
  argTypes: {
    ...argTypes,
    label: {
      control: "text",
      description: "The label text for the select element",
      table: {
        defaultValue: { summary: "Select" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the select is disabled",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    required: {
      control: "boolean",
      description: "Whether the select is required",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    filled: {
      control: "boolean",
      description: "Whether to use the filled variant styling",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    valid: {
      control: "boolean",
      description: "Whether the select is in a valid state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    invalid: {
      control: "boolean",
      description: "Whether the select is in an invalid state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hint: {
      control: "text",
      description: "Hint text displayed below the label",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    optionalText: {
      control: "text",
      description: "Optional text displayed next to the label",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    errorMessage: {
      control: "text",
      description: "Error message to display when invalid",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    successMessage: {
      control: "text",
      description: "Success message to display when valid",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the select element",
      table: {
        defaultValue: { summary: '"Please select"' },
      },
    },
    value: {
      control: "text",
      description: "Currently selected value",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    name: {
      control: "text",
      description: "Name attribute for form submission",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    selectId: {
      control: "text",
      description: "Custom ID for the select element",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    multiple: {
      control: "boolean",
      description: "Whether multiple selections are allowed",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    size: {
      control: "number",
      description: "Number of visible options when multiple is enabled",
      table: {
        defaultValue: { summary: "undefined" },
      },
      if: { arg: "multiple", truthy: true },
    },
    autofocus: {
      control: "boolean",
      description:
        "Whether the select should automatically receive focus when the page loads",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
  render: (storyArgs) => template(storyArgs),
};

export default meta;
type Story = StoryObj<QGDSSelectStoryArgs>;

export const Default: Story = {
  args: {
    label: "Form label",
    optionalText: "(optional)",
    hint: "Hint text",
  },
  render: (args) => html`
    <qgds-select
      label=${args.label}
      optionalText=${args.optionalText}
      hint=${args.hint}
    >
      <qgds-select-option value="dog" label="Dog"></qgds-select-option>
      <option value="cat">Cat</option>
      <option value="hamster">Hamster</option>
      <option value="parrot">Parrot</option>
      <qgds-select-option value="cat" label="Cat"></qgds-select-option>
      <qgds-select-option value="hamster" label="Hamster"></qgds-select-option>
      <qgds-select-option value="parrot" label="Parrot"></qgds-select-option>
      <qgds-select-option value="spider" label="Spider"></qgds-select-option>
      <qgds-select-option
        value="goldfish"
        label="Goldfish"
      ></qgds-select-option>
    </qgds-select>
  `,
};

export const Filled: Story = {
  args: {
    label: "Form label",
    filled: true,
    optionalText: "(optional)",
    hint: "Hint text",
  },
  render: (args) => html`
    <qgds-select
      label=${args.label}
      ?filled=${args.filled}
      hint=${args.hint}
      optionalText=${args.optionalText}
    >
      <qgds-select-option value="dog" label="Dog"></qgds-select-option>
      <qgds-select-option value="cat" label="Cat"></qgds-select-option>
      <qgds-select-option value="hamster" label="Hamster"></qgds-select-option>
      <qgds-select-option value="parrot" label="Parrot"></qgds-select-option>
      <qgds-select-option value="spider" label="Spider"></qgds-select-option>
      <qgds-select-option
        value="goldfish"
        label="Goldfish"
      ></qgds-select-option>
    </qgds-select>
  `,
};

export const Disabled: Story = {
  args: {
    label: "Form label",
    optionalText: "(optional)",
    disabled: true,
    hint: "Hint text",
  },
  render: (args) => html`
    <qgds-select
      label=${args.label}
      ?disabled=${args.disabled}
      hint=${args.hint}
      optionalText=${args.optionalText}
    >
      <qgds-select-option value="dog" label="Dog"></qgds-select-option>
      <qgds-select-option value="cat" label="Cat"></qgds-select-option>
      <qgds-select-option value="hamster" label="Hamster"></qgds-select-option>
      <qgds-select-option value="parrot" label="Parrot"></qgds-select-option>
      <qgds-select-option value="spider" label="Spider"></qgds-select-option>
      <qgds-select-option
        value="goldfish"
        label="Goldfish"
      ></qgds-select-option>
    </qgds-select>
  `,
};

export const Required: Story = {
  args: {
    label: "Form label",
    optionalText: "(optional)",
    required: true,
    hint: "Hint text",
  },
  render: (args) => html`
    <qgds-select
      label=${args.label}
      ?required=${args.required}
      hint=${args.hint}
      optionalText=${args.optionalText}
    >
      <qgds-select-option value="dog" label="Dog"></qgds-select-option>
      <qgds-select-option value="cat" label="Cat"></qgds-select-option>
      <qgds-select-option value="hamster" label="Hamster"></qgds-select-option>
      <qgds-select-option value="parrot" label="Parrot"></qgds-select-option>
      <qgds-select-option value="spider" label="Spider"></qgds-select-option>
      <qgds-select-option
        value="goldfish"
        label="Goldfish"
      ></qgds-select-option>
    </qgds-select>
  `,
};

export const Invalid: Story = {
  args: {
    label: "Form label",
    optionalText: "(optional)",
    invalid: true,
    required: true,
    hint: "Hint text",
    errorMessage: "Please select a valid option",
  },
  render: (args) => html`
    <qgds-select
      label=${args.label}
      ?invalid=${args.invalid}
      ?required=${args.required}
      errorMessage=${args.errorMessage}
      hint=${args.hint}
      optionalText=${args.optionalText}
    >
      <qgds-select-option value="dog" label="Dog"></qgds-select-option>
      <qgds-select-option value="cat" label="Cat"></qgds-select-option>
      <qgds-select-option value="hamster" label="Hamster"></qgds-select-option>
      <qgds-select-option value="parrot" label="Parrot"></qgds-select-option>
      <qgds-select-option value="spider" label="Spider"></qgds-select-option>
      <qgds-select-option
        value="goldfish"
        label="Goldfish"
      ></qgds-select-option>
    </qgds-select>
  `,
};

export const Valid: Story = {
  args: {
    label: "Form label",
    valid: true,
    required: true,
    optionalText: "(optional)",
    hint: "Hint text",
    successMessage: "Great choice!",
  },
  render: (args) => html`
    <qgds-select
      label=${args.label}
      ?valid=${args.valid}
      ?required=${args.required}
      hint=${args.hint}
      successMessage=${args.successMessage}
      optionalText=${args.optionalText}
    >
      <qgds-select-option value="dog" label="Dog"></qgds-select-option>
      <qgds-select-option value="cat" label="Cat"></qgds-select-option>
      <qgds-select-option value="hamster" label="Hamster"></qgds-select-option>
      <qgds-select-option value="parrot" label="Parrot"></qgds-select-option>
      <qgds-select-option value="spider" label="Spider"></qgds-select-option>
      <qgds-select-option
        value="goldfish"
        label="Goldfish"
      ></qgds-select-option>
    </qgds-select>
  `,
};

export const Multiple: Story = {
  args: {
    label: "Select your favorite pets",
    multiple: true,
    size: 6,
    hint: "You can select multiple options",
  },
  render: (args) => html`
    <qgds-select
      label=${args.label}
      ?multiple=${args.multiple}
      size=${args.size}
      hint=${args.hint}
    >
      <qgds-select-option value="dog" label="Dog"></qgds-select-option>
      <qgds-select-option value="cat" label="Cat"></qgds-select-option>
      <qgds-select-option value="hamster" label="Hamster"></qgds-select-option>
      <qgds-select-option value="parrot" label="Parrot"></qgds-select-option>
      <qgds-select-option value="spider" label="Spider"></qgds-select-option>
      <qgds-select-option
        value="goldfish"
        label="Goldfish"
      ></qgds-select-option>
    </qgds-select>
  `,
};

export const Autofocus: Story = {
  args: {
    label: "Form label",
    autofocus: true,
    hint: "This select will automatically receive focus when the page loads",
  },
  render: (args) => html`
    <qgds-select
      label=${args.label}
      ?autofocus=${args.autofocus}
      hint=${args.hint}
    >
      <qgds-select-option value="dog" label="Dog"></qgds-select-option>
      <qgds-select-option value="cat" label="Cat"></qgds-select-option>
      <qgds-select-option value="hamster" label="Hamster"></qgds-select-option>
      <qgds-select-option value="parrot" label="Parrot"></qgds-select-option>
      <qgds-select-option value="spider" label="Spider"></qgds-select-option>
      <qgds-select-option
        value="goldfish"
        label="Goldfish"
      ></qgds-select-option>
    </qgds-select>
  `,
};

export const WithCustomOptions: Story = {
  args: {
    label: "Select your favorite pet",
    hint: "Using qgds-select-option custom elements",
  },
  render: (args) => html`
    <qgds-select label=${args.label} hint=${args.hint}>
      <qgds-select-option value="dog" label="Dog"></qgds-select-option>
      <qgds-select-option value="cat" label="Cat"></qgds-select-option>
      <qgds-select-option value="hamster" label="Hamster"></qgds-select-option>
      <qgds-select-option value="parrot" label="Parrot"></qgds-select-option>
      <qgds-select-option
        value="spider"
        label="Spider (unavailable)"
        disabled
      ></qgds-select-option>
      <qgds-select-option
        value="goldfish"
        label="Goldfish"
      ></qgds-select-option>
    </qgds-select>
  `,
};

export const WithOptgroup: Story = {
  args: {
    label: "Select an animal",
    hint: "Options are grouped using qgds-select-optgroup",
  },
  render: (args) => html`
    <qgds-select label=${args.label} hint=${args.hint}>
      <qgds-select-optgroup label="Common Pets">
        <qgds-select-option value="dog" label="Dog"></qgds-select-option>
        <qgds-select-option value="cat" label="Cat"></qgds-select-option>
        <qgds-select-option
          value="hamster"
          label="Hamster"
        ></qgds-select-option>
      </qgds-select-optgroup>
      <qgds-select-optgroup label="Birds">
        <qgds-select-option value="parrot" label="Parrot"></qgds-select-option>
        <qgds-select-option value="canary" label="Canary"></qgds-select-option>
        <qgds-select-option value="budgie" label="Budgie"></qgds-select-option>
      </qgds-select-optgroup>
      <qgds-select-optgroup label="Exotic Pets">
        <qgds-select-option value="spider" label="Spider"></qgds-select-option>
        <qgds-select-option value="snake" label="Snake"></qgds-select-option>
        <qgds-select-option value="iguana" label="Iguana"></qgds-select-option>
      </qgds-select-optgroup>
    </qgds-select>
  `,
};
