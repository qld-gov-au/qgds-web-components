// Type declarations for Storybook configuration

// Allow JSON imports (for custom-elements.json)
declare module "*.json" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any;
  export default value;
}
