import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { expect, fireEvent } from "storybook/test";
import { QGDSFileUpload, tagname } from "./qgds-file-upload";
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

function createMockDataTransfer() {
  const dt = new DataTransfer();
  allFilesArray.forEach((file) => dt.items.add(file));
  return Object.defineProperty(dt, "files", { value: dt.files }); // Need to recreate as plain Object to work with test events
}

const dataTransferMock = createMockDataTransfer();

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
    label: "Single file upload",
    hint: "This is the default setting",
  },
};

export const Multiple: Story = {
  args: {
    id: "Multiple",
    multiple: true,
    ["max-files"]: 10,
    label: "Multiple file upload",
    hint: "Set a value for max-files and set multiple to true to allow multi-select.",
  },
};

export const RequiredIndicator: Story = {
  args: {
    id: "RequiredIndicator",
    label: "Indicate as required",
    hint: 'To display a required indicator, the input must have required="true" and indicate-if="required"',
    placeholder: "Hold my place...",
    required: true,
    ["indicate-if"]: "required",
  },
};

export const OptionalIndicator: Story = {
  args: {
    id: "OptionalIndicator",
    label: "Indicate as optional",
    hint: 'To display an optional indicator, the input must not be required and indicate-if="optional"',
    placeholder: "Hold my place...",
    required: false,
    ["indicate-if"]: "optional",
  },
};

export const Accept: Story = {
  args: {
    id: "Accept",
    accept: ".png, .jpg",
    label: "Accept only specified file types.",
    hint: "The accepts parameter will display acceptable file types and perform client side validation. You should always validate server side as well.",
  },
};

export const DragEnterState: Story = {
  args: {
    id: "DragEnterState",
    label: "Drag over state",
    hint: "Dropzone state when dragEnter event is fired",
    ["max-files"]: allFilesArray.length,
  },
  parameters: {
    ...chromaticModes, // snapshots in all pallettes
    controls: {
      disable: true,
    },
  },
  play: async ({ canvasElement }) => {
    await expect(dataTransferMock.files.length).toBeGreaterThan(1);
    const uploader: QGDSFileUpload | null = canvasElement.querySelector("qgds-file-upload");
    await expect(uploader).toBeInstanceOf(QGDSFileUpload);
    await uploader?.updateComplete;
    const dropzone = uploader?.shadowRoot?.querySelector(".file-upload-dropzone");
    await expect(dropzone).toBeTruthy();
    if (dropzone) {
      await fireEvent.dragEnter(dropzone, {
        dataTransfer: dataTransferMock,
      });
    }

    await uploader?.updateComplete;
    await expect(dropzone as HTMLElement).toHaveStyle({
      "background-color": dropzone?.computedStyleMap().get("--qgds-color-background-shade"),
      "border-color": dropzone?.computedStyleMap().get("--qgds-color-action-primary-hover"),
    });
  },
};

export const AllFileTypes: Story = {
  args: { ...Multiple.args, id: "AllFileTypes", label: "All file icon types", ["max-files"]: allFilesArray.length },
  parameters: {
    ...chromaticModes, // snapshots in all pallettes
    controls: {
      disable: true,
    },
  },
  play: async ({ canvasElement }) => {
    await expect(dataTransferMock.files.length).toBeGreaterThan(1);
    const uploader: QGDSFileUpload | null = canvasElement.querySelector("qgds-file-upload");
    await expect(uploader).toBeInstanceOf(QGDSFileUpload);
    await uploader?.updateComplete;
    const dropzone = uploader?.shadowRoot?.querySelector(".file-upload-dropzone");
    await expect(dropzone).toBeTruthy();

    if (dropzone) {
      await fireEvent.drop(dropzone, {
        dataTransfer: dataTransferMock,
      });
    }

    await uploader?.updateComplete;
    await expect(uploader?.shadowRoot?.querySelectorAll("qgds-file-upload-item").length).toEqual(allFilesArray.length);
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled state",
    hint: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    id: "Disabled",
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    label: "Error state",
    hint: 'pass a validation-message and set validation-state to "error"',
    id: "Success",
    ["validation-message"]:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    ["validation-state"]: "error",
  },
};
