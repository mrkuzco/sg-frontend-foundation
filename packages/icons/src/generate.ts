/**
 * Generates React icon components from @material-symbols/svg-300/rounded.
 *
 * Usage: pnpm --filter @sg-foundation/icons generate
 *
 * To add icons: add the material symbol name to the ICONS array below.
 * Names match filenames in @material-symbols/svg-300/rounded/ (without .svg).
 * Find icon names at: https://fonts.google.com/icons?icon.set=Material+Symbols
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SVG_DIR = resolve(__dirname, "../node_modules/@material-symbols/svg-300/rounded");
const OUTPUT_DIR = resolve(__dirname, "generated");

// Icon names from @material-symbols/svg-300/rounded.
// These are the icons actually used in the Figma design file.
// To add more: find the material symbol name at https://fonts.google.com/icons
const ICONS: string[] | "all" = [
  // Used in Figma icon component (node 96:1285)
  "add",
  "alarm",
  "apps",
  "arrow_back",
  "arrow_forward",
  "cancel",
  "check_small",
  "chevron_backward",
  "chevron_forward",
  "close",
  "delete",
  "drag_indicator",
  "event_list",
  "face",
  "filter_list",
  "imagesmode",
  "info",
  "keyboard_arrow_down",
  "keyboard_arrow_up",
  "keyboard_double_arrow_right",
  "label",
  "library_add_check",
  "lock",
  "logout",
  "maps_ugc",
  "menu",
  "more_horiz",
  "more_vert",
  "photo_camera",
  "playlist_add_check",
  "progress_activity",
  "schedule",
  "search",
  "send",
  "settings",
  "stack",
  "stylus",
  "swap_horiz",
  "swap_vert",
  "text_fields",
  "wb_incandescent",
  "calendar_month",
  "remove",

  // Common extras
  "check",
  "check_circle",
  "edit",
  "home",
  "notifications",
  "person",
  "store",
  "visibility",
  "visibility_off",
  "download",
  "upload",
  "print",
  "save",
  "refresh",
  "share",
  "help",
  "warning",
  "error",
  "sort",
  "open_in_new",
  "dark_mode",
  "light_mode",
  "login",
  "local_shipping",
];

function toPascalCase(name: string): string {
  return name
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function extractPath(svg: string): string {
  const match = svg.match(/<path d="([^"]+)"/);
  return match?.[1] || "";
}

function generate() {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const iconNames =
    ICONS === "all"
      ? readdirSync(SVG_DIR)
          .filter((f) => f.endsWith(".svg") && !f.includes("-fill"))
          .map((f) => f.replace(".svg", ""))
      : ICONS;

  const exports: string[] = [];
  let count = 0;

  for (const name of iconNames) {
    const svgPath = resolve(SVG_DIR, `${name}.svg`);
    if (!existsSync(svgPath)) {
      console.warn(`  ⚠ Icon not found: ${name}`);
      continue;
    }

    const svg = readFileSync(svgPath, "utf-8");
    const path = extractPath(svg);
    if (!path) {
      console.warn(`  ⚠ No path found in: ${name}`);
      continue;
    }

    const componentName = `Icon${toPascalCase(name)}`;
    exports.push(
      `export const ${componentName} = /*#__PURE__*/ createIcon("${componentName}", "${path}");`
    );
    count++;
  }

  const content = `// Auto-generated — do not edit manually
// Run: pnpm --filter @sg-foundation/icons generate
// Source: @material-symbols/svg-300/rounded (Weight 300, Rounded)
//
// To add icons: edit packages/icons/src/generate.ts

import { createIcon } from "../UIIcon";

${exports.join("\n")}
`;

  writeFileSync(resolve(OUTPUT_DIR, "icons.ts"), content, "utf-8");
  console.log(`✅ Generated ${count} icons`);
}

generate();
