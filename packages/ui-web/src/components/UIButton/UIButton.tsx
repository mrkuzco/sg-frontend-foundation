import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type { IUIButtonProps } from "./UIButton.types";

/**
 * Pill button — CTA / pill button / default
 *
 * Figma component with exact state mappings:
 *   Default  → base styles
 *   Hover    → primary: darken overlay | secondary: subtle overlay | tertiary: stronger border
 *   Focused  → primary: darken overlay + focus border | secondary/tertiary: focus border
 *   Pressed  → same as default (no visual change from default)
 *   Disabled → muted bg + muted text
 *   Loading  → spinner, same bg as default
 *
 * Sizes:
 *   lg: 44px h, 24px px, 40px radius, 14px/20px text, 24px icons
 *   sm: 36px h, 12px px, 80px radius, 12px/16px text, 20px icons
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-sans font-medium cursor-pointer",
    "transition-all duration-150",
    "focus-visible:outline-none",
    "disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          // Default + Pressed: solid primary bg, inverse text
          "bg-[image:linear-gradient(var(--color-surface-primary),var(--color-surface-primary))]",
          "text-[var(--color-text-icon-inverse)]",
          // Hover: rgba(0,0,0,0.2) overlay
          "hover:bg-[image:linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2)),linear-gradient(var(--color-surface-primary),var(--color-surface-primary))]",
          // Pressed: back to default
          "active:bg-[image:linear-gradient(var(--color-surface-primary),var(--color-surface-primary))]",
          // Focused: same overlay as hover + 4px focus border
          "focus-visible:bg-[image:linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2)),linear-gradient(var(--color-surface-primary),var(--color-surface-primary))]",
          "focus-visible:border-4 focus-visible:border-[var(--color-border-focus)]",
          // Disabled
          "disabled:bg-[image:none] disabled:bg-[var(--color-surface-disabled)] disabled:text-[var(--color-text-icon-disabled)]",
          "disabled:hover:bg-[image:none] disabled:hover:bg-[var(--color-surface-disabled)]",
        ].join(" "),
        secondary: [
          // Default + Pressed: subtle teal tint
          "bg-[var(--color-surface-bg-10)]",
          "text-[var(--color-text-icon-default)]",
          // Hover: slight darken overlay
          "hover:bg-[image:linear-gradient(rgba(0,0,0,0.03),rgba(0,0,0,0.03)),linear-gradient(var(--color-surface-bg-10),var(--color-surface-bg-10))]",
          // Pressed: back to default
          "active:bg-[var(--color-surface-bg-10)]",
          // Focused: keep bg + 4px focus border
          "focus-visible:border-4 focus-visible:border-[var(--color-border-focus)]",
          // Disabled
          "disabled:bg-[var(--color-surface-disabled)] disabled:text-[var(--color-text-icon-disabled)]",
          "disabled:hover:bg-[var(--color-surface-disabled)]",
        ].join(" "),
        tertiary: [
          // Default + Pressed: transparent with subtle border
          "border border-[var(--color-border-subtle)]",
          "bg-transparent",
          "text-[var(--color-text-icon-default)]",
          // Hover: stronger border
          "hover:border-[var(--color-border-default)]",
          // Pressed: back to subtle border
          "active:border-[var(--color-border-subtle)]",
          // Focused: 4px focus border (replaces default 1px)
          "focus-visible:border-4 focus-visible:border-[var(--color-border-focus)]",
          // Disabled
          "disabled:border-[var(--color-border-disabled)] disabled:text-[var(--color-text-icon-disabled)]",
          "disabled:hover:border-[var(--color-border-disabled)]",
        ].join(" "),
      },
      size: {
        lg: "h-[44px] min-w-[140px] max-w-[380px] rounded-[40px] px-[24px] text-[14px] leading-[20px]",
        sm: "h-[36px] min-w-[80px] max-w-[140px] rounded-[80px] px-[12px] text-[12px] leading-[16px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
);

export const UIButton = forwardRef<
  HTMLButtonElement,
  IUIButtonProps & VariantProps<typeof buttonVariants>
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      leadingIcon,
      trailingIcon,
      isLoading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const iconSize = size === "sm" ? "size-[20px] shrink-0" : "size-[24px] shrink-0";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        role="button"
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className={cn("animate-spin", iconSize)}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <>
            {leadingIcon && <span className={iconSize}>{leadingIcon}</span>}
            <span className="text-center truncate">{children}</span>
            {trailingIcon && <span className={iconSize}>{trailingIcon}</span>}
          </>
        )}
      </Comp>
    );
  },
);

UIButton.displayName = "UIButton";

export { buttonVariants };
