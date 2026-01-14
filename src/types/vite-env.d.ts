/// <reference types="vite/client" />

// Declare SCSS imports with ?inline suffix
declare module "*.scss?inline" {
  const content: string;
  export default content;
}

// Also support regular SCSS imports (without ?inline)
declare module "*.scss" {
  const content: string;
  export default content;
}

// Optional: CSS imports
declare module "*.css?inline" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const content: string;
  export default content;
}
