import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

/**
 * Icon button — CTA / icon button / default
 *
 * Circular button with only an icon, no text.
 * Same variant colors as pill button: primary, secondary, tertiary.
 *
 * Sizes:
 *   lg: 44px circle, 24px icon
 *   md: 36px circle, 20px icon
 *   sm: 28px circle, 16px icon
 */
const focusRing = "focus-visible:shadow-[inset_0_0_0_4px_var(--color-border-focus)]";

const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "cursor-pointer rounded-full",
    "transition-all duration-150",
    "focus-visible:outline-none",
    focusRing,
    "disabled:cursor-not-allowed",
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
          "disabled:bg-[image:none] disabled:bg-[var(--color-surface-disabled)] disabled:text-[var(--color-text-icon-disabled)] disabled:shadow-none",
        ].join(" "),
        secondary: [
          "bg-[var(--color-surface-bg-10)]",
          "text-[var(--color-text-icon-default)]",
          "hover:bg-[image:linear-gradient(rgba(0,0,0,0.03),rgba(0,0,0,0.03)),linear-gradient(var(--color-surface-bg-10),var(--color-surface-bg-10))]",
          "active:bg-[var(--color-surface-bg-10)]",
          "disabled:bg-[var(--color-surface-disabled)] disabled:text-[var(--color-text-icon-disabled)] disabled:shadow-none",
        ].join(" "),
        tertiary: [
          "border border-[var(--color-border-subtle)]",
          "bg-transparent",
          "text-[var(--color-text-icon-default)]",
          "hover:border-[var(--color-border-default)]",
          "active:border-[var(--color-border-subtle)]",
          "focus-visible:border-transparent",
          "disabled:border-[var(--color-border-disabled)] disabled:text-[var(--color-text-icon-disabled)] disabled:shadow-none",
        ].join(" "),
      },
      size: {
        lg: "size-[44px]",
        md: "size-[36px]",
        sm: "size-[28px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface IUIIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: ReactNode;
}

export const UIIconButton = forwardRef<HTMLButtonElement, IUIIconButtonProps>(
  ({ className, variant, size, icon, disabled, ...props }, ref) => {
    const iconSize = size === "sm" ? "size-[16px]" : size === "lg" ? "size-[24px]" : "size-[20px]";

    return (
      <button
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        <span className={iconSize}>{icon}</span>
      </button>
    );
  },
);

UIIconButton.displayName = "UIIconButton";

export { iconButtonVariants };
