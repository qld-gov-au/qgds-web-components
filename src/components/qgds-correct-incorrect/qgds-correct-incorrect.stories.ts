import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { action } from "storybook/actions";
import { chromaticModes } from "../../../.storybook/modes";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { QGDSCorrectIncorrect } from "./qgds-correct-incorrect";
import "./qgds-correct-incorrect";

// Get auto-generated args, argTypes, and template from Custom Elements Manifest
const { args, argTypes, template } = getStorybookHelpers<QGDSCorrectIncorrect>("qgds-correct-incorrect");

type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Correct Incorrect",
  component: "qgds-correct-incorrect",
  argTypes,
  args: {
    ...args,
    "default-slot": "This is the content with <a href='#'>link</a>.",
  },
  tags: ["autodocs"],
  render: (args) => html`
    <qgds-correct-incorrect
        status=${args.status}
        variant=${args.variant}
    >
        ${unsafeHTML(args["default-slot"])}
    </qgds-correct-incorrect>
  `,
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const AllStatuses: Story = {
    render: () => html`
        <qgds-correct-incorrect status="correct">This is correct.</qgds-correct-incorrect>
        <qgds-correct-incorrect status="incorrect">This is incorrect.</qgds-correct-incorrect>
    `
};