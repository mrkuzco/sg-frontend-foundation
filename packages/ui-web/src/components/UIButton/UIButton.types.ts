import { type ButtonHTMLAttributes, type ReactNode } from "react";

export interface IUIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual hierarchy */
  variant?: "primary" | "secondary" | "tertiary";
  /** Button size */
  size?: "lg" | "sm";
  /** Render as a different element (e.g. anchor) via Radix Slot */
  asChild?: boolean;
  /** Icon before the label */
  leadingIcon?: ReactNode;
  /** Icon after the label */
  trailingIcon?: ReactNode;
  /** Show loading spinner */
  isLoading?: boolean;
}
