# @sg-foundation/icons — Icon Pipeline Rules

## Source

Google Material Symbols — Rounded, Weight 300, Optical Size 24dp.
Downloaded from Google Fonts API at generate time.

## Generated files — never edit

`src/generated/icons.ts` is auto-generated. Never edit it directly.

## Adding a new icon

1. Edit `src/generate.ts`
2. Add to the `ICONS` object:
   ```ts
   const ICONS: Record<string, string> = {
     my_icon: "material_symbol_name",  // Figma name: material name
   };
   ```
3. Run: `pnpm --filter @sg-foundation/icons generate`

## Naming convention

| Figma name | Material name | Component name |
|---|---|---|
| `arrow_forward` | `arrow_forward` | `IconArrowForward` |
| `chevron_back` | `chevron_backward` | `IconChevronBack` |
| `filter` | `filter_list` | `IconFilter` |

Rule: Figma name → PascalCase → `Icon` prefix.

## Usage

```tsx
import { IconAdd, IconSearch } from "@sg-foundation/icons";

// Standalone (specify size)
<IconAdd size={24} />

// Inside a button (fills container)
<UIButton leadingIcon={<IconAdd />}>Add</UIButton>
```

## Icon component

`src/UIIcon.tsx` contains `createIcon()` which generates React components from SVG paths.
Icons default to `width="100%" height="100%"` so they fill their container.
Pass `size={24}` for standalone use.

## Find icon names

Browse at: https://fonts.google.com/icons?icon.set=Material+Symbols
Filter: Style=Rounded, Weight=300
