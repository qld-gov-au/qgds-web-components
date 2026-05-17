import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import "./qgds-video-player.js";
import type { QGDSVideoPlayer } from "./qgds-video-player.js";

const { args, argTypes, template } = getStorybookHelpers<QGDSVideoPlayer>("qgds-video-player");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Video Player",
  component: "qgds-video-player",
  tags: ["autodocs"],
  args: {
    ...args,
    source: "youtube",
    "video-id": "LDU_Txk06tM",
    thumbnail: "https://img.youtube.com/vi/LDU_Txk06tM/sddefault.jpg",
    duration: "3:12",
    "aspect-ratio": "16x9",
    controls: true,
    autoplay: false,
  },
  argTypes: {
    ...argTypes,
    source: {
      control: { type: "select" },
      options: ["youtube", "vimeo", "custom", ""],
    },
    "aspect-ratio": {
      control: { type: "select" },
      options: ["16x9", "4x3", "1x1", "21x9"],
    },
  },
  decorators: [
    (story) => html`
      <div style="max-width: 720px; margin: 1rem;">${story()}</div>
    `,
  ],
  render: (args) => template(args),
};

export default meta;

export const YouTube: Story = {};

export const Vimeo: Story = {
  args: {
    source: "vimeo",
    "video-id": "251763826",
    thumbnail: "https://picsum.photos/seed/qgds-vimeo/1280/720",
    duration: "5:00",
    "aspect-ratio": "4x3",
  },
};

export const Custom: Story = {
  args: {
    source: "custom",
    "video-id": "https://embed.ted.com/talks/lang/en/adam_grosser_a_mobile_fridge_for_vaccines",
    thumbnail: "https://picsum.photos/seed/qgds-custom/1280/720",
    duration: "3:17",
  },
};

export const NoThumbnail: Story = {
  args: { thumbnail: "", duration: "" },
};

export const NoSource: Story = {
  args: { source: "", "video-id": "", thumbnail: "", duration: "" },
};
