// Auto-generated – do not edit manually.
// Source: packages/ui/scripts/generate-icons.js

import { cn } from "../../../../utilities/cn";
import { type SocialIconProps, sizeMap } from "../types";

export type { SocialIconProps };

export function LinkedInWhite({
  size = "md",
  color,
  className,
  style,
  ref,
  ...props
}: SocialIconProps) {
  const isToken = typeof size === "string" && size in sizeMap;
  const sizeClass = isToken ? sizeMap[size] : "";
  const customStyle =
    !isToken && size ? { width: size, height: size, ...style } : style;

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 840 779"
      aria-hidden="true"
      focusable="false"
      className={cn(sizeClass, className)}
      style={customStyle}
      {...props}
    >
      <path
        d="M0,0 L683,0 L695,3 L708,10 L720,21 L728,35 L731,45 L732,52 L732,727 L729,741 L722,755 L713,765 L703,772 L692,777 L683,779 L0,779 L-14,775 L-26,768 L-37,757 L-44,745 L-48,729 L-48,50 L-44,34 L-37,22 L-26,11 L-16,5 L-5,1 Z M118,108 L102,112 L90,118 L80,126 L71,136 L63,152 L60,163 L59,178 L62,194 L67,206 L74,216 L82,225 L96,234 L109,239 L119,241 L132,241 L146,238 L158,233 L169,225 L179,215 L187,201 L191,189 L192,184 L192,165 L188,150 L181,137 L172,126 L160,117 L147,111 L134,108 Z M472,283 L453,285 L434,290 L419,296 L403,305 L392,314 L379,327 L372,337 L369,342 L366,343 L366,293 L256,293 L256,663 L371,663 L372,459 L375,437 L380,421 L386,409 L395,399 L403,393 L415,388 L430,385 L451,385 L467,389 L477,395 L482,399 L489,409 L495,423 L499,443 L500,455 L501,663 L615,663 L615,426 L612,398 L607,373 L601,355 L593,338 L584,325 L573,313 L560,303 L545,295 L524,288 L500,284 L484,283 Z M69,293 L69,663 L183,663 L183,293 Z "
        fill={color || "#FFFFFF"}
        transform="translate(48,0)"
      />
      <path
        d="M0,0 L13,0 L21,4 L26,10 L28,16 L28,26 L24,34 L17,40 L12,42 L2,42 L-5,39 L-11,34 L-14,28 L-14,14 L-10,7 L-4,2 Z M5,3 L-3,6 L-9,13 L-10,16 L-10,26 L-6,33 L-1,37 L2,38 L12,38 L18,34 L23,28 L24,24 L24,17 L20,9 L13,4 Z "
        fill={color || "#FFFFFF"}
        transform="translate(812,627)"
      />
      <path
        d="M0,0 L11,0 L16,2 L17,3 L17,11 L15,13 L12,13 L18,23 L13,23 L8,16 L8,14 L4,14 L4,23 L0,23 Z M4,4 L4,10 L12,10 L13,5 L11,4 Z "
        fill={color || "#FFFFFF"}
        transform="translate(811,636)"
      />
    </svg>
  );
}
