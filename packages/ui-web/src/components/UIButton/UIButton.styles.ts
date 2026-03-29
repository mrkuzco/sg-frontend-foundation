import { cva } from "class-variance-authority";

/**
 * Pill button — CTA / pill button / default + floating
 *
 * States: Default, Hover, Focused, Pressed, Disabled, Loading
 * Variants: primary, secondary, tertiary
 * Sizes: lg (44px), sm (36px)
 * Floating: adds shadow, secondary becomes white bg
 */
export const focusRing = "focus-visible:shadow-[inset_0_0_0_4px_var(--color-border-focus)]";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-sans cursor-pointer",
    "transition-all duration-150",
    "focus-visible:outline-none",
    focusRing,
    "disabled:cursor-not-allowed",
    "data-[loading]:pointer-events-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-[image:linear-gradient(var(--color-surface-primary),var(--color-surface-primary))]",
          "text-[var(--color-text-icon-inverse)]",
          "hover:bg-[image:linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2)),linear-gradient(var(--color-surface-primary),var(--color-surface-primary))]",
          "active:bg-[image:linear-gradient(var(--color-surface-primary),var(--color-surface-primary))]",
          "focus-visible:bg-[image:linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2)),linear-gradient(var(--color-surface-primary),var(--color-surface-primary))]",
          "disabled:bg-[image:none] disabled:bg-[var(--color-surface-disabled)] disabled:text-[var(--color-text-icon-disabled)]",
          "disabled:hover:bg-[image:none] disabled:hover:bg-[var(--color-surface-disabled)]",
          "disabled:shadow-none",
        ].join(" "),
        secondary: [
          "bg-[var(--color-surface-bg-10)]",
          "text-[var(--color-text-icon-default)]",
          "hover:bg-[image:linear-gradient(rgba(0,0,0,0.03),rgba(0,0,0,0.03)),linear-gradient(var(--color-surface-bg-10),var(--color-surface-bg-10))]",
          "active:bg-[var(--color-surface-bg-10)]",
          "disabled:bg-[var(--color-surface-disabled)] disabled:text-[var(--color-text-icon-disabled)]",
          "disabled:hover:bg-[var(--color-surface-disabled)]",
          "disabled:shadow-none",
        ].join(" "),
        tertiary: [
          "border border-[var(--color-border-subtle)]",
          "bg-transparent",
          "text-[var(--color-text-icon-default)]",
          "hover:border-[var(--color-border-default)]",
          "active:border-[var(--color-border-subtle)]",
          "focus-visible:border-transparent",
          "disabled:border-[var(--color-border-disabled)] disabled:text-[var(--color-text-icon-disabled)]",
          "disabled:hover:border-[var(--color-border-disabled)]",
          "disabled:shadow-none",
        ].join(" "),
      },
      size: {
        lg: [
          "h-[44px] min-w-[140px] max-w-[380px] rounded-[40px] px-[24px]",
          "text-[length:var(--text-btn-pill-lg)] leading-[var(--text-btn-pill-lg--line-height)]",
          "font-[weight:var(--text-btn-pill-lg--font-weight)]",
        ].join(" "),
        sm: [
          "h-[36px] min-w-[80px] max-w-[140px] rounded-[80px] px-[12px]",
          "text-[length:var(--text-btn-pill-sm)] leading-[var(--text-btn-pill-sm--line-height)]",
          "font-[weight:var(--text-btn-pill-sm--font-weight)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
);

// Floating styles per variant (from Figma: CTA / pill button / floating)
export const floatingStyles = {
  // Primary floating: shadow-down-xxl
  primary: "shadow-[var(--shadow-shadow-down-xxl)]",
  // Secondary floating: white bg + shadow-down-xl (overrides teal tint)
  secondary: [
    "bg-[var(--color-surface-lightest)]",
    "shadow-[var(--shadow-shadow-down-xl)]",
    "hover:bg-[image:linear-gradient(rgba(0,0,0,0.03),rgba(0,0,0,0.03)),linear-gradient(var(--color-surface-lightest),var(--color-surface-lightest))]",
    "active:bg-[var(--color-surface-lightest)]",
  ].join(" "),
  tertiary: "", // Floating tertiary doesn't exist in Figma
};
