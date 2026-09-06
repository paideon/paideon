// packages/tokens/scripts/generate-css-vars.js
//
// Calls generateCssVariables() and writes the result to apps/portal.
// All token-flattening logic lives in src/generators/css.ts — this script
// only touches the filesystem.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateCssVariables } from "../dist/generators/css.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// NOTE: apps/portal is Paideon's single frontend (no separate admin app like
// Nexus has apps/web + apps/admin) — one output target for now.
const targets = [join(__dirname, "../../../apps/portal/src/app/tokens.css")];

const css = generateCssVariables();

for (const target of targets) {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, css);
  console.log(`Wrote ${css.length} bytes -> ${target}`);
}
