/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  test: {
    // Test file patterns
    include: ["src/**/*.test.ts"],

    // Browser mode configuration for web components
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: [
        {
          browser: "chromium",
        },
      ],
    },

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.stories.ts",
        "src/**/*.d.ts",
      ],
    },
  },
});
