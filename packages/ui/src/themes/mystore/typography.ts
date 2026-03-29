// Auto-generated from Figma — do not edit manually
// Run: FIGMA_TOKEN=xxx pnpm sync-tokens

export const fontFamily = {
  sans: ["Roboto", "sans-serif"],
} as const;

type FontEntry = [string, { lineHeight: string; letterSpacing: string; fontWeight: string }];

function entry(size: number, lh: number, weight: number, ls: number): FontEntry {
  return [`${size}px`, {
    lineHeight: `${lh}px`,
    letterSpacing: ls ? `${ls}em` : "0",
    fontWeight: String(weight),
  }];
}

// Desktop
export const desktop = {
  "display-lg": entry(72, 80, 700, 0),
  "display-lg-light": entry(72, 80, 300, 0),
  "display-md": entry(56, 64, 700, 0),
  "display-md-light": entry(56, 64, 300, 0),
  "display-sm": entry(40, 48, 700, 0),
  "display-sm-light": entry(40, 48, 300, 0),
  "display-xs": entry(28, 36, 700, 0),
  "display-xs-light": entry(28, 36, 300, 0),
  "title-lg": entry(18, 26, 600, 0),
  "title-md": entry(16, 22, 600, 0),
  "title-sm": entry(14, 20, 600, 0),
  "title-xs": entry(12, 16, 400, 0.024),
  "body-lg": entry(18, 26, 400, 0),
  "body-md": entry(16, 22, 400, 0),
  "body-sm": entry(14, 20, 400, 0),
  "body-xs": entry(12, 16, 400, 0.024),
  "labels-md": entry(14, 20, 500, 0),
  "labels-sm": entry(12, 16, 400, 0),
} as const;

// Tablet
export const tablet = {
  "display-lg": entry(64, 72, 700, 0),
  "display-lg-light": entry(64, 72, 300, 0),
  "display-md": entry(48, 56, 700, 0),
  "display-md-light": entry(48, 56, 300, 0),
  "display-sm": entry(36, 44, 700, 0),
  "display-sm-light": entry(36, 44, 300, 0),
  "display-xs": entry(28, 36, 700, 0),
  "display-xs-light": entry(28, 36, 300, 0),
  "title-lg": entry(18, 26, 600, 0),
  "title-md": entry(16, 22, 600, 0),
  "title-sm": entry(14, 20, 600, 0),
  "title-xs": entry(12, 16, 600, 0.024),
  "body-lg": entry(18, 26, 400, 0),
  "body-md": entry(16, 22, 400, 0),
  "body-sm": entry(14, 20, 400, 0),
  "body-xs": entry(12, 16, 400, 0.024),
  "labels-md": entry(14, 20, 500, 0),
  "labels-sm": entry(12, 16, 400, 0),
} as const;

// Mobile
export const mobile = {
  "display-lg": entry(48, 52, 700, 0),
  "display-lg-light": entry(48, 56, 300, 0),
  "display-md": entry(36, 44, 700, 0),
  "display-md-light": entry(36, 44, 300, 0),
  "display-sm": entry(28, 36, 700, 0),
  "display-sm-light": entry(28, 36, 300, 0),
  "display-xs": entry(24, 32, 700, 0),
  "display-xs-light": entry(24, 32, 300, 0),
  "title-lg": entry(16, 22, 600, 0),
  "title-md": entry(16, 22, 600, 0),
  "title-sm": entry(14, 20, 600, 0),
  "title-xs": entry(12, 16, 600, 0.024),
  "body-lg": entry(16, 22, 400, 0),
  "body-md": entry(16, 22, 400, 0),
  "body-sm": entry(14, 20, 400, 0),
  "body-xs": entry(12, 16, 400, 0.024),
  "labels-md": entry(16, 24, 400, 0),
  "labels-sm": entry(12, 16, 400, 0),
  "input-line": entry(20, 28, 400, 0),
} as const;

// Default export is desktop
export const fontSize = desktop;
