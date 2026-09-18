"use client";

import type { ReactNode } from "react";

import { InlineLink } from "./InlineLink";
import { QuoteBlock } from "./QuoteBlock";
import { cn } from "../../utilities/cn";
import { ImageFrame } from "../media/ImageFrame";

/**
 * Minimal shape of a Tiptap/ProseMirror JSON document.
 * Covers the node/mark types apps/admin's RichTextEditor supports today:
 * headings, paragraphs, bold/italic/link marks, images, lists, blockquotes.
 *
 * ⚠️ Verify these type names (`heading`, `bulletList`, `link`, image attrs, etc.)
 * against the actual Tiptap extensions configured in RichTextEditor.tsx once
 * it's implemented — custom extensions can rename nodes or add attrs (e.g. a
 * dedicated `caption` attr on the image node instead of `title`).
 */
interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

export interface RichTextRendererProps {
  value: unknown;
  className?: string;
}

function extractPlainText(node: TiptapNode | undefined): string {
  if (!node?.content) return "";
  return node.content
    .map((child) =>
      child.type === "text" ? child.text ?? "" : extractPlainText(child)
    )
    .join("");
}

function renderMarks(text: string, marks: TiptapMark[] | undefined): ReactNode {
  if (!marks || marks.length === 0) return text;

  return marks.reduce<ReactNode>((acc, mark) => {
    switch (mark.type) {
      case "bold":
        return <strong className="font-semibold">{acc}</strong>;
      case "italic":
        return <em className="italic font-quote">{acc}</em>;
      case "link": {
        const href =
          typeof mark.attrs?.href === "string" ? mark.attrs.href : "#";
        return (
          <InlineLink href={href} external={href.startsWith("http")}>
            {acc}
          </InlineLink>
        );
      }
      default:
        return acc;
    }
  }, text);
}

function renderNode(node: TiptapNode, key: number): ReactNode {
  const children = () => node.content?.map((child, i) => renderNode(child, i));

  switch (node.type) {
    case "paragraph":
      return (
        <p
          key={key}
          className="font-body text-body text-text-primary mb-space-4 leading-relaxed"
        >
          {children()}
        </p>
      );

    case "heading": {
      const level = (node.attrs?.level as number) ?? 2;
      if (level <= 2) {
        return (
          <h2
            key={key}
            className="font-display text-h2 mt-space-8 mb-space-4 text-text-primary"
          >
            {children()}
          </h2>
        );
      }
      if (level === 3) {
        return (
          <h3
            key={key}
            className="font-display text-h3 mt-space-6 mb-space-3 text-text-primary"
          >
            {children()}
          </h3>
        );
      }
      return (
        <h4
          key={key}
          className="font-display text-h3 mt-space-4 mb-space-2 text-text-primary"
        >
          {/* Using text-h3 as fallback; consider adding a text-h4 token */}
          {children()}
        </h4>
      );
    }

    case "bulletList":
      return (
        <ul
          key={key}
          className="flex flex-col gap-space-1 list-disc pl-space-6 mb-space-4"
        >
          {children()}
        </ul>
      );

    case "orderedList":
      return (
        <ol
          key={key}
          className="flex flex-col gap-space-1 list-decimal pl-space-6 mb-space-4"
        >
          {children()}
        </ol>
      );

    case "listItem":
      return (
        <li key={key} className="font-body text-body text-text-primary">
          {children()}
        </li>
      );

    case "blockquote":
      return (
        <QuoteBlock
          key={key}
          variant="pull-quote"
          quote={extractPlainText(node)}
        />
      );

    case "image":
      return (
        <figure key={key} className="my-space-6">
          <ImageFrame
            src={(node.attrs?.src as string) ?? ""}
            alt={(node.attrs?.alt as string) ?? ""}
            aspectRatio="hero"
            variant="standard"
          />
          {node.attrs?.title ? (
            <figcaption className="text-center font-body text-caption text-text-muted mt-space-2">
              {node.attrs.title as string}
            </figcaption>
          ) : null}
        </figure>
      );

    case "hardBreak":
      return <br key={key} />;

    case "text":
      return <span key={key}>{renderMarks(node.text ?? "", node.marks)}</span>;

    default:
      return null;
  }
}

export function RichTextRenderer({ value, className }: RichTextRendererProps) {
  if (!value || typeof value !== "object") return null;

  const doc = value as TiptapNode;
  if (doc.type !== "doc" || !Array.isArray(doc.content)) return null;

  return (
    <div className={cn("max-w-none", className)}>
      {doc.content.map((node, i) => renderNode(node, i))}
    </div>
  );
}
