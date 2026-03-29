import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { IUITextButtonProps } from "./UITextButton.types";
import { textButtonVariants } from "./UITextButton.styles";

export const UITextButton = forwardRef<HTMLButtonElement, IUITextButtonProps>(
  ({ className, size, leadingIcon, trailingIcon, children, disabled, ...props }, ref) => {
    const iconSize = size === "sm" ? "size-[20px] shrink-0" : "size-[24px] shrink-0";

    return (
      <button
        className={cn(textButtonVariants({ size, className }))}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {trailingIcon && <span className={iconSize}>{trailingIcon}</span>}
        <span className="hover:underline decoration-[var(--color-text-icon-default)] underline-offset-2">
          {children}
        </span>
        {leadingIcon && <span className={iconSize}>{leadingIcon}</span>}
      </button>
    );
  },
);

UITextButton.displayName = "UITextButton";

export { textButtonVariants };
