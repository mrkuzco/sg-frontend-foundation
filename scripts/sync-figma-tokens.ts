/**
 * Sync design tokens from Figma to TypeScript files.
 * Fetches ALL styles (text, effect, fill) + variables via the REST API.
 *
 * Usage: FIGMA_TOKEN=figd_xxx pnpm sync-tokens
 */

import { writeFile as fsWriteFile, mkdirSync, existsSync } from "fs";
import { dirname } from "path";

const FIGMA_FILE_ID = "vn9H7ncA03gyiMWuQMAAHV";
const TOKEN = process.env.FIGMA_TOKEN || process.argv[2];
const OUTPUT_DIR = "packages/ui/design-tokens/mystore";

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

async function writeOutput(path: string, content: string) {
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  await new Promise<void>((resolve, reject) =>
    fsWriteFile(path, content, "utf-8", (err) => (err ? reject(err) : resolve()))
  );
  console.log(`  ✓ ${path}`);
}

// ── Step 1: Get all styles from the file ──────────────────────────────────
async function getFileStyles() {
  console.log("Fetching file with all styles...");
  const data = await figmaGet(`/files/${FIGMA_FILE_ID}`);
  const styles: Record<string, { name: string; styleType: string; node_id: string }> = {};

  for (const [nodeId, style] of Object.entries(data.styles || {}) as [string, any][]) {
    styles[nodeId] = {
      name: style.name,
      styleType: style.styleType,
      node_id: nodeId,
    };
  }

  return { styles, document: data.document };
}

// ── Step 2: Fetch style nodes to get actual properties ────────────────────
async function fetchStyleNodes(nodeIds: string[]) {
  // Figma API has a limit on URL length, batch in groups of 50
  const nodes: Record<string, any> = {};
  for (let i = 0; i < nodeIds.length; i += 50) {
    const batch = nodeIds.slice(i, i + 50);
    console.log(`  Fetching nodes ${i + 1}-${Math.min(i + 50, nodeIds.length)} of ${nodeIds.length}...`);
    const data = await figmaGet(`/files/${FIGMA_FILE_ID}/nodes?ids=${batch.join(",")}`);
    for (const [id, nodeData] of Object.entries(data.nodes || {}) as [string, any][]) {
      if (nodeData?.document) nodes[id] = nodeData.document;
    }
  }
  return nodes;
}

// ── Extract text styles ───────────────────────────────────────────────────
interface TextStyle {
  name: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  textTransform?: string;
}

function extractTextStyle(name: string, node: any): TextStyle | null {
  const s = node.style;
  if (!s) return null;
  return {
    name,
    fontFamily: s.fontFamily || "Roboto",
    fontSize: s.fontSize || 0,
    fontWeight: s.fontWeight || 400,
    lineHeight: Math.round(s.lineHeightPx || 0),
    letterSpacing: s.letterSpacing ? parseFloat(s.letterSpacing.toFixed(4)) : 0,
    textTransform: s.textCase === "UPPER" ? "uppercase" : undefined,
  };
}

// ── Extract effect styles ─────────────────────────────────────────────────
function extractEffectStyle(node: any): string | null {
  const effects = node.effects;
  if (!effects?.length) return null;
  return effects
    .filter((e: any) => e.visible !== false)
    .map((e: any) => {
      if (e.type === "DROP_SHADOW" || e.type === "INNER_SHADOW") {
        const ox = e.offset?.x ?? 0;
        const oy = e.offset?.y ?? 0;
        const blur = e.radius ?? 0;
        const spread = e.spread ?? 0;
        const c = e.color || { r: 0, g: 0, b: 0, a: 0 };
        const prefix = e.type === "INNER_SHADOW" ? "inset " : "";
        return `${prefix}${ox}px ${oy}px ${blur}px ${spread}px ${toHex(c)}`;
      }
      return null;
    })
    .filter(Boolean)
    .join(", ");
}

// ── Extract fill/gradient styles ──────────────────────────────────────────
function extractFillStyle(node: any): string | null {
  const fills = node.fills;
  if (!fills?.length) return null;
  for (const fill of fills) {
    if (fill.visible === false) continue;
    if (fill.type === "GRADIENT_RADIAL") {
      const stops = (fill.gradientStops || [])
        .map((s: any) => `${toHex(s.color)} ${Math.round(s.position * 100)}%`)
        .join(", ");
      return `radial-gradient(${stops})`;
    }
    if (fill.type === "GRADIENT_LINEAR") {
      const stops = (fill.gradientStops || [])
        .map((s: any) => `${toHex(s.color)} ${Math.round(s.position * 100)}%`)
        .join(", ");
      return `linear-gradient(${stops})`;
    }
  }
  return null;
}

// ── Generate output files ─────────────────────────────────────────────────
function generateTypographyFile(
  textStyles: Record<string, TextStyle[]>,
): string {
  const seen = new Set<string>();

  function formatGroup(styles: TextStyle[]): string {
    return styles
      .map((s) => {
        const key = `${s.name.replace(/\s+/g, "-").toLowerCase()}${s.fontWeight <= 300 ? "-light" : ""}`;
        if (seen.has(key)) return null;
        seen.add(key);
        return `  "${key}": entry(${s.fontSize}, ${s.lineHeight}, ${s.fontWeight}, ${s.letterSpacing}),`;
      })
      .filter(Boolean)
      .join("\n");
  }

  const header = `// Auto-generated from Figma styles — do not edit manually
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
`;

  const sections: string[] = [];
  for (const [breakpoint, styles] of Object.entries(textStyles)) {
    seen.clear();
    sections.push(`// ${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}
export const ${breakpoint} = {
${formatGroup(styles)}
} as const;`);
  }

  return `${header}\n${sections.join("\n\n")}\n\n// Default export is desktop\nexport const fontSize = desktop;\n`;
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\nSyncing tokens from Figma: ${FIGMA_FILE_ID}\n`);

  // Step 1: Get all styles from file
  const { styles } = await getFileStyles();
  const styleCount = Object.keys(styles).length;
  console.log(`Found ${styleCount} styles in file\n`);

  // Group styles by type
  const textStyleIds: string[] = [];
  const effectStyleIds: string[] = [];
  const fillStyleIds: string[] = [];

  for (const [nodeId, style] of Object.entries(styles)) {
    const name = style.name;
    if (style.styleType === "TEXT" && name.match(/^(Desktop|Tablet|Mobile|Button|Labels)\//)) {
      textStyleIds.push(nodeId);
    }
    if (style.styleType === "EFFECT" && name.match(/^(Shadow |Focus Ring)/)) {
      effectStyleIds.push(nodeId);
    }
    if (style.styleType === "FILL" && name.includes("gradient")) {
      fillStyleIds.push(nodeId);
    }
  }

  console.log(`Text styles: ${textStyleIds.length}`);
  console.log(`Effect styles: ${effectStyleIds.length}`);
  console.log(`Fill styles: ${fillStyleIds.length}\n`);

  // Step 2: Fetch all style nodes
  const allNodeIds = [...textStyleIds, ...effectStyleIds, ...fillStyleIds];
  console.log("Fetching style node properties...");
  const nodes = await fetchStyleNodes(allNodeIds);

  // ── Process text styles ───────────────────────────────────────────────
  const textByBreakpoint: Record<string, TextStyle[]> = {
    desktop: [],
    tablet: [],
    mobile: [],
    button: [],
  };

  for (const nodeId of textStyleIds) {
    const style = styles[nodeId];
    const node = nodes[nodeId];
    if (!node) continue;

    const name = style.name;
    const parts = name.split("/");
    const breakpoint = parts[0].toLowerCase();

    const textStyle = extractTextStyle(parts.slice(1).join("/"), node);
    if (!textStyle) continue;

    if (breakpoint === "labels") {
      // Labels go into all breakpoints
      textByBreakpoint.desktop.push(textStyle);
      textByBreakpoint.tablet.push(textStyle);
      textByBreakpoint.mobile.push(textStyle);
    } else if (textByBreakpoint[breakpoint]) {
      textByBreakpoint[breakpoint].push(textStyle);
    }
  }

  // ── Process effect styles ─────────────────────────────────────────────
  const effects: Record<string, string> = {};
  for (const nodeId of effectStyleIds) {
    const style = styles[nodeId];
    const node = nodes[nodeId];
    if (!node) continue;

    const value = extractEffectStyle(node);
    if (value) {
      const key = style.name.replace(/\//g, "-").replace(/\s+/g, "-").toLowerCase();
      effects[key] = value;
    }
  }

  // ── Process gradient styles ───────────────────────────────────────────
  const gradients: Record<string, string> = {};
  for (const nodeId of fillStyleIds) {
    const style = styles[nodeId];
    const node = nodes[nodeId];
    if (!node) continue;

    const value = extractFillStyle(node);
    if (value) {
      const key = style.name.replace(/\//g, "-").replace(/\s+/g, "-").toLowerCase();
      gradients[key] = value;
    }
  }

  // ── Write files ───────────────────────────────────────────────────────
  console.log("\nWriting files...");

  await writeOutput(`${OUTPUT_DIR}/typography.ts`, generateTypographyFile(textByBreakpoint));

  const effectEntries = Object.entries(effects)
    .map(([k, v]) => `  "${k}": "${v}"`)
    .join(",\n");

  const gradientEntries = Object.entries(gradients)
    .map(([k, v]) => `  "${k}": "${v}"`)
    .join(",\n");

  await writeOutput(
    `${OUTPUT_DIR}/effects.ts`,
    `// Auto-generated from Figma styles — do not edit manually\n// Run: FIGMA_TOKEN=xxx pnpm sync-tokens\n\nexport const boxShadow = {\n${effectEntries}\n} as const;\n\nexport const gradient = {\n${gradientEntries}\n} as const;\n`
  );

  // Summary
  console.log(`\n✅ Synced from Figma styles:`);
  console.log(`   Typography: ${Object.values(textByBreakpoint).reduce((a, b) => a + b.length, 0)} text styles (${Object.keys(textByBreakpoint).join(", ")})`);
  console.log(`   Effects: ${Object.keys(effects).length} shadow/effect styles`);
  console.log(`   Gradients: ${Object.keys(gradients).length} gradient styles\n`);
}

main().catch(console.error);
