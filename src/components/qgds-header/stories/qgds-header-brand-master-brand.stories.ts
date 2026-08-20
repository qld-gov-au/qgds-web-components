import type { Meta, StoryObj } from "@storybook/web-components";

import {
  CoatOfArms as CoatOfArmsStory,
  CoatOfArmsAndSiteName as CoatOfArmsAndSiteNameStory,
  headerBrandParameters,
} from "./qgds-header-brand-story-definitions";

// Declaring it locally triggers Storybook "startCase" formatting engine
export const CoatOfArms: StoryObj = {
  ...CoatOfArmsStory,
};
export const CoatOfArmsAndSiteName: StoryObj = {
  ...CoatOfArmsAndSiteNameStory,
};

export default {
  title: "Components/Header/Brands/MasterBrand",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
