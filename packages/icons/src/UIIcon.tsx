import { type SVGProps } from "react";

/**
 * Base icon component.
 *
 * Google Material Symbols — Rounded, Weight 300, Size 24dp
 *
 * Usage:
 *   <IconAdd />                        — 24px default
 *   <IconAdd size={20} />              — explicit size
 *   <IconAdd className="size-5" />     — Tailwind size (overrides width/height)
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
  const Icon = ({ size, className, ...props }: IUIIconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      width={size ?? "100%"}
      height={size ?? "100%"}
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
