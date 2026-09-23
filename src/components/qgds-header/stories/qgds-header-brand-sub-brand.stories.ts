import type { Meta, StoryObj } from "@storybook/web-components";

import {
  CoatOfArmsAndSiteName as CoatOfArmsAndSiteNameStory,
  headerBrandParameters,
} from "./qgds-header-brand-story-definitions";

export const CoatOfArmsAndSiteName: StoryObj = {
  ...CoatOfArmsAndSiteNameStory,
};

export default {
  title: "Components/Header/Brands/Sub-Brand",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
