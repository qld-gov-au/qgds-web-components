import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { expect, fireEvent } from "storybook/test";
import { type QGDSFileUpload, tagname } from "./qgds-file-upload";
import "./qgds-file-upload";
import { withEventActions } from "../../../../.storybook/storybook-helpers";
import { allFilesArray } from "./__mocks__/filemocks";
import { chromaticModes } from "../../../../.storybook/modes";

const { args, argTypes, template } = getStorybookHelpers<QGDSFileUpload>(tagname);
// const {
//   args: itemArgs,
//   argTypes: itemArgTypes,
//   template: itemTemplate,
// } = getStorybookHelpers<QGDSFileUploadItem>("qgds-file-upload-item");
type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Forms/File upload",
  component: tagname,
  tags: ["autodocs"],
  args,
  argTypes,
  decorators: [withEventActions(["qgds-button-click", "qgds-cancel", "qgds-change", "change"])],
  render: (args) => template(args),
};

export default meta;
type Story = StoryObj<Args>;

export const Single: Story = {
  args: {
    id: "Default",
    accept: "*",
    label: "Default ",
  },
};

export const Multiple: Story = {
  args: {
    id: "Multiple",
    accept: "*",
    multiple: true,
    ["max-files"]: -1,
    label: "Multiple ",
  },
};

export const AllFileTypes: Story = {
  args: { ...Multiple.args, id: "AllFileTypes", label: "All file types", ["max-files"]: allFilesArray.length },
  parameters: {
    ...chromaticModes, // snapshots in all pallettes
    controls: {
      disable: true,
    },
  },
  play: async ({ canvasElement }) => {
    const dt = new DataTransfer();
    allFilesArray.forEach((file) => dt.items.add(file));
    await expect(dt.items.length).toBeGreaterThan(1);

    const uploader: QGDSFileUpload | null = canvasElement.querySelector("qgds-file-upload");
    await uploader?.updateComplete;
    const dropzone = uploader?.shadowRoot?.querySelector(".file-upload-dropzone");

    if (dropzone) {
      await fireEvent.drop(dropzone, {
        dataTransfer: Object.defineProperty(dt, "files", {
          value: dt.files, // This needs to be recreated again because the fireEvent.drop() test method clears the value.
        }),
      });
    }

    await uploader?.updateComplete;
    await expect(uploader?.shadowRoot?.querySelectorAll("qgds-file-upload-item").length).toEqual(allFilesArray.length);
  },
};
