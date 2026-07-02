/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  test: {
    // Test file patterns
    include: ["src/**/*.test.ts"],

    // Suppress known noisy browser-test stderr logs while preserving real failures.
    onConsoleLog(log, type) {
      const trimmedLog = log.trim();
      const isNoisyStderr = type === "stderr";
      const isUnknownTestBanner = trimmedLog === "unknown test";
      const isLitDevModeBanner = trimmedLog.includes("Lit is in dev mode. Not recommended for production!");

      if (isNoisyStderr && (isUnknownTestBanner || isLitDevModeBanner)) {
        return false;
      }

      return true;
    },

    // Browser mode configuration for web components
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      screenshotFailures: false,
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
      exclude: ["src/**/*.test.ts", "src/**/*.stories.ts", "src/**/*.d.ts"],
    },
  },
});
