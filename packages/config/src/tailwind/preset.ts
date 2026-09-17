import { paideonTheme } from "@paideon/tokens";
import type { Config } from "tailwindcss";

export const paideonPreset: Partial<Config> = {
  theme: paideonTheme as unknown as Config["theme"],
  plugins: [],
};
