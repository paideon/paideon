// packages/ui/src/components/visualization/StudentJourneyFlow.tsx
"use client";

import { useState } from "react";

import { cn } from "../../utilities/cn";

export interface JourneyNode {
  id: string;
  label: string;
  description?: string;
  streams?: string[];
  position: { x: number; y: number };
}

export interface JourneyEdge {
  from: string;
  to: string;
  label?: string;
}

export interface StudentJourneyFlowProps {
  nodes: JourneyNode[];
  edges: JourneyEdge[];
  className?: string;
  corePathLabel?: string;
  selectedLabel?: string;
  optionalPathLabel?: string;
}

export function StudentJourneyFlow({
  nodes,
  edges,
  className,
  corePathLabel = "Core Path",
  selectedLabel = "Selected",
  optionalPathLabel = "Optional Path",
}: StudentJourneyFlowProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const getConnectedNodes = (nodeId: string) => {
    const connected = new Set<string>();
    edges.forEach((edge) => {
      if (edge.from === nodeId) connected.add(edge.to);
      if (edge.to === nodeId) connected.add(edge.from);
    });
    return connected;
  };

  const isHighlighted = (nodeId: string) => {
    if (!hoveredNode && !selectedNode) return false;
    if (hoveredNode === nodeId || selectedNode === nodeId) return true;
    if (hoveredNode) return getConnectedNodes(hoveredNode).has(nodeId);
    if (selectedNode) return getConnectedNodes(selectedNode).has(nodeId);
    return false;
  };

  return (
    <div className={cn("relative overflow-x-auto py-space-8", className)}>
      <svg
        viewBox="0 0 1000 400"
        className="w-full min-w-[800px] h-auto bg-surface-base"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="8"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-gold-base)" />
          </marker>
        </defs>

        {edges.map((edge, idx) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;
          const isHighlightedEdge =
            hoveredNode === edge.from ||
            hoveredNode === edge.to ||
            selectedNode === edge.from ||
            selectedNode === edge.to;
          return (
            <g key={idx}>
              <line
                x1={fromNode.position.x}
                y1={fromNode.position.y}
                x2={toNode.position.x}
                y2={toNode.position.y}
                stroke={
                  isHighlightedEdge
                    ? "var(--color-gold-base)"
                    : "var(--border-light)"
                }
                strokeWidth={isHighlightedEdge ? 2 : 1.5}
                strokeDasharray={isHighlightedEdge ? "none" : "4"}
                markerEnd="url(#arrowhead)"
              />
              {edge.label && (
                <text
                  x={(fromNode.position.x + toNode.position.x) / 2}
                  y={(fromNode.position.y + toNode.position.y) / 2 - 5}
                  textAnchor="middle"
                  className="font-body text-caption fill-text-muted"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {nodes.map((node) => {
          const isHighlightedNode = isHighlighted(node.id);
          const isSelected = selectedNode === node.id;
          return (
            <g
              key={node.id}
              transform={`translate(${node.position.x}, ${node.position.y})`}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(isSelected ? null : node.id)}
              className="cursor-pointer"
            >
              <rect
                x={-60}
                y={-30}
                width={120}
                height={60}
                rx={4}
                fill={
                  isHighlightedNode
                    ? "var(--surface-elevated)"
                    : "var(--surface-default)"
                }
                stroke={
                  isSelected
                    ? "var(--color-gold-base)"
                    : isHighlightedNode
                    ? "var(--color-gold-pale)"
                    : "var(--border-light)"
                }
                strokeWidth={isSelected ? 2 : 1}
                className="transition-all duration-200"
              />
              <text
                x={0}
                y={-5}
                textAnchor="middle"
                className={cn(
                  "font-display text-sm fill-text-primary font-medium",
                  isSelected && "fill-gold-base"
                )}
              >
                {node.label}
              </text>
              {node.streams && node.streams.length > 0 && (
                <text
                  x={0}
                  y={12}
                  textAnchor="middle"
                  className="font-body text-caption fill-text-muted"
                >
                  {node.streams.join(", ")}
                </text>
              )}
              {node.description && isSelected && (
                <>
                  <rect
                    x={-70}
                    y={40}
                    width={140}
                    height={40}
                    rx={4}
                    fill="var(--surface-inverse)"
                    opacity={0.9}
                  />
                  <text
                    x={0}
                    y={62}
                    textAnchor="middle"
                    className="font-body text-caption fill-text-inverse"
                  >
                    {node.description}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      <div className="flex justify-center gap-space-6 mt-space-8 text-center">
        <div className="flex items-center gap-space-2">
          <div className="w-3 h-3 rounded-full bg-green-base" />
          <span className="font-body text-caption text-text-muted">
            {corePathLabel}
          </span>
        </div>
        <div className="flex items-center gap-space-2">
          <div className="w-3 h-3 rounded-full bg-gold-base" />
          <span className="font-body text-caption text-text-muted">
            {selectedLabel}
          </span>
        </div>
        <div className="flex items-center gap-space-2">
          <div className="w-6 h-0.5 bg-border-light" />
          <span className="font-body text-caption text-text-muted">
            {optionalPathLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
