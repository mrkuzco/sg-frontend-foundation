// MyStore theme — run `pnpm figma` to regenerate from Figma
//
// For Tailwind: import the CSS file in your app's index.css:
//   @import "@sg-foundation/ui/src/themes/mystore/generated/design-token-theme.css";
//
// This gives you all colors, semantic tokens (light/dark), spacing,
// shadows, and gradients as Tailwind utilities.
//
// The TS exports below are for programmatic access in JS/TS when needed.

// Base color palettes (for JS access)
export { tokens as baseColors } from "./generated/design-token-variables-Base-Colors";

// Spacing, border-radius, typeface sizes (for JS access)
export { tokens as utilities } from "./generated/design-token-variables-Utilities-&-Typefaces";

// Typography styles per breakpoint (for JS access)
export { fontFamily, fontSize, desktop, tablet, mobile, button } from "./generated/design-token-styles-typography";

// Shadows and gradients (for JS access)
export { boxShadow, gradient } from "./generated/design-token-styles-effects";
