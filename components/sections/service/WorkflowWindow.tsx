"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Database,
  Filter,
  MessageSquare,
  Sparkles,
  Webhook,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

/**
 * n8n-inspired node-flow visualization.
 *
 * Layout (percentages of the SVG viewBox 400×260):
 *   ┌───────────────────────────────────────┐
 *   │  ┌────┐                               │
 *   │  │TRIG│─────┐                         │
 *   │  └────┘     │                         │
 *   │             ▼                         │
 *   │          ┌─────┐         ┌──────┐    │
 *   │          │ AI  │────────▶│FILTER│──┬─▶ SLACK
 *   │          └─────┘         └──────┘  │
 *   │          /     \                    └─▶ CRM
 *   │       MODEL  MEMORY                   │
 *   └───────────────────────────────────────┘
 *
 * A "spark" travels along the connections in sequence, lighting each node briefly
 * as it arrives. Counter increments after each full cycle.
 */

type NodeKind = "trigger" | "agent" | "tool" | "filter" | "output";

type FlowNode = {
  id: string;
  kind: NodeKind;
  icon: LucideIcon;
  label: string;
  sub?: string;
  /** Center coordinates in SVG viewBox space (0–400, 0–260). */
  cx: number;
  cy: number;
  /** Rendered width/height of the card in viewBox units. */
  w: number;
  h: number;
};

type Edge = {
  from: string;
  to: string;
};

/** A "beat" in the animation: which node lights up. Beats run sequentially. */
type Beat = {
  /** Node that should pulse at this beat. */
  node: string;
  /** Edge to highlight leading INTO this node (optional — first beat has none). */
  edge?: { from: string; to: string };
};

const NODES: FlowNode[] = [
  {
    id: "trigger",
    kind: "trigger",
    icon: Webhook,
    label: "Webhook",
    sub: "form.submit",
    cx: 60,
    cy: 50,
    w: 96,
    h: 38,
  },
  {
    id: "agent",
    kind: "agent",
    icon: Bot,
    label: "AI Agent",
    sub: "Tools · Memory",
    cx: 200,
    cy: 100,
    w: 116,
    h: 46,
  },
  {
    id: "model",
    kind: "tool",
    icon: Sparkles,
    label: "Claude",
    cx: 152,
    cy: 192,
    w: 70,
    h: 30,
  },
  {
    id: "memory",
    kind: "tool",
    icon: Database,
    label: "Postgres",
    cx: 246,
    cy: 192,
    w: 70,
    h: 30,
  },
  {
    id: "filter",
    kind: "filter",
    icon: Filter,
    label: "Filter · lead score",
    cx: 332,
    cy: 60,
    w: 110,
    h: 34,
  },
  {
    id: "slack",
    kind: "output",
    icon: MessageSquare,
    label: "Slack",
    cx: 348,
    cy: 130,
    w: 78,
    h: 30,
  },
  {
    id: "crm",
    kind: "output",
    icon: Zap,
    label: "CRM",
    cx: 348,
    cy: 178,
    w: 78,
    h: 30,
  },
];

const EDGES: Edge[] = [
  { from: "trigger", to: "agent" },
  { from: "model", to: "agent" },
  { from: "memory", to: "agent" },
  { from: "agent", to: "filter" },
  { from: "filter", to: "slack" },
  { from: "filter", to: "crm" },
];

/** Sequence of beats — the spark visits nodes in this order. */
const SEQUENCE: Beat[] = [
  { node: "trigger" },
  { node: "agent", edge: { from: "trigger", to: "agent" } },
  { node: "model", edge: { from: "model", to: "agent" } },
  { node: "memory", edge: { from: "memory", to: "agent" } },
  { node: "filter", edge: { from: "agent", to: "filter" } },
  { node: "slack", edge: { from: "filter", to: "slack" } },
  { node: "crm", edge: { from: "filter", to: "crm" } },
];

const BEAT_MS = 650;
const CYCLE_PAUSE_MS = 1100;

function nodeById(id: string) {
  const n = NODES.find((x) => x.id === id);
  if (!n) throw new Error(`Node not found: ${id}`);
  return n;
}

/**
 * Build a smooth cubic-bezier path between two nodes.
 * Horizontal-biased for left-to-right flow, vertical-biased for stacked sub-nodes.
 */
function edgePath(from: FlowNode, to: FlowNode): string {
  // Connection points on node edges (not centers) so the path doesn't pass under
  // the card. For each node we pick the side closest to the other endpoint.
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  const horizontal = Math.abs(dx) >= Math.abs(dy);

  let x1 = from.cx;
  let y1 = from.cy;
  let x2 = to.cx;
  let y2 = to.cy;

  if (horizontal) {
    x1 = dx > 0 ? from.cx + from.w / 2 : from.cx - from.w / 2;
    x2 = dx > 0 ? to.cx - to.w / 2 : to.cx + to.w / 2;
  } else {
    y1 = dy > 0 ? from.cy + from.h / 2 : from.cy - from.h / 2;
    y2 = dy > 0 ? to.cy - to.h / 2 : to.cy + to.h / 2;
  }

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Control points bow the curve gently in the major axis
  const c1x = horizontal ? midX : x1;
  const c1y = horizontal ? y1 : midY;
  const c2x = horizontal ? midX : x2;
  const c2y = horizontal ? y2 : midY;

  return `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
}

export function WorkflowWindow() {
  const [counter, setCounter] = useState(247);
  const [beatIdx, setBeatIdx] = useState(0);

  // Advance the spark through the sequence; pause after the final beat then loop.
  useEffect(() => {
    if (beatIdx < SEQUENCE.length - 1) {
      const t = setTimeout(() => setBeatIdx((i) => i + 1), BEAT_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCounter((c) => c + 1);
      setBeatIdx(0);
    }, CYCLE_PAUSE_MS);
    return () => clearTimeout(t);
  }, [beatIdx]);

  const activeNode = SEQUENCE[beatIdx].node;
  const activeEdge = SEQUENCE[beatIdx].edge;
  // Nodes already visited in this cycle (lit up but not pulsing)
  const visited = new Set(SEQUENCE.slice(0, beatIdx + 1).map((b) => b.node));

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-[var(--color-text)] shadow-[0_30px_60px_-20px_rgba(29,29,27,0.45)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-bg)]/10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
          </span>
          <span
            className="font-body uppercase text-[10px] text-[var(--color-bg)]/70"
            style={{ letterSpacing: "0.16em" }}
          >
            LIVE · workflow.run
          </span>
        </div>
        <span
          className="font-body text-[10px] text-[var(--color-bg)]/40"
          style={{ letterSpacing: "0.04em" }}
        >
          lead-handler.flow
        </span>
      </div>

      {/* Counter */}
      <div className="flex items-baseline justify-between px-4 py-3 border-b border-[var(--color-bg)]/10">
        <div className="flex items-baseline gap-2">
          <motion.span
            key={counter}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="font-display italic text-[var(--color-accent)] text-[28px] md:text-[32px] leading-none tabular-nums"
          >
            {counter}
          </motion.span>
          <span
            className="font-body uppercase text-[10px] text-[var(--color-bg)]/55"
            style={{ letterSpacing: "0.18em" }}
          >
            ejecuciones hoy
          </span>
        </div>
        <span
          className="font-body text-[10px] text-[var(--color-bg)]/35"
          style={{ letterSpacing: "0.04em" }}
        >
          ahorradas: 47h
        </span>
      </div>

      {/* Flow canvas — fixed aspect, dot grid bg */}
      <div
        className="relative"
        style={{
          background:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
          backgroundSize: "14px 14px",
          height: 260,
        }}
      >
        <svg
          viewBox="0 0 400 260"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0"
        >
          <defs>
            {/* Soft glow for the active spark */}
            <filter id="wf-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {EDGES.map((e) => {
            const from = nodeById(e.from);
            const to = nodeById(e.to);
            const d = edgePath(from, to);
            const isActive =
              activeEdge?.from === e.from && activeEdge?.to === e.to;
            // Whether this edge has already been traversed in the current cycle
            const traversed = SEQUENCE.slice(0, beatIdx + 1).some(
              (b) => b.edge?.from === e.from && b.edge?.to === e.to,
            );
            return (
              <g key={`${e.from}-${e.to}`}>
                {/* Base line */}
                <path
                  d={d}
                  fill="none"
                  stroke={traversed ? "rgba(123,197,123,0.35)" : "rgba(255,255,255,0.14)"}
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  strokeDasharray={traversed ? "0" : "3 3"}
                />
                {/* Active spark traversing this edge */}
                {isActive && (
                  <motion.path
                    key={`spark-${beatIdx}`}
                    d={d}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    filter="url(#wf-glow)"
                    initial={{ pathLength: 0, opacity: 0.9 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: BEAT_MS / 1000,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map((n) => {
            const isActive = activeNode === n.id;
            const isVisited = visited.has(n.id);
            const Icon = n.icon;

            const stroke = isActive
              ? "var(--color-accent)"
              : isVisited
                ? "rgba(123,197,123,0.55)"
                : "rgba(255,255,255,0.15)";
            const fill = isActive
              ? "rgba(194,38,58,0.16)"
              : isVisited
                ? "rgba(123,197,123,0.08)"
                : "rgba(255,255,255,0.04)";

            return (
              <motion.g
                key={n.id}
                animate={{ scale: isActive ? 1.06 : 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ transformOrigin: `${n.cx}px ${n.cy}px`, transformBox: "fill-box" }}
              >
                {/* Outer glow when active */}
                {isActive && (
                  <motion.rect
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.7, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                    x={n.cx - n.w / 2 - 4}
                    y={n.cy - n.h / 2 - 4}
                    width={n.w + 8}
                    height={n.h + 8}
                    rx={10}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth={1}
                  />
                )}
                <rect
                  x={n.cx - n.w / 2}
                  y={n.cy - n.h / 2}
                  width={n.w}
                  height={n.h}
                  rx={8}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={1}
                />
                {/* Icon dot */}
                <circle
                  cx={n.cx - n.w / 2 + 14}
                  cy={n.cy}
                  r={8}
                  fill={
                    isActive
                      ? "rgba(194,38,58,0.28)"
                      : isVisited
                        ? "rgba(123,197,123,0.22)"
                        : "rgba(255,255,255,0.08)"
                  }
                />
                {/* Lucide icon via foreignObject so we get the same vector */}
                <foreignObject
                  x={n.cx - n.w / 2 + 8}
                  y={n.cy - 6}
                  width={12}
                  height={12}
                >
                  <div style={{ color: isActive ? "var(--color-accent)" : isVisited ? "#7BC57B" : "rgba(253,253,251,0.55)" }}>
                    <Icon size={12} strokeWidth={2.2} />
                  </div>
                </foreignObject>
                {/* Label */}
                <text
                  x={n.cx - n.w / 2 + 28}
                  y={n.sub ? n.cy - 2 : n.cy + 3}
                  fontFamily="var(--font-helvena), system-ui, sans-serif"
                  fontSize={n.sub ? 9.5 : 10}
                  fontWeight={500}
                  fill="rgba(253,253,251,0.92)"
                >
                  {n.label}
                </text>
                {n.sub && (
                  <text
                    x={n.cx - n.w / 2 + 28}
                    y={n.cy + 9}
                    fontFamily="var(--font-helvena), system-ui, sans-serif"
                    fontSize={7.5}
                    fill="rgba(253,253,251,0.42)"
                    style={{ letterSpacing: "0.04em" }}
                  >
                    {n.sub}
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>

        {/* Bottom-left status pill */}
        <div
          className="absolute left-3 bottom-3 flex items-center gap-1.5 px-2 py-1 rounded-full"
          style={{
            background: "rgba(194,38,58,0.16)",
            border: "1px solid rgba(194,38,58,0.4)",
          }}
        >
          <Zap size={9} className="text-[var(--color-accent)]" />
          <span
            className="font-body uppercase text-[8.5px] text-[var(--color-accent)]"
            style={{ letterSpacing: "0.14em" }}
          >
            1 click · runs forever
          </span>
        </div>
      </div>
    </div>
  );
}
