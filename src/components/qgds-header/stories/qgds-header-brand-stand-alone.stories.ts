import type { Meta } from "@storybook/web-components";

import {
  BrandLogoMobileTopRowLogo,
  BrandLogoTwoMobileRows,
  headerBrandParameters,
} from "./qgds-header-brand.stories";

export { BrandLogoMobileTopRowLogo, BrandLogoTwoMobileRows };

export default {
  title: "Components/Header/Brands/05 StandAlone",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
