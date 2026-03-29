# @sg-foundation/figma-design-tokens

Fetches design tokens (variables + styles) from Figma and generates:
- **CSS theme file** with `@theme` for Tailwind v4 (light/dark mode)
- **TypeScript files** for programmatic JS access

Based on `@salling-group/figma-design-tokens`.

## Setup

1. Create a Figma personal access token at https://www.figma.com/settings
   - Scopes: `file_content:read`, `file_variables:read`, `library_content:read`
2. Add to `.env` in the monorepo root:
   ```
   FIGMA_API_TOKEN=figd_xxx
   ```

## Usage

```bash
pnpm figma        # Generate all themes
```

## Adding a new theme

1. Create a config: `src/configs/<theme-name>.ts` (copy `mystore.ts` as template)
2. Point it at your Figma file ID and collection IDs
3. Set `distFolder` to `../ui/src/themes/<theme-name>/generated`
4. Add script: `"generate:<theme-name>": "tsx src/configs/<theme-name>.ts"`
5. Create `packages/ui/src/themes/<theme-name>/index.ts` with re-exports
6. Add to `packages/ui/src/themes/index.ts`
7. In your app CSS: `@import "@sg-foundation/ui/src/themes/<theme-name>/generated/design-token-theme.css"`

## Generated files

| File | Content |
|------|---------|
| `design-token-theme.css` | CSS custom properties for Tailwind v4 (colors, semantic light/dark, typography, shadows, gradients, spacing) |
| `design-token-variables-*.ts` | Base colors and utilities as TypeScript objects |
| `design-token-styles-typography.ts` | Typography per breakpoint (Desktop/Tablet/Mobile/Button) |
| `design-token-styles-effects.ts` | Shadows and gradients as TypeScript objects |
