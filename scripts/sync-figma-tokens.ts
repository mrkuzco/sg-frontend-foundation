/**
 * Sync design tokens from Figma to TypeScript files.
 *
 * Usage: npx tsx scripts/sync-figma-tokens.ts
 *
 * Requires FIGMA_TOKEN env var or pass as argument:
 *   FIGMA_TOKEN=figd_xxx npx tsx scripts/sync-figma-tokens.ts
 */

const FIGMA_FILE_ID = "vn9H7ncA03gyiMWuQMAAHV";
const TOKEN = process.env.FIGMA_TOKEN || process.argv[2];
const OUTPUT_DIR = "packages/ui/src/themes/mystore";

if (!TOKEN) {
  console.error("Missing FIGMA_TOKEN. Set env var or pass as argument.");
  process.exit(1);
}

async function figmaGet(endpoint: string) {
  const res = await fetch(`https://api.figma.com/v1${endpoint}`, {
    headers: { "X-Figma-Token": TOKEN },
  });
  return res.json();
}

// ── Color helpers ──────────────────────────────────────────────────────────
function toHex(c: { r: number; g: number; b: number; a?: number }, opacity = 1) {
  const r = Math.round(c.r * 255);
  const g = Math.round(c.g * 255);
  const b = Math.round(c.b * 255);
  const a = opacity * (c.a ?? 1);
  if (a < 0.99) return `rgba(${r}, ${g}, ${b}, ${parseFloat(a.toFixed(2))})`;
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function resolveColor(val: any, variables: Record<string, any>, depth = 0): string | null {
  if (depth > 15) return null;
  if (val?.type === "VARIABLE_ALIAS") {
    const ref = variables[val.id];
    if (!ref) return null;
    const firstMode = Object.values(ref.valuesByMode)[0];
    return resolveColor(firstMode, variables, depth + 1);
  }
  if (val?.r !== undefined) return toHex(val, val.a);
  return null;
}

// ── Extract variables (colors, spacing, etc.) ─────────────────────────────
async function extractVariables() {
  console.log("Fetching Figma variables...");
  const data = await figmaGet(`/files/${FIGMA_FILE_ID}/variables/local`);
  const { variableCollections, variables } = data.meta;

  const primitiveColors: Record<string, Record<string, string>> = {};
  const semanticLight: Record<string, Record<string, string>> = {};
  const semanticDark: Record<string, Record<string, string>> = {};
  const spacingTokens: Record<string, number> = {};
  const borderRadiusTokens: Record<string, number> = {};
  const typefaceSizes: Record<string, number> = {};
  const typefaceLineHeights: Record<string, number> = {};

  for (const [cid, col] of Object.entries(variableCollections) as [string, any][]) {
    const modes = Object.fromEntries(col.modes.map((m: any) => [m.modeId, m.name]));
    const modeIds = Object.keys(modes);

    for (const vid of col.variableIds) {
      const v = variables[vid];
      if (!v) continue;
      const name = v.name as string;

      // Primitive colors (Base Colors collection)
      if (v.resolvedType === "COLOR" && col.name === "Base Colors") {
        const parts = name.split("/");
        if (parts.length >= 2) {
          const group = parts[parts.length - 2];
          const shade = parts[parts.length - 1];
          if (!primitiveColors[group]) primitiveColors[group] = {};
          const val = Object.values(v.valuesByMode)[0];
          const hex = resolveColor(val, variables);
          if (hex) primitiveColors[group][shade] = hex;
        }
      }

      // Semantic tokens with Light/Dark
      if (v.resolvedType === "COLOR" && modes[modeIds[0]] === "Light" && modes[modeIds[1]] === "Dark") {
        const lightVal = resolveColor(v.valuesByMode[modeIds[0]], variables);
        const darkVal = resolveColor(v.valuesByMode[modeIds[1]], variables);

        const parts = name.split("/");
        const category = parts[0];
        const key = parts.slice(1).join("-").replace(/\s+/g, "-").toLowerCase() || parts[0].toLowerCase();

        if (lightVal) {
          if (!semanticLight[category]) semanticLight[category] = {};
          semanticLight[category][key] = lightVal;
        }
        if (darkVal) {
          if (!semanticDark[category]) semanticDark[category] = {};
          semanticDark[category][key] = darkVal;
        }
      }

      // Spacing & border radius
      if (v.resolvedType === "FLOAT") {
        const val = Object.values(v.valuesByMode)[0];
        const numVal = typeof val === "number" ? val : null;
        if (numVal === null) continue;

        if (name.startsWith("Utilities/spacing/")) {
          const key = name.replace("Utilities/spacing/", "").replace("_", ".");
          spacingTokens[key] = numVal;
        }
        if (name.startsWith("Utilities/border radius/")) {
          const key = name.replace("Utilities/border radius/", "");
          borderRadiusTokens[key] = numVal;
        }
        if (name.startsWith("Typeface/size/")) {
          const key = name.replace("Typeface/size/", "");
          typefaceSizes[key] = numVal;
        }
        if (name.startsWith("Typeface/line height/")) {
          const key = name.replace("Typeface/line height/", "");
          typefaceLineHeights[key] = numVal;
        }
      }
    }
  }

  return { primitiveColors, semanticLight, semanticDark, spacingTokens, borderRadiusTokens, typefaceSizes, typefaceLineHeights };
}

// ── Extract text styles from Typography frame ─────────────────────────────
async function extractTextStyles() {
  console.log("Fetching Typography frame...");
  const data = await figmaGet(`/files/${FIGMA_FILE_ID}/nodes?ids=28:1916&depth=8`);
  const root = data.nodes["28:1916"].document;

  const styles: Record<string, Record<string, Array<{
    name: string;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
  }>>> = {};

  function walk(node: any, path: string[] = []) {
    if (node.type === "TEXT" && node.name === "sample-text") {
      const s = node.style || {};
      const chars = node.characters || "";

      // Find which breakpoint section we're in
      let breakpoint = "desktop";
      let category = "";
      let variant = chars;

      // Walk up the path to find context
      for (const p of path) {
        if (p === "Desktop" || p === "Tablet" || p === "Mobile") breakpoint = p.toLowerCase();
        if (["Display text", "Title", "Body", "Labels", "Special", "Button"].some(c => p.includes(c))) {
          category = p.replace(" text", "").toLowerCase();
        }
      }

      if (!styles[breakpoint]) styles[breakpoint] = {};
      if (!styles[breakpoint][category]) styles[breakpoint][category] = [];

      styles[breakpoint][category].push({
        name: chars,
        fontSize: s.fontSize || 0,
        fontWeight: s.fontWeight || 400,
        lineHeight: s.lineHeightPx || 0,
        letterSpacing: s.letterSpacing || 0,
      });
    }

    for (const child of node.children || []) {
      walk(child, [...path, node.name]);
    }
  }

  walk(root);
  return styles;
}

// ── Extract effect styles from Elevation frame ────────────────────────────
async function extractEffects() {
  console.log("Fetching Elevation frame...");
  const data = await figmaGet(`/files/${FIGMA_FILE_ID}/nodes?ids=394:10907&depth=6`);
  const root = data.nodes["394:10907"].document;

  const shadows: Record<string, string[]> = {};

  function walk(node: any, path: string[] = []) {
    if (node.effects?.length > 0 && node.type === "FRAME" && ["xs", "sm", "md", "lg", "xl"].includes(node.name)) {
      const direction = path.some(p => p.toLowerCase().includes("up")) ? "up" : "down";
      const key = `${direction}-${node.name}`;
      shadows[key] = node.effects
        .filter((e: any) => e.type === "DROP_SHADOW" && e.visible !== false)
        .map((e: any) => {
          const { offset, radius, spread, color } = e;
          const c = `rgba(${Math.round(color.r * 255)},${Math.round(color.g * 255)},${Math.round(color.b * 255)},${parseFloat(color.a.toFixed(2))})`;
          return `${offset.x}px ${offset.y}px ${radius}px ${spread}px ${c}`;
        });
    }

    for (const child of node.children || []) {
      walk(child, [...path, node.name]);
    }
  }

  walk(root);
  return shadows;
}

// ── Extract gradient color styles ─────────────────────────────────────────
async function extractGradients() {
  console.log("Fetching gradient styles...");
  // Gradients are defined in the Colors frame
  const data = await figmaGet(`/files/${FIGMA_FILE_ID}/nodes?ids=12:1105&depth=8`);
  const root = data.nodes["12:1105"].document;

  const gradients: Record<string, string> = {};

  function walk(node: any) {
    if (node.fills?.length > 0) {
      for (const fill of node.fills) {
        if (fill.type === "GRADIENT_RADIAL" || fill.type === "GRADIENT_LINEAR") {
          const name = node.name;
          if (name.includes("radial") || name.includes("linear")) {
            const stops = fill.gradientStops?.map((s: any) => {
              const c = toHex(s.color);
              return `${c} ${Math.round(s.position * 100)}%`;
            }).join(", ");

            if (fill.type === "GRADIENT_RADIAL") {
              gradients[name] = `radial-gradient(${stops})`;
            } else {
              gradients[name] = `linear-gradient(${stops})`;
            }
          }
        }
      }
    }

    for (const child of node.children || []) {
      walk(child);
    }
  }

  walk(root);
  return gradients;
}

// ── Write files ───────────────────────────────────────────────────────────
function toTS(obj: any, indent = 2): string {
  return JSON.stringify(obj, null, indent)
    .replace(/"([^"]+)":/g, '"$1":')
    .replace(/"/g, '"');
}

async function writeFile(path: string, content: string) {
  const { writeFile } = await import("fs/promises");
  const { dirname } = await import("path");
  const { mkdirSync, existsSync } = await import("fs");
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  await writeFile(path, content, "utf-8");
  console.log(`  ✓ ${path}`);
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\nSyncing tokens from Figma file: ${FIGMA_FILE_ID}\n`);

  const [vars, textStyles, effects, gradients] = await Promise.all([
    extractVariables(),
    extractTextStyles(),
    extractEffects(),
    extractGradients(),
  ]);

  // Write primitives.ts
  const primitivesContent = `// Auto-generated from Figma — do not edit manually
// Run: npx tsx scripts/sync-figma-tokens.ts

export const colors = ${JSON.stringify(vars.primitiveColors, null, 2)} as const;
`;
  await writeFile(`${OUTPUT_DIR}/primitives.ts`, primitivesContent);

  // Write semantic.ts
  const semanticContent = `// Auto-generated from Figma — do not edit manually
// Run: npx tsx scripts/sync-figma-tokens.ts

export const semantic = {
  light: ${JSON.stringify(vars.semanticLight, null, 2)},
  dark: ${JSON.stringify(vars.semanticDark, null, 2)},
} as const;
`;
  await writeFile(`${OUTPUT_DIR}/semantic.ts`, semanticContent);

  // Write typography.ts with all breakpoints
  const typoContent = `// Auto-generated from Figma — do not edit manually
// Run: npx tsx scripts/sync-figma-tokens.ts

export const fontFamily = {
  sans: ["Roboto", "sans-serif"],
} as const;

type FontEntry = [string, { lineHeight: string; letterSpacing: string; fontWeight: string }];

function entry(size: number, lh: number, weight: number, ls: number): FontEntry {
  return [\`\${size}px\`, {
    lineHeight: \`\${lh}px\`,
    letterSpacing: ls ? \`\${ls}em\` : "0",
    fontWeight: String(weight),
  }];
}

// Desktop text styles
export const desktop = {
${Object.entries(textStyles.desktop || {})
  .map(([category, items]) =>
    items.map((item: any) => {
      const key = `${item.name.replace(/\s+/g, "-").toLowerCase()}${item.fontWeight <= 300 ? "-light" : ""}`;
      return `  "${key}": entry(${item.fontSize}, ${Math.round(item.lineHeight)}, ${item.fontWeight}, ${item.letterSpacing ? parseFloat(item.letterSpacing.toFixed(4)) : 0}),`;
    }).join("\n")
  )
  .join("\n")}
} as const;

// Tablet text styles
export const tablet = {
${Object.entries(textStyles.tablet || {})
  .map(([category, items]) =>
    items.map((item: any) => {
      const key = `${item.name.replace(/\s+/g, "-").toLowerCase()}${item.fontWeight <= 300 ? "-light" : ""}`;
      return `  "${key}": entry(${item.fontSize}, ${Math.round(item.lineHeight)}, ${item.fontWeight}, ${item.letterSpacing ? parseFloat(item.letterSpacing.toFixed(4)) : 0}),`;
    }).join("\n")
  )
  .join("\n")}
} as const;

// Mobile text styles
export const mobile = {
${Object.entries(textStyles.mobile || {})
  .map(([category, items]) =>
    items.map((item: any) => {
      const key = `${item.name.replace(/\s+/g, "-").toLowerCase()}${item.fontWeight <= 300 ? "-light" : ""}`;
      return `  "${key}": entry(${item.fontSize}, ${Math.round(item.lineHeight)}, ${item.fontWeight}, ${item.letterSpacing ? parseFloat(item.letterSpacing.toFixed(4)) : 0}),`;
    }).join("\n")
  )
  .join("\n")}
} as const;

// Default export is desktop
export const fontSize = desktop;
`;
  await writeFile(`${OUTPUT_DIR}/typography.ts`, typoContent);

  // Write effects.ts
  const shadowEntries = Object.entries(effects)
    .map(([key, layers]) => `  "${key}": "${layers.join(", ")}"`)
    .join(",\n");

  const gradientEntries = Object.entries(gradients)
    .map(([key, val]) => `  "${key}": "${val}"`)
    .join(",\n");

  const effectsContent = `// Auto-generated from Figma — do not edit manually
// Run: npx tsx scripts/sync-figma-tokens.ts

export const boxShadow = {
${shadowEntries},
  "focus-ring": "0 0 0 4px #6ec8f1",
} as const;

export const gradient = {
${gradientEntries}
} as const;
`;
  await writeFile(`${OUTPUT_DIR}/effects.ts`, effectsContent);

  console.log("\n✅ All tokens synced from Figma!\n");
}

main().catch(console.error);
