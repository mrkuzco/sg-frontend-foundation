import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";
import { type textButtonVariants } from "./UITextButton.styles";

export interface IUITextButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof textButtonVariants> {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}
