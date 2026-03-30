# @sg-foundation/figma-design-tokens — Token Pipeline Rules

## What this package does

Fetches design tokens from Figma and generates:
- **CSS theme file** — `@theme` for Tailwind v4 with light/dark mode
- **TypeScript files** — for programmatic access

## One command

```bash
pnpm figma
```

This runs `src/configs/mystore.ts` which:
1. Fetches variable collections (colors, spacing, utilities)
2. Fetches styles (typography, effects, gradients) via two-step REST API
3. Generates CSS with `@theme` block + `.dark` overrides
4. Outputs everything to `packages/ui-web/src/themes/mystore/generated/`

## Generated files — never edit

All files in `packages/ui-web/src/themes/mystore/generated/` are auto-generated.

## Config

`src/configs/mystore.ts` defines:
- Figma file ID
- Which variable collections to fetch
- Style patterns to match (text, effect, fill)
- Which collections are semantic (light/dark) vs base

## Adding a new theme

1. Create `src/configs/<theme>.ts` (copy mystore.ts)
2. Change the Figma file ID and collection IDs
3. Set `distFolder` to `../ui-web/src/themes/<theme>/generated`
4. Add script to `package.json`: `"generate:<theme>": "tsx src/configs/<theme>.ts"`
5. Create `packages/ui-web/src/themes/<theme>/index.ts`

## Figma API token

Stored in `.env` at monorepo root (never committed):
```
FIGMA_API_TOKEN=figd_xxx
```

Required scopes: `file_content:read`, `file_variables:read`, `library_content:read`

## CSS output structure

```css
@theme {
  --color-primary-500: #006788;     /* Base colors */
  --color-surface-primary: #006788; /* Semantic (light default) */
  --text-btn-pill-lg: 14px;         /* Typography */
  --shadow-shadow-down-md: ...;     /* Shadows */
  --gradient-gradient-linear100: ...; /* Gradients */
  --spacing-4: 16px;                /* Spacing */
  --radius-lg: 12px;                /* Border radius */
  --font-sans: "Roboto", sans-serif; /* Font */
}

.dark {
  --color-surface-primary: #c4dde4; /* Dark overrides */
}
```

## Key features added to the original sg-frontend package

- `fetchStyles` — fetches text/effect/fill styles via two-step REST API
- `generateCSS` — outputs Tailwind v4 CSS theme with light/dark mode
- Removed `hiddenFromPublishing` skip for remote collections
