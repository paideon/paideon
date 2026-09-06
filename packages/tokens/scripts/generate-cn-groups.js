// packages/tokens/scripts/generate-cn-groups.js
//
// Calls generateCnUtility() and writes the result to packages/ui. All the
// class-flattening logic lives in src/generators/cn.ts — this script only
// touches the filesystem.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateCnUtility } from "../dist/generators/cn.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const target = join(__dirname, "../../ui/src/utilities/cn.ts");

const source = generateCnUtility();

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, source);
console.log(`Wrote ${source.length} bytes -> ${target}`);
