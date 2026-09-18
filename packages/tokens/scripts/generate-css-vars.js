// packages/tokens/scripts/generate-css-vars.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { generateCssVariables } from "../src/generators/css.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const portalPath = path.resolve(
  __dirname,
  "../../../apps/portal/src/app/tokens.css"
);

const css = generateCssVariables();
fs.writeFileSync(portalPath, css, "utf8");
console.log(`Generated ${portalPath}`);
