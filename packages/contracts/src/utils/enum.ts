// packages/contracts/src/utils/enum.ts

// Helpers for pairing a Zod enum with its runtime value list, and the
// assertNever exhaustiveness helper used at the bottom of any switch that
// must handle every enum member.

export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}
