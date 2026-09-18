// Auto-generated – do not edit manually.
// Source: packages/ui/scripts/generate-icons.js

import { cn } from "../../../../utilities/cn";
import { type SocialIconProps, sizeMap } from "../types";

export type { SocialIconProps };

export function YouTubeInlineBlack({
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
      viewBox="0 0 1705 573"
      aria-hidden="true"
      focusable="false"
      className={cn(sizeClass, className)}
      style={customStyle}
      {...props}
    >
      <path
        d="M0,0 L58,0 L103,1 L146,3 L177,6 L192,9 L202,13 L213,21 L221,31 L226,42 L230,59 L233,82 L235,112 L235,177 L233,207 L229,236 L225,250 L219,261 L211,270 L200,277 L190,281 L172,284 L133,287 L74,289 L-15,289 L-74,287 L-113,284 L-131,281 L-143,276 L-154,268 L-161,260 L-168,246 L-172,226 L-175,197 L-176,179 L-176,110 L-174,80 L-171,57 L-167,41 L-162,31 L-154,21 L-146,15 L-136,10 L-125,7 L-100,4 L-69,2 L-44,1 Z M-11,84 L-11,205 L1,199 L18,189 L42,175 L68,160 L92,146 L94,144 L69,130 L52,120 L26,105 L0,90 Z "
        fill={color || "#212121"}
        transform="translate(380,141)"
      />
      <path
        d="M0,0 L41,0 L41,93 L48,84 L58,77 L67,74 L79,73 L91,75 L99,79 L106,87 L111,98 L115,116 L117,143 L117,191 L115,217 L111,236 L106,247 L100,256 L91,262 L86,264 L80,265 L71,265 L60,263 L50,258 L44,253 L40,247 L37,262 L0,262 Z M55,104 L49,108 L44,114 L41,122 L41,226 L46,231 L51,234 L58,235 L65,232 L69,226 L72,214 L73,206 L73,128 L70,112 L66,106 L63,104 Z "
        fill={color || "#212121"}
        transform="translate(1256,150)"
      />
      <path
        d="M0,0 L43,0 L44,145 L47,155 L50,156 L60,156 L67,150 L70,144 L71,0 L114,0 L114,185 L77,185 L76,175 L76,165 L74,165 L72,171 L68,177 L59,185 L50,188 L36,189 L24,187 L16,183 L11,178 L7,173 L3,164 L1,155 L0,146 Z "
        fill={color || "#212121"}
        transform="translate(909,227)"
      />
      <path
        d="M0,0 L42,0 L43,143 L46,153 L49,156 L59,156 L65,152 L69,145 L70,0 L113,0 L113,185 L77,185 L76,183 L74,165 L69,175 L64,181 L56,186 L50,188 L35,189 L24,187 L14,182 L6,173 L2,163 L0,154 Z "
        fill={color || "#212121"}
        transform="translate(1122,227)"
      />
      <path
        d="M0,0 L42,0 L45,9 L62,86 L68,119 L68,125 L70,125 L71,113 L78,77 L95,3 L96,0 L138,0 L137,8 L110,105 L91,173 L90,253 L48,253 L47,174 L23,86 L0,2 Z "
        fill={color || "#212121"}
        transform="translate(654,159)"
      />
      <path
        d="M0,0 L17,1 L29,4 L39,10 L46,17 L54,33 L58,50 L60,70 L60,123 L58,143 L54,160 L47,174 L40,182 L30,188 L20,191 L13,192 L-9,192 L-23,189 L-33,184 L-41,177 L-47,167 L-51,156 L-54,142 L-56,116 L-56,78 L-54,54 L-50,35 L-42,19 L-35,11 L-25,5 L-12,1 Z M-1,30 L-6,33 L-9,37 L-12,50 L-13,64 L-13,128 L-11,150 L-7,159 L-4,162 L5,163 L10,160 L13,157 L16,146 L17,136 L17,57 L15,42 L11,33 L6,30 Z "
        fill={color || "#212121"}
        transform="translate(833,223)"
      />
      <path
        d="M0,0 L24,0 L37,3 L46,8 L51,13 L57,21 L61,31 L64,45 L65,54 L65,109 L-3,109 L-2,144 L0,154 L3,159 L8,161 L17,160 L22,155 L25,145 L26,131 L48,131 L64,132 L64,150 L61,163 L55,174 L48,181 L40,186 L27,190 L20,191 L0,191 L-13,188 L-23,183 L-29,178 L-36,168 L-41,156 L-44,142 L-45,134 L-45,58 L-42,39 L-36,23 L-29,14 L-21,7 L-10,2 Z M5,29 L0,34 L-2,39 L-3,46 L-3,85 L23,85 L23,48 L21,37 L18,31 L15,29 Z "
        fill={color || "#212121"}
        transform="translate(1433,224)"
      />
      <path
        d="M0,0 L124,0 L124,37 L83,37 L83,253 L41,253 L41,37 L0,37 Z "
        fill={color || "#212121"}
        transform="translate(1010,159)"
      />
    </svg>
  );
}
