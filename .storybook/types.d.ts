// Type declarations for Storybook configuration

// Allow JSON imports (for custom-elements.json)
declare module "*.json" {
  const value: unknown;
  export default value;
}
