import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import "./qgds-video.js";
import "../qgds-video-player/qgds-video-player.js";
import type { QGDSVideo } from "./qgds-video.js";

const { args, argTypes, template } = getStorybookHelpers<QGDSVideo>("qgds-video");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Video",
  component: "qgds-video",
  tags: ["autodocs"],
  args: {
    ...args,
    source: "youtube",
    "video-id": "LDU_Txk06tM",
    thumbnail: "https://img.youtube.com/vi/LDU_Txk06tM/sddefault.jpg",
    duration: "3:12",
    "aspect-ratio": "16x9",
    caption: "Caption text goes here",
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

/** Default YouTube embed with thumbnail + duration nav. */
export const YouTube: Story = {};

/** Vimeo embed using the Vimeo player URL. */
export const Vimeo: Story = {
  args: {
    source: "vimeo",
    "video-id": "251763826",
    thumbnail: "https://picsum.photos/seed/qgds-vimeo/1280/720",
    duration: "5:00",
    "aspect-ratio": "4x3",
    caption: "Vimeo video embed example.",
  },
};

/** Custom provider — `video-id` is treated as the full iframe URL. */
export const Custom: Story = {
  args: {
    source: "custom",
    "video-id": "https://embed.ted.com/talks/lang/en/adam_grosser_a_mobile_fridge_for_vaccines",
    thumbnail: "https://picsum.photos/seed/qgds-custom/1280/720",
    duration: "3:17",
    caption: "Custom iframe video embed example.",
  },
};

/** No thumbnail provided — iframe loads directly. */
export const NoThumbnail: Story = {
  args: {
    thumbnail: "",
    duration: "",
    caption: "When no thumbnail is set, the iframe loads immediately with no play overlay.",
  },
};

/** Placeholder state shown when no source or video-id is supplied. */
export const NoSource: Story = {
  args: {
    source: "",
    "video-id": "",
    thumbnail: "",
    duration: "",
    caption: "Placeholder shown when the consumer has not configured a video source.",
  },
};

/** Replace the default player via the `player` slot — useful when the player is shared with a Card. */
export const PlayerSlot: Story = {
  render: (args) => html`
    <qgds-video caption=${args.caption ?? "Caption text goes here"}>
      <qgds-video-player
        slot="player"
        source="youtube"
        video-id="LDU_Txk06tM"
        thumbnail="https://img.youtube.com/vi/LDU_Txk06tM/sddefault.jpg"
        duration="3:12"
      ></qgds-video-player>
    </qgds-video>
  `,
};

/** With an expandable transcript using the built-in disclosure. */
export const WithTranscript: Story = {
  render: (args) => html`
    <qgds-video
      source=${args.source ?? "youtube"}
      video-id=${args["video-id"] ?? "LDU_Txk06tM"}
      thumbnail=${args.thumbnail ?? ""}
      duration=${args.duration ?? ""}
      aspect-ratio=${args["aspect-ratio"] ?? "16x9"}
      caption=${args.caption ?? "Caption text goes here"}
    >
      <div slot="transcript">
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere,
          magna sed pulvinar ultricies.
        </p>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra
          nonummy pede.
        </p>
      </div>
    </qgds-video>
  `,
};
