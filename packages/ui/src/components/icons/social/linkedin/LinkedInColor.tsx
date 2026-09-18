// Auto-generated – do not edit manually.
// Source: packages/ui/scripts/generate-icons.js

import { cn } from "../../../../utilities/cn";
import { type SocialIconProps, sizeMap } from "../types";

export type { SocialIconProps };

export function LinkedInColor({
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
      viewBox="0 0 635 540"
      aria-hidden="true"
      focusable="false"
      className={cn(sizeClass, className)}
      style={customStyle}
      {...props}
    >
      <path
        d="M0,0 L473,0 L484,4 L492,10 L499,18 L503,26 L505,35 L505,501 L503,510 L498,520 L489,529 L477,535 L473,536 L0,536 L-11,532 L-19,526 L-26,518 L-30,510 L-32,501 L-32,35 L-30,26 L-25,16 L-16,7 L-4,1 Z M79,75 L68,79 L57,86 L49,96 L44,107 L42,118 L43,130 L47,141 L55,152 L64,159 L72,163 L78,165 L90,166 L104,163 L114,158 L122,151 L129,140 L133,129 L133,111 L129,100 L123,91 L115,83 L101,76 L97,75 Z M319,195 L304,198 L291,203 L280,209 L267,220 L258,231 L256,236 L253,236 L253,202 L178,202 L178,456 L256,456 L257,319 L259,302 L264,286 L271,276 L279,270 L290,266 L295,265 L313,265 L323,268 L331,273 L337,280 L342,292 L345,309 L346,456 L424,456 L425,365 L425,314 L424,289 L421,266 L415,245 L407,229 L398,218 L390,211 L376,203 L361,198 L340,195 Z M49,202 L49,456 L127,456 L127,202 Z "
        fill={color || "#2867B2"}
        transform="translate(32,0)"
      />
      <path
        d="M0,0 L15,0 L26,4 L35,11 L41,20 L44,28 L45,39 L43,49 L38,59 L34,64 L25,70 L14,74 L1,74 L-11,70 L-21,62 L-27,52 L-30,41 L-30,33 L-28,24 L-24,16 L-16,7 L-4,1 Z M2,5 L-9,9 L-18,17 L-24,29 L-24,44 L-20,54 L-14,61 L-4,67 L4,69 L11,69 L21,66 L30,60 L37,50 L39,44 L39,30 L35,20 L28,12 L20,7 L13,5 Z "
        fill={color || "#2867B2"}
        transform="translate(590,466)"
      />
      <path
        d="M0,0 L22,0 L28,4 L29,6 L29,17 L24,22 L20,23 L30,38 L30,40 L23,40 L13,25 L13,23 L6,23 L6,40 L0,40 Z M6,5 L6,17 L19,17 L23,13 L22,8 L17,5 Z "
        fill={color || "#2867B2"}
        transform="translate(584,483)"
      />
    </svg>
  );
}
