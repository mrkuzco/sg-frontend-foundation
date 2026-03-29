// MyStore theme — run `pnpm figma` to regenerate from Figma
//
// For Tailwind: import the CSS file in your app's index.css:
//   @import "path/to/generated/design-token-theme.css";
//
// TS exports below are for programmatic access when needed.

// Base color palettes
export { tokens as baseColors } from "./generated/design-token-variables-Base-Colors";

// Spacing, border-radius, typeface sizes
export { tokens as utilities } from "./generated/design-token-variables-Utilities-&-Typefaces";

// Typography styles (all groups exported)
export * from "./generated/design-token-styles-typography";

// Shadows and gradients
export { boxShadow, gradient } from "./generated/design-token-styles-effects";
