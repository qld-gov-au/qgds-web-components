import type { Meta, StoryObj } from "@storybook/web-components";

import {
  CoatOfArmsAndBrandLogo as CoatOfArmsAndBrandLogoStory,
  CoatOfArmsAndSiteName as CoatOfArmsAndSiteNameStory,
  headerBrandParameters,
} from "./qgds-header-story-definitions";

export const CoatOfArmsAndBrandLogo: StoryObj = {
  ...CoatOfArmsAndBrandLogoStory,
};

export const CoatOfArmsAndSiteName: StoryObj = {
  ...CoatOfArmsAndSiteNameStory,
};

export default {
  title: "Components/Header/Brands/Co-brand",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
