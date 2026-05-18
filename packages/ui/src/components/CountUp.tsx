// CountUp.tsx

//

"use client";

import { useEffect, useRef } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  motion,
  useInView,
} from "framer-motion";

export interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: boolean;
  className?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = false,
  className,
}: CountUpProps) {
  return;
}
