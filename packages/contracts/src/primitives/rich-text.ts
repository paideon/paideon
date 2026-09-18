// packages/contracts/src/primitives/rich-text.ts

// Rich text content contract for Tiptap-authored content.
//
// Notes:
//   Content is stored as a Tiptap/ProseMirror JSON document in ContentEntry.data,
//   matching what apps/admin's RichTextEditor (F-150) will save via editor.getJSON().
//   Rendered in the web app via the RichTextRenderer component in @paideon/ui.
//   Keep this schema's node/mark shape in sync with the TiptapNode type in
//   RichTextRenderer.tsx — if the editor's extensions change (new node types,
//   renamed attrs), update both together.

import { z } from "zod";

const TiptapMarkSchema = z.object({
  type: z.string(),
  attrs: z.record(z.string(), z.unknown()).optional(),
});

export type TiptapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: z.infer<typeof TiptapMarkSchema>[];
  text?: string;
};

/**
 * The exact shape RichTextRenderer.tsx consumes directly as its `value`
 * prop — a single Tiptap document node (`{ type: 'doc', content: [...] }`),
 * not wrapped in anything. Exported (not just used internally) so any
 * consumer that stores a bare Tiptap document — e.g. NewsArticle.content,
 * which is a dedicated Prisma Json column rather than a ContentEntry.data
 * blob — can validate against this directly instead of RichTextSchema's
 * wrapped shape below.
 */
export const TiptapNodeSchema: z.ZodType<TiptapNode> = z.lazy(() =>
  z.object({
    type: z.string(),
    attrs: z.record(z.string(), z.unknown()).optional(),
    content: z.array(TiptapNodeSchema).optional(),
    marks: z.array(TiptapMarkSchema).optional(),
    text: z.string().optional(),
  })
);

/**
 * ⚠️ Wrapped shape (`{ content: TiptapNode }`) — kept for whatever
 * ContentEntry-authored `RichTextData`-typed fields already rely on it.
 * Note this does NOT match what RichTextRenderer takes as `value` — pass
 * `.content`, not the whole object, e.g. `<RichTextRenderer value={data.content} />`.
 * New code storing a bare Tiptap document (no wrapper) should use
 * `TiptapNodeSchema` directly instead of introducing another wrapped field.
 */
export const RichTextSchema = z.object({
  content: TiptapNodeSchema,
});

export type RichTextData = z.infer<typeof RichTextSchema>;
