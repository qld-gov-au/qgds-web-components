import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
// import { action } from "storybook/actions";
// import { chromaticModes } from "../../../.storybook/modes";
// import { html } from "lit";
import { type QGDSFileUpload, tagname } from "./qgds-file-upload";
import "./qgds-file-upload";
import { withEventActions } from "../../../../.storybook/storybook-helpers";

const { args, argTypes, template } = getStorybookHelpers<QGDSFileUpload>(tagname);
type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Forms/File upload",
  component: tagname,
  tags: ["autodocs"],
  args,
  argTypes,
  render: (args) => template(args),
};

export default meta;
type Story = StoryObj<Args>;

export const AllFileStatuses: Story = {
  args: {
    id: "AllFileStatuses",
    accept: "*",
    maxFiles: -1,
    label: "All file statuses",
    hint: "This mocks all supported file type icons and statuses.",
  },
  decorators: [withEventActions(["qgds-button-click", "qgds-cancel"])],
};
