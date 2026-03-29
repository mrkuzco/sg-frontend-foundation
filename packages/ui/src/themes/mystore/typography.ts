export const fontFamily = {
  sans: ["Roboto", "sans-serif"],
} as const;

// Desktop sizes — Tablet and Mobile scale down via responsive breakpoints
export const fontSize = {
  // Display
  "display-lg": ["72px", { lineHeight: "80px", letterSpacing: "0", fontWeight: "700" }],
  "display-lg-light": ["72px", { lineHeight: "80px", letterSpacing: "0", fontWeight: "300" }],
  "display-md": ["56px", { lineHeight: "64px", letterSpacing: "0", fontWeight: "700" }],
  "display-md-light": ["56px", { lineHeight: "64px", letterSpacing: "0", fontWeight: "300" }],
  "display-sm": ["40px", { lineHeight: "48px", letterSpacing: "0", fontWeight: "700" }],
  "display-sm-light": ["40px", { lineHeight: "48px", letterSpacing: "0", fontWeight: "300" }],
  "display-xs": ["28px", { lineHeight: "36px", letterSpacing: "0", fontWeight: "700" }],
  "display-xs-light": ["28px", { lineHeight: "36px", letterSpacing: "0", fontWeight: "300" }],

  // Title
  "title-lg": ["18px", { lineHeight: "26px", letterSpacing: "0", fontWeight: "600" }],
  "title-md": ["16px", { lineHeight: "22px", letterSpacing: "0", fontWeight: "600" }],
  "title-sm": ["14px", { lineHeight: "20px", letterSpacing: "0", fontWeight: "600" }],
  "title-xs": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "400" }],

  // Body
  "body-lg": ["18px", { lineHeight: "26px", letterSpacing: "0", fontWeight: "400" }],
  "body-md": ["16px", { lineHeight: "22px", letterSpacing: "0", fontWeight: "400" }],
  "body-sm": ["14px", { lineHeight: "20px", letterSpacing: "0", fontWeight: "400" }],
  "body-xs": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "400" }],

  // Labels
  "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0", fontWeight: "500" }],
  "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0", fontWeight: "400" }],

  // Special
  "input-line": ["20px", { lineHeight: "28px", letterSpacing: "0", fontWeight: "400" }],
} as const;
