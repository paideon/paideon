// packages/tokens/src/generators/figma.ts

// Intentionally not implemented. There's no Figma file, no designer
// workflow, and no concrete consumer for a Figma token export today —
// building this now would be complexity with no one to use it. This file
// exists only so the folder structure has the extension point ready;
// fill it in when there's an actual need (e.g. a designer asks for
// synced tokens, or Nexus grows a formal design-review step in Figma).

export function generateFigmaTokens(): never {
  throw new Error('generateFigmaTokens() is not implemented');
}
