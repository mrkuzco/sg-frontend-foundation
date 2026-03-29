/**
 * Sync design tokens from Figma to TypeScript files.
 *
 * Usage: FIGMA_TOKEN=figd_xxx pnpm sync-tokens
 */

import { writeFile as fsWriteFile, mkdirSync, existsSync } from "fs";
import { dirname } from "path";

const FIGMA_FILE_ID = "vn9H7ncA03gyiMWuQMAAHV";
const TOKEN = process.env.FIGMA_TOKEN || process.argv[2];
const OUTPUT_DIR = "packages/ui/src/themes/mystore";

// Figma node IDs for key frames
const TYPOGRAPHY_NODE = "28:1916";
const ELEVATION_NODE = "394:10907";
const COLORS_NODE = "12:1105";

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

function toHex(c: { r: number; g: number; b: number; a?: number }) {
  const r = Math.round(c.r * 255);
  const g = Math.round(c.g * 255);
  const b = Math.round(c.b * 255);
  const a = c.a ?? 1;
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
  if (val?.r !== undefined) return toHex(val);
  return null;
}

async function writeOutput(path: string, content: string) {
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  await new Promise<void>((resolve, reject) =>
    fsWriteFile(path, content, "utf-8", (err) => (err ? reject(err) : resolve()))
  );
  console.log(`  ✓ ${path}`);
}

// ── 1. Variables (colors, spacing) ────────────────────────────────────────
async function extractVariables() {
  console.log("Fetching variables...");
  const data = await figmaGet(`/files/${FIGMA_FILE_ID}/variables/local`);
  const { variableCollections, variables } = data.meta;

  const primitiveColors: Record<string, Record<string, string>> = {};
  const semanticLight: Record<string, Record<string, string>> = {};
  const semanticDark: Record<string, Record<string, string>> = {};

  for (const col of Object.values(variableCollections) as any[]) {
    const modes = Object.fromEntries(col.modes.map((m: any) => [m.modeId, m.name]));
    const modeIds = Object.keys(modes);
    const hasLightDark = modes[modeIds[0]] === "Light" && modes[modeIds[1]] === "Dark";

    for (const vid of col.variableIds) {
      const v = variables[vid];
      if (!v) continue;
      const name: string = v.name;

      if (v.resolvedType === "COLOR" && col.name === "Base Colors") {
        const parts = name.split("/");
        if (parts.length >= 2) {
          const group = parts[parts.length - 2];
          const shade = parts[parts.length - 1];
          if (!primitiveColors[group]) primitiveColors[group] = {};
          const hex = resolveColor(Object.values(v.valuesByMode)[0], variables);
          if (hex) primitiveColors[group][shade] = hex;
        }
      }

      if (v.resolvedType === "COLOR" && hasLightDark) {
        const parts = name.split("/");
        const category = parts[0];
        const key = parts.slice(1).join("-").replace(/\s+/g, "-").toLowerCase() || category.toLowerCase();

        const lightVal = resolveColor(v.valuesByMode[modeIds[0]], variables);
        const darkVal = resolveColor(v.valuesByMode[modeIds[1]], variables);

        if (lightVal) {
          if (!semanticLight[category]) semanticLight[category] = {};
          semanticLight[category][key] = lightVal;
        }
        if (darkVal) {
          if (!semanticDark[category]) semanticDark[category] = {};
          semanticDark[category][key] = darkVal;
        }
      }
    }
  }

  return { primitiveColors, semanticLight, semanticDark };
}

// ── 2. Typography ─────────────────────────────────────────────────────────
interface TextEntry {
  name: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
}

async function extractTypography() {
  console.log("Fetching typography...");
  const data = await figmaGet(`/files/${FIGMA_FILE_ID}/nodes?ids=${TYPOGRAPHY_NODE}&depth=8`);
  const root = data.nodes[TYPOGRAPHY_NODE].document;

  const breakpoints: Record<string, Record<string, TextEntry[]>> = {
    desktop: {},
    tablet: {},
    mobile: {},
  };

  for (const section of root.children || []) {
    // Find section name from subtitle
    let sectionName = "";
    for (const child of section.children || []) {
      if (child.name === "_docs_subtitle") {
        for (const sub of child.children || []) {
          for (const t of sub.children || []) {
            if (t.type === "TEXT" && t.name === "Subtitle") {
              sectionName = t.characters.replace(" text", "").toLowerCase();
            }
          }
        }
      }
    }
    if (!sectionName) continue;

    // Find typography-scale frames
    for (const child of section.children || []) {
      if (child.name !== "Frame 1") continue;

      for (const scaleFrame of child.children || []) {
        if (scaleFrame.name !== "typography-scale") continue;

        // Each typography-scale has 3 column frames (sorted by x = desktop, tablet, mobile)
        const columns: { x: number; texts: TextEntry[] }[] = [];
        for (const col of scaleFrame.children || []) {
          const x = col.absoluteBoundingBox?.x ?? 0;
          const texts: TextEntry[] = [];
          for (const t of col.children || []) {
            if (t.type === "TEXT" && t.name === "sample-text") {
              const s = t.style || {};
              texts.push({
                name: t.characters,
                fontSize: s.fontSize || 0,
                fontWeight: s.fontWeight || 400,
                lineHeight: Math.round(s.lineHeightPx || 0),
                letterSpacing: s.letterSpacing ? parseFloat(s.letterSpacing.toFixed(4)) : 0,
              });
            }
          }
          columns.push({ x, texts });
        }
        columns.sort((a, b) => a.x - b.x);

        const bpNames = ["desktop", "tablet", "mobile"];
        columns.forEach((col, i) => {
          const bp = bpNames[i];
          if (!bp) return;
          if (!breakpoints[bp][sectionName]) breakpoints[bp][sectionName] = [];
          breakpoints[bp][sectionName].push(...col.texts);
        });
      }
    }
  }

  return breakpoints;
}

// ── 3. Shadows ────────────────────────────────────────────────────────────
async function extractShadows() {
  console.log("Fetching shadows...");
  const data = await figmaGet(`/files/${FIGMA_FILE_ID}/nodes?ids=${ELEVATION_NODE}&depth=8`);
  const root = data.nodes[ELEVATION_NODE].document;

  const shadows: Record<string, string> = {};

  function formatShadow(e: any): string {
    const ox = e.offset?.x ?? 0;
    const oy = e.offset?.y ?? 0;
    const blur = e.radius ?? 0;
    const spread = e.spread ?? 0;
    const c = e.color || { r: 0, g: 0, b: 0, a: 0 };
    const cr = Math.round(c.r * 255);
    const cg = Math.round(c.g * 255);
    const cb = Math.round(c.b * 255);
    const ca = parseFloat((c.a ?? 0).toFixed(2));
    return `${ox}px ${oy}px ${blur}px ${spread}px rgba(${cr},${cg},${cb},${ca})`;
  }

  // Walk all nodes looking for frames named xs/sm/md/lg/xl with effects
  function findShadowFrames(node: any, direction: string) {
    const name = node.name;
    const sizes = ["xs", "sm", "md", "lg", "xl"];

    if (node.type === "FRAME" && sizes.includes(name) && node.effects?.length > 0) {
      const key = `${direction}-${name}`;
      if (!shadows[key]) {
        const layers = node.effects
          .filter((e: any) => e.type === "DROP_SHADOW" && e.visible !== false)
          .map(formatShadow);
        shadows[key] = layers.join(", ");
      }
    }

    for (const child of node.children || []) {
      findShadowFrames(child, direction);
    }
  }

  // Find the two main sections by subtitle text
  for (const section of root.children || []) {
    let direction = "";
    // Check subtitle text to determine direction
    function findSubtitle(node: any) {
      if (node.type === "TEXT" && node.characters) {
        const text = node.characters.toLowerCase();
        if (text.includes("down")) direction = "down";
        if (text.includes("up")) direction = "up";
      }
      for (const child of node.children || []) {
        findSubtitle(child);
      }
    }
    findSubtitle(section);

    if (direction) {
      findShadowFrames(section, direction);
    }
  }

  return shadows;
}

// ── 4. Gradients ──────────────────────────────────────────────────────────
async function extractGradients() {
  console.log("Fetching gradients...");
  const data = await figmaGet(`/files/${FIGMA_FILE_ID}/nodes?ids=${COLORS_NODE}&depth=10`);
  const root = data.nodes[COLORS_NODE].document;

  const gradients: Record<string, string> = {};

  function walk(node: any) {
    const name = (node.name || "").toLowerCase();
    if (node.fills?.length > 0 && (name.includes("radial") || name.includes("linear"))) {
      for (const fill of node.fills) {
        if (fill.visible === false) continue;
        if (fill.type !== "GRADIENT_RADIAL" && fill.type !== "GRADIENT_LINEAR") continue;

        const stops = (fill.gradientStops || [])
          .map((s: any) => `${toHex(s.color)} ${Math.round(s.position * 100)}%`)
          .join(", ");

        const type = fill.type === "GRADIENT_RADIAL" ? "radial-gradient" : "linear-gradient";
        gradients[node.name] = `${type}(${stops})`;
      }
    }

    for (const child of node.children || []) {
      walk(child);
    }
  }

  walk(root);
  return gradients;
}

// ── Generate typography file content ──────────────────────────────────────
function generateTypographyFile(breakpoints: Record<string, Record<string, TextEntry[]>>): string {
  function formatBreakpoint(name: string, categories: Record<string, TextEntry[]>): string {
    const seen = new Set<string>();
    const entries: string[] = [];

    for (const [, items] of Object.entries(categories)) {
      for (const item of items) {
        const key = `${item.name.replace(/\s+/g, "-").toLowerCase()}${item.fontWeight <= 300 ? "-light" : ""}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const ls = item.letterSpacing || 0;
        entries.push(`  "${key}": entry(${item.fontSize}, ${item.lineHeight}, ${item.fontWeight}, ${ls}),`);
      }
    }

    return `export const ${name} = {\n${entries.join("\n")}\n} as const;`;
  }

  return `// Auto-generated from Figma — do not edit manually
// Run: FIGMA_TOKEN=xxx pnpm sync-tokens

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

// Desktop
${formatBreakpoint("desktop", breakpoints.desktop || {})}

// Tablet
${formatBreakpoint("tablet", breakpoints.tablet || {})}

// Mobile
${formatBreakpoint("mobile", breakpoints.mobile || {})}

// Default export is desktop
export const fontSize = desktop;
`;
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\nSyncing tokens from Figma: ${FIGMA_FILE_ID}\n`);

  const [vars, typography, shadows, gradients] = await Promise.all([
    extractVariables(),
    extractTypography(),
    extractShadows(),
    extractGradients(),
  ]);

  // primitives.ts
  await writeOutput(
    `${OUTPUT_DIR}/primitives.ts`,
    `// Auto-generated from Figma — do not edit manually\n// Run: FIGMA_TOKEN=xxx pnpm sync-tokens\n\nexport const colors = ${JSON.stringify(vars.primitiveColors, null, 2)} as const;\n`
  );

  // semantic.ts
  await writeOutput(
    `${OUTPUT_DIR}/semantic.ts`,
    `// Auto-generated from Figma — do not edit manually\n// Run: FIGMA_TOKEN=xxx pnpm sync-tokens\n\nexport const semantic = {\n  light: ${JSON.stringify(vars.semanticLight, null, 2)},\n  dark: ${JSON.stringify(vars.semanticDark, null, 2)},\n} as const;\n`
  );

  // typography.ts
  await writeOutput(`${OUTPUT_DIR}/typography.ts`, generateTypographyFile(typography));

  // effects.ts
  const shadowEntries = Object.entries(shadows)
    .map(([k, v]) => `  "${k}": "${v}"`)
    .join(",\n");

  const gradientEntries = Object.entries(gradients)
    .map(([k, v]) => `  "${k}": "${v}"`)
    .join(",\n");

  await writeOutput(
    `${OUTPUT_DIR}/effects.ts`,
    `// Auto-generated from Figma — do not edit manually\n// Run: FIGMA_TOKEN=xxx pnpm sync-tokens\n\nexport const boxShadow = {\n${shadowEntries},\n  "focus-ring": "0 0 0 4px #6ec8f1",\n} as const;\n\nexport const gradient = {\n${gradientEntries || "  // No gradients found inline — may be in a linked library"}\n} as const;\n`
  );

  console.log("\n✅ All tokens synced!\n");
}

main().catch(console.error);
