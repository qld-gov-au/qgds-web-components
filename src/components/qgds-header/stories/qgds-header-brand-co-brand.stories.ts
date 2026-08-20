import type { Meta } from "@storybook/web-components";

import {
  CoatOfArmsAndBrandLogo,
  CoatOfArmsAndSiteName,
  headerBrandParameters,
} from "./qgds-header-brand.stories";

export { CoatOfArmsAndBrandLogo, CoatOfArmsAndSiteName };

export default {
  title: "Components/Header/Brands/03 Co-Brand",
  component: "qgds-header",
  parameters: headerBrandParameters,
} satisfies Meta;
