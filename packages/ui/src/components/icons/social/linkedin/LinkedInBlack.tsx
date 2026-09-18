// Auto-generated – do not edit manually.
// Source: packages/ui/scripts/generate-icons.js

import { cn } from "../../../../utilities/cn";
import { type SocialIconProps, sizeMap } from "../types";

export type { SocialIconProps };

export function LinkedInBlack({
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
        d="M0,0 L682,0 L694,3 L707,10 L717,19 L723,27 L728,37 L731,50 L731,729 L728,742 L722,754 L711,766 L701,773 L687,778 L683,779 L-1,779 L-14,775 L-24,770 L-36,759 L-42,750 L-47,739 L-49,728 L-49,51 L-46,37 L-39,24 L-30,14 L-22,8 L-12,3 Z M117,108 L101,112 L86,120 L75,130 L66,143 L61,155 L59,163 L59,185 L62,197 L69,211 L79,223 L91,232 L104,238 L119,241 L131,241 L145,238 L157,233 L167,226 L172,222 L180,212 L188,196 L191,185 L191,164 L188,152 L181,138 L172,127 L162,119 L146,111 L133,108 Z M472,283 L452,285 L433,290 L418,296 L404,304 L391,314 L378,327 L368,342 L365,343 L365,293 L256,293 L256,663 L370,663 L371,461 L373,443 L377,427 L382,415 L388,405 L396,397 L408,390 L422,386 L429,385 L450,385 L466,389 L478,396 L485,404 L493,420 L497,436 L499,452 L500,663 L615,663 L615,446 L613,412 L609,386 L604,366 L598,350 L589,333 L579,320 L570,311 L556,301 L539,293 L519,287 L499,284 L483,283 Z M68,293 L68,663 L182,663 L182,293 Z "
        fill={color || "#000000"}
        transform="translate(49,0)"
      />
      <path
        d="M0,0 L13,0 L21,4 L27,12 L28,15 L28,26 L25,33 L20,38 L12,42 L2,42 L-5,39 L-10,35 L-14,27 L-14,15 L-10,7 L-4,2 Z M5,3 L-3,6 L-9,13 L-10,16 L-10,26 L-5,34 L2,38 L12,38 L20,33 L24,25 L24,17 L20,9 L13,4 Z "
        fill={color || "#000000"}
        transform="translate(812,627)"
      />
      <path
        d="M0,0 L12,0 L17,3 L17,11 L13,14 L18,23 L13,23 L8,16 L8,14 L4,14 L4,23 L0,23 Z M4,4 L4,10 L12,10 L13,5 L12,4 Z "
        fill={color || "#000000"}
        transform="translate(811,636)"
      />
    </svg>
  );
}
