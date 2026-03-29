import { type SVGProps } from "react";

/**
 * Base icon component.
 *
 * Google Material Symbols — Rounded, Weight 300, Size 24dp
 *
 * Usage:
 *   <UIIcon name="add" />
 *   <UIIcon name="arrow_forward" className="size-5" />
 */
export interface IUIIconProps extends SVGProps<SVGSVGElement> {
  /** Size in pixels. Defaults to 24 (matching Figma 24dp). */
  size?: number;
}

/**
 * Creates a React icon component from an SVG path string.
 * Used by the generated icon files.
 */
export function createIcon(displayName: string, path: string) {
  const Icon = ({ size = 24, className, ...props }: IUIIconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d={path} />
    </svg>
  );

  Icon.displayName = displayName;
  return Icon;
}
