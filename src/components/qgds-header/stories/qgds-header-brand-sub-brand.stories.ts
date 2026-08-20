import type { Meta } from "@storybook/web-components";

import { CoatOfArmsAndSiteName, headerBrandParameters } from "./qgds-header-brand.stories";

export { CoatOfArmsAndSiteName };

export default {
  title: "Components/Header/Brands/02 Sub-Brand",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
