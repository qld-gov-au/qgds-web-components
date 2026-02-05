// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import litPlugin from "eslint-plugin-lit";
import litA11yPlugin from "eslint-plugin-lit-a11y";
import wcPlugin from "eslint-plugin-wc";

export default tseslint.config(
  // Ignore patterns
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/*.d.ts",
      "**/coverage/**",
      "**/.vite/**",
      "**/build/**",
      "**/*.config.js",
      "**/*.config.ts",
      "**/_archive/**",
      "**/.storybook/**",
      "**/storybook-static/**",
    ],
  },

  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript ESLint recommended rules
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // Global configuration
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // TypeScript files configuration
  {
    files: ["**/*.ts"],
    plugins: {
      lit: litPlugin,
      "lit-a11y": litA11yPlugin,
      wc: wcPlugin,
    },
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      // Allow type annotations on class properties with @property decorator (Lit)
      "@typescript-eslint/no-inferrable-types": "off",

      // Lit recommended rules
      ...litPlugin.configs.recommended.rules,

      // Lit A11y recommended rules
      ...litA11yPlugin.configs.recommended.rules,

      // Web Components recommended rules
      "wc/guard-super-call": "error",
      "wc/no-closed-shadow-root": "error",
      "wc/no-constructor-attributes": "error",
      "wc/no-invalid-element-name": "error",
      "wc/no-self-class": "error",
      "wc/require-listener-teardown": "warn",

      // General best practices
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
    },
  },

  // JavaScript files configuration (e.g., config files)
  {
    files: ["**/*.js", "**/*.mjs"],
    ...tseslint.configs.disableTypeChecked,
  },

  // Vite config file
  {
    files: ["vite.config.ts"],
    rules: {
      "no-console": "off",
    },
  },

  // Specific overrides for web component files
  {
    files: ["src/components/qgds-inpage-nav/*.ts"],
    rules: {
      // Allow qgds-inpage-nav-item child nodes to act as listitems in the render method of qgds-inpage-nav
      "lit-a11y/list": "off",
    },
  },
);
