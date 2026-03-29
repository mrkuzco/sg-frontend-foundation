import { cva } from "class-variance-authority";

/**
 * Text button — CTA / text button
 *
 * A minimal text-only button with optional leading/trailing icons.
 * Hover shows underline, focus shows 4px inset border.
 *
 * Sizes:
 *   lg: 16px/24px text, 24px icons
 *   sm: 14px/20px text, 20px icons
 */
export const textButtonVariants = cva(
  [
    "inline-flex items-center gap-2",
    "font-sans font-normal cursor-pointer",
    "text-[var(--color-text-icon-default)]",
    "transition-all duration-150",
    "focus-visible:outline-none",
    "focus-visible:shadow-[inset_0_0_0_4px_var(--color-border-focus)]",
    "focus-visible:rounded-[var(--radius-sm,4px)] focus-visible:px-2",
    "disabled:text-[var(--color-text-icon-disabled)] disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      size: {
        lg: "text-[16px] leading-[24px]",
        sm: "text-[14px] leading-[20px]",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  },
);
