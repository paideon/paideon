// Auto-generated – do not edit manually.
// Source: packages/ui/scripts/generate-icons.js

import { cn } from "../../../../utilities/cn";
import { type SocialIconProps, sizeMap } from "../types";

export type { SocialIconProps };

export function YouTubeWhite({
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
      viewBox="0 0 1255 1075"
      aria-hidden="true"
      focusable="false"
      className={cn(sizeClass, className)}
      style={customStyle}
      {...props}
    >
      <path
        d="M0,0 L178,0 L251,2 L314,5 L365,9 L396,13 L417,18 L430,23 L444,31 L454,39 L467,52 L476,66 L483,81 L488,99 L492,119 L496,148 L500,194 L502,232 L503,264 L503,314 L501,368 L497,421 L492,459 L486,488 L480,505 L471,521 L460,534 L453,541 L439,551 L420,560 L400,565 L372,569 L325,573 L269,576 L210,578 L163,579 L15,579 L-65,577 L-131,574 L-184,570 L-215,566 L-235,562 L-251,556 L-265,548 L-276,539 L-287,528 L-297,514 L-305,497 L-309,484 L-314,458 L-318,427 L-321,393 L-323,358 L-324,332 L-324,246 L-322,201 L-318,151 L-313,114 L-308,90 L-302,74 L-294,60 L-283,46 L-271,35 L-257,26 L-242,19 L-223,14 L-195,10 L-151,6 L-97,3 L-42,1 Z M7,166 L7,412 L12,410 L40,394 L64,380 L90,365 L114,351 L140,336 L164,322 L190,307 L214,293 L219,290 L219,288 L196,275 L172,261 L146,246 L120,231 L94,216 L68,201 L42,186 L16,171 Z "
        fill={color || "#FFFFFF"}
        transform="translate(538,248)"
      />
    </svg>
  );
}
