/**
 * Generates React icon components from Google Material Symbols.
 * Downloads SVGs at the exact specs matching the Figma design:
 *   Style: Rounded | Weight: 300 | Optical size: 24dp
 *
 * Usage: pnpm --filter @sg-foundation/icons generate
 *
 * To add icons: add the material symbol name to the ICONS array below.
 * Find icon names at: https://fonts.google.com/icons?icon.set=Material+Symbols
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, "generated");

// Google Fonts API for Material Symbols SVGs
// Style: rounded | Weight: 300 | Optical size: 24dp (matching Figma spec)
const BASE_URL = "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded";

function getIconUrl(name: string): string {
  return `${BASE_URL}/${name}/wght300/24px.svg`;
}

// Icon names from the Figma design file (node 96:1285)
// The comment shows the Figma component name → material symbol name
const ICONS: Record<string, string> = {
  // Figma name → material symbol name
  add: "add",
  arrow_back: "arrow_back",
  arrow_forward: "arrow_forward",
  calendar: "calendar_month",
  camera: "photo_camera",
  cancel: "cancel",
  category: "label",
  check: "check_small",
  checklist: "event_list",
  chevron_back: "chevron_backward",
  chevron_down: "keyboard_arrow_down",
  chevron_forward: "chevron_forward",
  chevron_up: "keyboard_arrow_up",
  clock: "schedule",
  close: "close",
  dashboard: "apps",
  deadline: "alarm",
  delete: "delete",
  department: "stack",
  edit: "stylus",
  error: "asterisk",
  feedback: "maps_ugc",
  filter: "filter_list",
  image: "imagesmode",
  info: "info",
  kebab: "more_vert",
  knowledge: "wb_incandescent",
  loading: "progress_activity",
  lock: "lock",
  logout: "logout",
  meatball: "more_horiz",
  menu: "menu",
  minus: "remove",
  orders: "shopping_bag",
  profile: "face",
  reorder_list: "drag_indicator",
  search: "search",
  send: "send",
  settings: "settings",
  swap_horizontal: "swap_horiz",
  swap_vertical: "swap_vert",
  task: "playlist_add_check",
  task_management: "library_add_check",
  text: "text_fields",
  walk: "keyboard_double_arrow_right",

  // Common extras
  check_circle: "check_circle",
  download: "download",
  upload: "upload",
  print: "print",
  save: "save",
  refresh: "refresh",
  share: "share",
  help: "help",
  warning: "warning",
  home: "home",
  notifications: "notifications",
  person: "person",
  store: "store",
  visibility: "visibility",
  visibility_off: "visibility_off",
  sort: "sort",
  open_in_new: "open_in_new",
  dark_mode: "dark_mode",
  light_mode: "light_mode",
  login: "login",
  local_shipping: "local_shipping",
};

function toPascalCase(name: string): string {
  return name
    .split(/[_\s]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function extractPath(svg: string): string {
  const match = svg.match(/<path d="([^"]+)"/);
  return match?.[1] || "";
}

async function fetchSvg(materialName: string): Promise<string | null> {
  const url = getIconUrl(materialName);
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function generate() {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const exports: string[] = [];
  let count = 0;
  let failed = 0;

  console.log("Downloading icons from Google Fonts API (Rounded, wght300, 24px)...\n");

  for (const [figmaName, materialName] of Object.entries(ICONS)) {
    const svg = await fetchSvg(materialName);
    if (!svg) {
      console.warn(`  ⚠ Not found: ${figmaName} (${materialName})`);
      failed++;
      continue;
    }

    const path = extractPath(svg);
    if (!path) {
      console.warn(`  ⚠ No path in: ${figmaName} (${materialName})`);
      failed++;
      continue;
    }

    const componentName = `Icon${toPascalCase(figmaName)}`;
    exports.push(
      `export const ${componentName} = /*#__PURE__*/ createIcon("${componentName}", "${path}");`
    );
    count++;
  }

  const content = `// Auto-generated — do not edit manually
// Run: pnpm --filter @sg-foundation/icons generate
// Source: Google Material Symbols (Rounded, Weight 300, Optical Size 24dp)
// Matching Figma spec: Google Material Icons, Rounded, Weight 300, Normal grade, Size 24dp
//
// To add icons: edit packages/icons/src/generate.ts

import { createIcon } from "../UIIcon";

${exports.join("\n")}
`;

  writeFileSync(resolve(OUTPUT_DIR, "icons.ts"), content, "utf-8");
  console.log(`\n✅ Generated ${count} icons${failed ? ` (${failed} failed)` : ""}`);
}

generate();
