import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@sg-foundation/ui-shared";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-sans font-medium cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-500 text-white hover:bg-primary-700 active:bg-primary-500 disabled:bg-black/[0.03] disabled:text-black/[0.30] disabled:pointer-events-none",
        secondary:
          "bg-secondary-400/10 text-primary-900 hover:bg-secondary-400/20 active:bg-secondary-400/10 disabled:bg-black/[0.03] disabled:text-black/[0.30] disabled:pointer-events-none",
        tertiary:
          "border border-black/10 bg-transparent text-primary-900 hover:border-black/20 active:border-black/10 disabled:border-black/10 disabled:text-black/[0.30] disabled:pointer-events-none",
      },
      size: {
        lg: "h-11 rounded-[40px] px-6 text-sm",
        sm: "h-9 rounded-[80px] px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
);

export interface UIButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  isLoading?: boolean;
}

export const UIButton = forwardRef<HTMLButtonElement, UIButtonProps>(
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
    const iconSize = size === "sm" ? "w-5 h-5" : "w-6 h-6";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
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
            {children}
            {trailingIcon && <span className={iconSize}>{trailingIcon}</span>}
          </>
        )}
      </Comp>
    );
  },
);

UIButton.displayName = "UIButton";

export { buttonVariants };
