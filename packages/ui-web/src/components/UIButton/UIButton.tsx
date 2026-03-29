import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type { IUIButtonProps } from "./UIButton.types";
import { buttonVariants, floatingStyles } from "./UIButton.styles";

export const UIButton = forwardRef<
  HTMLButtonElement,
  IUIButtonProps & VariantProps<typeof buttonVariants>
>(
  (
    {
      className,
      variant = "primary",
      size,
      floating = false,
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
        className={cn(
          buttonVariants({ variant, size }),
          floating && floatingStyles[variant || "primary"],
          className,
        )}
        ref={ref}
        role="button"
        disabled={disabled}
        aria-busy={isLoading || undefined}
        data-loading={isLoading || undefined}
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
