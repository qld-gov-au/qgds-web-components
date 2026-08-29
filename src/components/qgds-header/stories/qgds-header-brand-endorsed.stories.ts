import type { Meta, StoryObj } from "@storybook/web-components";

import {
  BrandLogoOnly as BrandLogoOnlyStory,
  BrandLogoAndSiteNameOneRowBrandLogoTop as BrandLogoAndSiteNameOneRowBrandLogoTopStory,
  BrandLogoAndSiteNameOneRowSiteNameTop as BrandLogoAndSiteNameOneRowSiteNameTopStory,
  BrandLogoAndSiteNameOneRowSiteUrlTop as BrandLogoAndSiteNameOneRowSiteUrlTopStory,
  BrandLogoAndSiteNameTwoRowsBrandLogoTop as BrandLogoAndSiteNameTwoRowsBrandLogoTopStory,
  BrandLogoAndSiteNameTwoRowsSiteNameTop as BrandLogoAndSiteNameTwoRowsSiteNameTopStory,
  headerBrandParameters,
} from "./qgds-header-brand-story-definitions";

export const BrandLogoOnly: StoryObj = {
  ...BrandLogoOnlyStory,
  name: "Brand logo only",
};

export const BrandLogoAndSiteNameTwoRowsSiteNameTop: StoryObj = {
  ...BrandLogoAndSiteNameTwoRowsSiteNameTopStory,
  name: "Two mobile rows - Site name first",
};

export const BrandLogoAndSiteNameTwoRowsBrandLogoTop: StoryObj = {
  ...BrandLogoAndSiteNameTwoRowsBrandLogoTopStory,
  name: "Two mobile rows - Brand logo first",
};

export const BrandLogoAndSiteNameOneRowSiteNameTop: StoryObj = {
  ...BrandLogoAndSiteNameOneRowSiteNameTopStory,
  name: "One mobile row - Site name",
};

export const BrandLogoAndSiteNameOneRowBrandLogoTop: StoryObj = {
  ...BrandLogoAndSiteNameOneRowBrandLogoTopStory,
  name: "One mobile row - Brand logo",
};

export const BrandLogoAndSiteNameOneRowSiteUrlTop: StoryObj = {
  ...BrandLogoAndSiteNameOneRowSiteUrlTopStory,
  name: "One mobile row - Site URL",
};

export default {
  title: "Components/Header/Brands/Endorsed",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
