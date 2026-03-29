export const fontFamily = {
  sans: ["Roboto", "sans-serif"],
} as const;

export const fontSize = {
  // Display
  "display-lg": ["80px", { lineHeight: "80px", fontWeight: "700" }],
  "display-md": ["64px", { lineHeight: "72px", fontWeight: "700" }],
  "display-sm": ["48px", { lineHeight: "56px", fontWeight: "700" }],
  "display-xs": ["40px", { lineHeight: "48px", fontWeight: "700" }],

  // Title
  "title-lg": ["32px", { lineHeight: "40px", fontWeight: "700" }],
  "title-md": ["28px", { lineHeight: "36px", fontWeight: "700" }],
  "title-sm": ["24px", { lineHeight: "32px", fontWeight: "600" }],
  "title-xs": ["20px", { lineHeight: "28px", fontWeight: "600" }],
  "title-2xs": ["18px", { lineHeight: "26px", fontWeight: "600" }],

  // Body
  "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
  "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
  "body-sm": ["14px", { lineHeight: "22px", fontWeight: "400" }],
  "body-xs": ["12px", { lineHeight: "16px", fontWeight: "400" }],

  // Labels
  "label-lg": ["16px", { lineHeight: "24px", fontWeight: "500" }],
  "label-md": ["14px", { lineHeight: "20px", fontWeight: "500" }],
  "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
} as const;
