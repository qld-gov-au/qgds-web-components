import type { Meta } from "@storybook/web-components";

import { CoatOfArms, headerBrandParameters } from "./qgds-header-brand.stories";

export { CoatOfArms };

export default {
  title: "Components/Header/Brands/01 MasterBrand",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
