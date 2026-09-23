import type { Meta, StoryObj } from "@storybook/web-components";

import {
  BrandLogoOnlyDesktop as BrandLogoOnlyDesktopStory,
  BrandLogoOnlyMobile as BrandLogoOnlyMobileStory,
  headerBrandParameters,
} from "./qgds-header-brand-story-definitions";

export const Desktop: StoryObj = {
  ...BrandLogoOnlyDesktopStory,
  globals: {
    viewport: "LG",
  },
};

export const Mobile: StoryObj = {
  ...BrandLogoOnlyMobileStory,
  globals: {
    viewport: "MD",
  },
};

export default {
  title: "Components/Header/Brands/Stand Alone/Brand Logo Only",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
