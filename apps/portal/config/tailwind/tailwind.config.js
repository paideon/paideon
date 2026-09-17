const { paideonPreset } = require("@paideon/config/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  presets: [paideonPreset],
  content: [
    "./{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}",
    "!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};
