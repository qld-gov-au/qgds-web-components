import type { Meta, StoryObj } from "@storybook/web-components";

import {
  BrandLogoAndSiteName as BrandLogoAndSiteNameStory,
  BrandLogoAndSiteNameDesktop as BrandLogoAndSiteNameDesktopStory,
  headerBrandParameters,
} from "./qgds-header-brand-story-definitions";

export const Desktop: StoryObj = {
  ...BrandLogoAndSiteNameDesktopStory,
  globals: {
    viewport: "LG",
  },
};

export const Mobile: StoryObj = {
  ...BrandLogoAndSiteNameStory,
  globals: {
    viewport: "MD",
  },
};

export default {
  title: "Components/Header/Brands/Stand Alone/Brand Logo And Site Name",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
