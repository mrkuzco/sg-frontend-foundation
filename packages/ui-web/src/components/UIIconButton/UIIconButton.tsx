import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { IUIIconButtonProps } from "./UIIconButton.types";
import { iconButtonVariants } from "./UIIconButton.styles";

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
