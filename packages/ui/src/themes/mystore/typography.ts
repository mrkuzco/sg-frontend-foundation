// Auto-generated from Figma styles — do not edit manually
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
  "display-lg/bold": entry(72, 80, 700, 0),
  "display-lg/light-light": entry(72, 80, 300, 0),
  "display-md/bold": entry(56, 64, 700, 0),
  "display-md/light-light": entry(56, 64, 300, 0),
  "display-sm/bold": entry(40, 48, 700, 0),
  "display-sm/light-light": entry(40, 48, 300, 0),
  "display-xs/bold": entry(28, 36, 700, 0),
  "display-xs/light-light": entry(28, 36, 300, 0),
  "title/lg": entry(18, 26, 600, 0),
  "title/md": entry(16, 22, 600, 0),
  "title/sm": entry(14, 20, 600, 0),
  "body/xs": entry(12, 16, 400, 0.024),
  "body/lg": entry(18, 26, 400, 0),
  "body/sm": entry(14, 20, 400, 0),
  "md": entry(14, 20, 500, 0),
  "sm": entry(12, 16, 400, 0),
  "body/md": entry(16, 22, 400, 0),
  "title/xs": entry(12, 16, 600, 0.024),
  "overline": entry(12, 16, 400, 0.72),
} as const;

// Tablet
export const tablet = {
  "display-lg/bold": entry(64, 72, 700, 0),
  "display-lg/light-light": entry(64, 72, 300, 0),
  "display-md/bold": entry(48, 56, 700, 0),
  "display-md/light-light": entry(48, 56, 300, 0),
  "display-sm/bold": entry(36, 44, 700, 0),
  "display-sm/light-light": entry(36, 44, 300, 0),
  "display-xs/bold": entry(28, 36, 700, 0),
  "display-xs/light-light": entry(28, 36, 300, 0),
  "title/lg": entry(18, 26, 600, 0),
  "title/sm": entry(14, 20, 600, 0),
  "title/xs": entry(12, 16, 600, 0.024),
  "md": entry(14, 20, 500, 0),
  "labels/sm": entry(12, 16, 400, 0),
  "button/link-lg": entry(16, 24, 400, 0),
  "sm": entry(12, 16, 400, 0),
  "title/md": entry(16, 22, 600, 0),
  "button/pill": entry(14, 20, 500, 0),
  "button/link-md": entry(14, 20, 400, 0),
  "labels/md": entry(14, 20, 500, 0),
  "body/lg": entry(18, 26, 400, 0),
  "body/md": entry(16, 22, 400, 0),
  "body/sm": entry(14, 20, 400, 0),
  "body/xs": entry(12, 16, 400, 0.024),
} as const;

// Mobile
export const mobile = {
  "display-lg/bold": entry(48, 52, 700, 0),
  "display-lg/light-light": entry(48, 56, 300, 0),
  "display-md/bold": entry(36, 44, 700, 0),
  "display-md/light-light": entry(36, 44, 300, 0),
  "display-sm/bold": entry(28, 36, 700, 0),
  "display-sm/light-light": entry(28, 36, 300, 0),
  "display-xs/bold": entry(24, 32, 700, 0),
  "display-xs/light-light": entry(24, 32, 300, 0),
  "title/md": entry(16, 22, 600, 0),
  "title/lg": entry(16, 22, 600, 0),
  "title/sm": entry(14, 20, 600, 0),
  "title/xs": entry(12, 16, 600, 0.024),
  "body/md": entry(16, 22, 400, 0),
  "body/lg": entry(16, 22, 400, 0),
  "body/sm": entry(14, 20, 400, 0),
  "body/xs": entry(12, 16, 400, 0.024),
  "md": entry(14, 20, 500, 0),
  "sm": entry(12, 16, 400, 0),
  "special/iiput-line": entry(20, 28, 400, 0),
} as const;

// Button
export const button = {
  "pill-lg": entry(14, 20, 500, 0),
  "text-sm": entry(14, 20, 400, 0),
  "pill-sm": entry(12, 16, 500, 0),
  "text-lg": entry(16, 24, 400, 0),
} as const;

// Default export is desktop
export const fontSize = desktop;
