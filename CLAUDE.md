# sg-frontend-foundation — AI Development Setup

This is the primary context file for AI agents working in this monorepo.
Read this entire file before performing any task.

---

## What this repo is

A pnpm monorepo that builds Salling Group's frontend design system and the MyStore application.
The structure is an **agent-optimized architecture** — all patterns are deliberately predictable
so AI agents can build, validate and maintain code autonomously and in parallel.

---

## Package responsibilities

| Package | Responsibility |
|---|---|
| `packages/ui-web` | React components, CVA styles, design token themes |
| `packages/icons` | Auto-generated Material Symbol icons |
| `packages/figma-design-tokens` | Figma API → CSS/TS token pipeline |
| `packages/hooks` | Shared React hooks |
| `packages/types` | Shared TypeScript types |
| `packages/api` | API client factory |
| `apps/web/mystore` | MyStore React application |

---

## Absolute rules — must never be broken

These rules apply to all code across the entire monorepo. An agent that breaks them must stop
and report the error rather than continuing.

### Design tokens
- **Never** hardcode colors: no `#hex`, `rgb()`, `rgba()`, `hsl()`
- **Always** use CSS custom properties from `design-token-theme.css`:
  `var(--color-surface-primary)`, `var(--shadow-shadow-down-md)` etc.
- **Never** use Tailwind utility classes for colors like `bg-white`, `text-gray-900`
- **Always** use token references like `bg-[var(--color-surface-lightest)]`
- Spacing and border-radius follow the same rule: `var(--spacing-4)`, `var(--radius-md)`

### Component structure
All components in `packages/ui-web/src/components/` follow this file pattern:

```
UIComponent/
  UIComponent.tsx        — component with forwardRef
  UIComponent.styles.ts  — CVA variants and styling
  UIComponent.types.ts   — props interface
  UIComponent.stories.ts — Storybook stories
  index.ts               — barrel export
```

No exceptions. A component with 3 files is not complete.

### TypeScript
- Props interfaces live **only** in `.types.ts` — never inline in `.tsx`
- `forwardRef` is mandatory on all DOM components
- No `any` — use `unknown` and type guards

### CVA
- All variants are defined with `cva()` in `.styles.ts`
- No inline conditionals: `cn(isActive ? 'a' : 'b')` is not allowed
- `cn()` from `packages/ui-web/src/utils/cn.ts` is the only way to merge classes

### Generated files
These files must **never** be edited manually:
- `packages/ui-web/src/themes/mystore/generated/*`
- `packages/icons/src/generated/icons.ts`

Run `pnpm figma` or `pnpm --filter @sg-foundation/icons generate` to regenerate.

---

## Component pattern — complete example

Use this as a template when building new components. Replace `UICard` with the component name.

### UIComponent.types.ts
```ts
import { type HTMLAttributes, type ReactNode } from "react";

export interface IUIComponentProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}
```

### UIComponent.styles.ts
```ts
import { cva } from "class-variance-authority";

export const componentVariants = cva(
  "rounded-[var(--radius-lg)] transition-all duration-150 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-surface-lighter)]",
        elevated: "bg-[var(--color-surface-lightest)] shadow-[var(--shadow-shadow-down-md)]",
        outlined: "bg-transparent border border-[var(--color-border-subtle)]",
      },
      size: {
        sm: "p-[var(--spacing-3)]",
        md: "p-[var(--spacing-6)]",
        lg: "p-[var(--spacing-8)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
```

### UIComponent.tsx
```tsx
import { forwardRef } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type { IUIComponentProps } from "./UIComponent.types";
import { componentVariants } from "./UIComponent.styles";

export const UIComponent = forwardRef<
  HTMLDivElement,
  IUIComponentProps & VariantProps<typeof componentVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(componentVariants({ variant, size }), className)}
    {...props}
  >
    {children}
  </div>
));

UIComponent.displayName = "UIComponent";
export { componentVariants };
```

### index.ts
```ts
export { UIComponent, componentVariants } from "./UIComponent";
export type { IUIComponentProps } from "./UIComponent.types";
```

### UIComponent.stories.ts
See the Storybook section below.

---

## Storybook

Storybook is the primary place where components are reviewed — by developers and designers.
All components must have stories covering all combinations of variants and states.

### Story structure
```ts
import type { Meta, StoryObj } from "@storybook/react";
import { UIComponent } from "./UIComponent";

const meta: Meta<typeof UIComponent> = {
  title: "Components/UIComponent",
  component: UIComponent,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "elevated", "outlined"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof UIComponent>;

// Default state
export const Default: Story = {
  args: {
    variant: "default",
    size: "md",
    children: "Content here",
  },
};

// All variants side by side
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
      <UIComponent variant="default">Default</UIComponent>
      <UIComponent variant="elevated">Elevated</UIComponent>
      <UIComponent variant="outlined">Outlined</UIComponent>
    </div>
  ),
};

// All sizes
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
      <UIComponent size="sm">Small</UIComponent>
      <UIComponent size="md">Medium</UIComponent>
      <UIComponent size="lg">Large</UIComponent>
    </div>
  ),
};
```

### What stories must always include
1. `Default` — one story with args controls enabled
2. `AllVariants` — all variants side by side
3. `AllSizes` — all sizes side by side
4. `DarkMode` — explicit dark mode preview (use Storybook backgrounds addon)
5. Any interactive states: `Disabled`, `Loading`, `WithIcon` etc.

---

## Agent architecture

This repo uses a Minions-inspired setup with an orchestrator and specialized agents
running in parallel. Each agent has one narrow job and returns verifiable output.

### The orchestrator
Takes an input (Figma node ID or component name), calls Figma MCP for spec,
spawns the 5 agents in parallel and assembles output into a PR.

```
Input: figma:vn9H7ncA03gyiMWuQMAAHV/123:456
          ↓
    Orchestrator
    /   |   |   |   \
Code Token Test Story Docs
    \   |   |   |   /
         Pull Request
```

### Agent 1 — Code agent
**Input:** Component spec (name, variants, sizes, props, tokens used)
**Output:** All 4 core files (`.tsx`, `.styles.ts`, `.types.ts`, `index.ts`)
**Fails if:** Rules in "Absolute rules" are broken

### Agent 2 — Token agent
**Input:** The generated code files
**Output:** `APPROVED` or list of violations with filename and line number
**Fails if:** Any file contains hardcoded colors, spacing or shadows
**Example error output:**
```
ERROR: UICard.styles.ts:8 — "bg-white" should be "bg-[var(--color-surface-lightest)]"
ERROR: UICard.styles.ts:14 — "shadow-md" should be "shadow-[var(--shadow-shadow-down-md)]"
```

### Agent 3 — Test agent
**Input:** `.types.ts` and `.styles.ts`
**Output:** `UIComponent.test.tsx` with render tests for all variants and states
**Requirement:** Tests that the component renders without errors for all variant combinations

### Agent 4 — Story agent
**Input:** `.types.ts` and `.styles.ts`
**Output:** `UIComponent.stories.ts` covering Default, AllVariants, AllSizes and relevant states
**Requirement:** Stories must match exactly the variants and sizes defined in `.styles.ts`

### Agent 5 — Docs agent
**Input:** Component name and exported interface
**Output:** Updated `packages/ui-web/src/index.ts` with new component export
**Requirement:** Always export both component, variants and type

---

## Figma MCP integration

Figma is the primary source of component specifications. Agents read Figma directly
rather than getting components described in words.

### Configuration
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["@figma/mcp-server"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_API_TOKEN}"
      }
    }
  }
}
```

### Figma file
MyStore 2.0 design system: `vn9H7ncA03gyiMWuQMAAHV`
URL: `https://www.figma.com/design/vn9H7ncA03gyiMWuQMAAHV/MyStore---2.0`

### What Figma MCP returns
- Component name and description
- All variants and their properties
- Which design tokens are used on the node
- Component size and spacing

### Workflow
```
pnpm build-component figma:NODE_ID

1. Fetch spec from Figma via MCP
2. Map Figma tokens to CSS custom properties
3. Spawn 5 agents in parallel
4. Validate output from all agents
5. Create PR with automatic description
```

---

## Build plan — phases

### Phase 1 — Foundation (Week 1)
No agents work without this foundation in place.

- [ ] This CLAUDE.md in the root of the monorepo
- [ ] `packages/ui-web/CLAUDE.md` — component rules in detail
- [ ] `packages/icons/CLAUDE.md` — icon pipeline rules
- [ ] `packages/figma-design-tokens/CLAUDE.md` — token pipeline rules
- [ ] Install and configure Storybook in `packages/ui-web`
- [ ] Write stories for the three existing components (UIButton, UITextButton, UIIconButton)
- [ ] Verify that all existing components follow the canonical file pattern

### Phase 2 — Figma MCP (Week 2)
Agents read Figma directly — no manual spec descriptions.

- [ ] Configure Figma MCP server with existing `FIGMA_API_TOKEN`
- [ ] Test MCP connection against the UIButton node in Figma
- [ ] Verify that the agent can read variants, sizes and tokens autonomously
- [ ] Write Figma-to-spec prompt that returns structured component spec
- [ ] Test spec output against one new component manually

### Phase 3 — The five agents (Week 2–3)
Build and test one agent at a time, in isolation, before combining them.

- [ ] Code agent — generate all 4 core files from spec
- [ ] Token agent — validate no hardcoded values
- [ ] Test agent — generate render tests from types and styles
- [ ] Story agent — generate Storybook stories from types and styles
- [ ] Docs agent — update index.ts barrel export
- [ ] Test each agent in isolation with UICard as test component

### Phase 4 — Orchestrator (Week 3–4)
One command from Figma node ID to finished PR.

- [ ] Build orchestrator script that spawns all 5 agents in parallel
- [ ] Implement error handling — one failing agent stops PR creation
- [ ] Write automatic PR template with Figma link and token overview
- [ ] Test end-to-end with 3 new components from Figma

### Phase 5 — CI/CD (Week 4)
Rules are enforced automatically on all PRs, not just agent-generated ones.

- [ ] GitHub Action: token validation on all PRs
- [ ] GitHub Action: Figma sync — automatic PR when tokens change in Figma
- [ ] GitHub Action: component structure check — all 5 files present
- [ ] Storybook deploy to static hosting on PRs
- [ ] Configure Storybook chromatic or equivalent for visual regression

---

## Token pipeline

Design tokens are generated from Figma and must never be edited manually.

```bash
pnpm figma          # Regenerate all tokens from Figma
```

### What pnpm figma does
1. Fetches variable collections from the Figma API
2. Fetches text styles, effect styles and fill styles
3. Generates `design-token-theme.css` with `@theme` for Tailwind v4
4. Generates TypeScript files with tokens as objects

### Generated files (never edit manually)
```
packages/ui-web/src/themes/mystore/generated/
  design-token-theme.css              — CSS custom properties, Tailwind @theme
  design-token-variables-Base-Colors.ts
  design-token-variables-Utilities-&-Typefaces.ts
  design-token-styles-typography.ts
  design-token-styles-effects.ts
```

### Figma collections
| Collection ID | Content |
|---|---|
| `VariableCollectionId:17:1812` | Base Colors |
| `VariableCollectionId:34:1192` | Utilities & Typefaces |
| `VariableCollectionId:18:2407` | Semantic Colors (Light/Dark) |

---

## Icon pipeline

Icons are fetched from Google Material Symbols and must never be edited manually.

```bash
pnpm --filter @sg-foundation/icons generate    # Fetch and generate icons
```

### Add a new icon
Only edit `packages/icons/src/generate.ts` — add the name to the `ICONS` object:
```ts
const ICONS: Record<string, string> = {
  my_new_icon: "material_symbol_name",  // Add here
  // ...
};
```

Then run the `generate` script. `icons.ts` will be updated automatically.

### Naming
- Figma name → PascalCase with `Icon` prefix
- `arrow_forward` → `IconArrowForward`
- `check_circle` → `IconCheckCircle`

---

## Existing components

These three components are the canonical example of correct implementation.
Use them as reference — not documentation, but actual code.

| Component | Variants | Sizes | Special props |
|---|---|---|---|
| `UIButton` | primary, secondary, tertiary | lg, sm | floating, leadingIcon, trailingIcon, isLoading |
| `UITextButton` | — | lg, sm | leadingIcon, trailingIcon |
| `UIIconButton` | primary, secondary, tertiary | lg, md, sm | icon (required) |

---

## Folder structure

```
sg-frontend-foundation/
├── CLAUDE.md                          ← this file
├── packages/
│   ├── ui-web/
│   │   ├── CLAUDE.md                 ← component rules (phase 1)
│   │   └── src/
│   │       ├── components/
│   │       │   ├── UIButton/
│   │       │   ├── UITextButton/
│   │       │   └── UIIconButton/
│   │       ├── themes/mystore/
│   │       │   └── generated/        ← never edit
│   │       └── utils/cn.ts
│   ├── icons/
│   │   ├── CLAUDE.md                 ← icon pipeline rules (phase 1)
│   │   └── src/
│   │       ├── generate.ts           ← only edit here for new icons
│   │       └── generated/icons.ts   ← never edit
│   └── figma-design-tokens/
│       ├── CLAUDE.md                 ← token pipeline rules (phase 1)
│       └── src/
│           └── configs/mystore.ts   ← Figma configuration
└── apps/web/mystore/                 ← MyStore application
```

---

## Command overview

```bash
pnpm dev                    # Start all apps in dev mode
pnpm build                  # Build the entire monorepo
pnpm figma                  # Regenerate design tokens from Figma
pnpm --filter @sg-foundation/icons generate   # Regenerate icons

# Phase 4 (when orchestrator is built):
pnpm build-component figma:NODE_ID            # Build component from Figma node
pnpm build-component UICard                   # Build component from name
```

---

## What agents must never do

- Edit files in `*/generated/*`
- Write hardcoded colors, spacing or shadows
- Add props directly in `.tsx` — they belong in `.types.ts`
- Skip a file in the component pattern — all 5 files are mandatory
- Use `any` as a type
- Import from a package not listed in the relevant `package.json`
- Commit directly to main — all code goes via PR

---

*Last updated: March 2026*
*Maintained manually — update when the architecture changes*
