# @sg-foundation/ui-web — Component Rules

## File pattern

Every component must have exactly 5 files:

```
UIComponent/
  UIComponent.tsx          — component with forwardRef
  UIComponent.styles.ts    — CVA variants
  UIComponent.types.ts     — props interface (IUIComponentProps)
  UIComponent.stories.tsx   — Storybook stories
  index.ts                 — barrel export
```

## Naming

- Component: `UIComponent` (always `UI` prefix)
- Props interface: `IUIComponentProps` (always `I` prefix + `Props` suffix)
- CVA variants: `componentVariants`
- Story title: `Category/UIComponent` (e.g. `Buttons/UIButton`, `Inputs/UIInput`)

## Storybook categories

| Category | What belongs here |
|---|---|
| Buttons | UIButton, UITextButton, UIIconButton |
| Inputs | UIInput, UISelect, UITextArea, UIDatePicker, UICheckbox |
| Data Display | UITable, UIBadge, UICard, UIList |
| Navigation | UISidebar, UITabs, UIBreadcrumb, UIPagination |
| Feedback | UIAlert, UIModal, UIToast, UISpinner |
| Surfaces | UIDrawer, UIPanel, UIAccordion |
| Layout | UIGrid, UIDivider, UIStack |

## Style rules

- All colors via CSS variables: `var(--color-surface-primary)`
- All shadows via CSS variables: `var(--shadow-shadow-down-md)`
- All spacing via CSS variables: `var(--spacing-4)`
- Font sizes from text style tokens: `var(--text-btn-pill-lg)`
- `cn()` is the only way to merge classes
- No inline conditionals: `cn(isX ? 'a' : 'b')` — use CVA variants
- `disabled:pointer-events-none` on all interactive components

## Stories must include

1. `Default` — with args controls
2. `AllVariants` — side by side
3. `AllSizes` — side by side
4. `Disabled` — if applicable
5. `Loading` — if applicable
6. Any other relevant states

## Imports

```ts
// Components import from within ui-web
import { cn } from "../../utils/cn";

// Icons are a separate package
import { IconAdd } from "@sg-foundation/icons";
```
