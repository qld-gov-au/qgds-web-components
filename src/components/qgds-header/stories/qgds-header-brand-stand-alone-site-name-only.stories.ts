import type { Meta, StoryObj } from "@storybook/web-components";

import {
  SiteNameOnlyDesktop as SiteNameOnlyDesktopStory,
  SiteNameOnlyMobile as SiteNameOnlyMobileStory,
  headerBrandParameters,
} from "./qgds-header-brand-story-definitions";

export const Desktop: StoryObj = {
  ...SiteNameOnlyDesktopStory,
  globals: {
    viewport: "XL",
  },
};

export const Mobile: StoryObj = {
  ...SiteNameOnlyMobileStory,
  globals: {
    viewport: "MD",
  },
};

export default {
  title: "Components/Header/Brands/Stand Alone/Site Name Only",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
