import { type ButtonHTMLAttributes, type ReactNode } from "react";

export interface IUIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual hierarchy */
  variant?: "primary" | "secondary" | "tertiary";
  /** Button size */
  size?: "lg" | "sm";
  /** Floating style — adds shadow, secondary becomes white bg */
  floating?: boolean;
  /** Render as a different element (e.g. anchor) via Radix Slot */
  asChild?: boolean;
  /** Icon before the label */
  leadingIcon?: ReactNode;
  /** Icon after the label */
  trailingIcon?: ReactNode;
  /** Show loading spinner */
  isLoading?: boolean;
}
