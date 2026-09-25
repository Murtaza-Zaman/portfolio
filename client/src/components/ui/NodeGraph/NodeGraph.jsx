/**
 * NodeGraph — Premium Tech Stack Node Graph Component.
 *
 * Visual Structure:
 * - 6 Skill Nodes radiating around a central core on a dark navy dot-grid canvas.
 * - GSAP-powered DrawSVG line animation, un-synced ambient floating, and traveling energy pulses.
 * - High-performance 60fps mouse parallax (gsap.quickTo) and interactive focus state.
 * - Interactive tech stack tooltips revealed on hover or mobile tap.
 */

import { useState, useRef, useMemo, memo } from "react";
import { DEFAULT_GRAPH_NODES, DEFAULT_GRAPH_CENTER } from "./nodeGraphData";
import { useNodeGraphAnimation } from "./useNodeGraphAnimation";

export const NodeGraph = memo(function NodeGraph({
  nodes = DEFAULT_GRAPH_NODES,
  center = DEFAULT_GRAPH_CENTER,
  className = "",
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [activeNodeId, setActiveNodeId] = useState(null);

  const displayNodes = useMemo(() => {
    const rawList = Array.isArray(nodes) && nodes.length > 0 ? nodes : DEFAULT_GRAPH_NODES;
    return rawList.map((node, index) => {
      const fallbackDef = DEFAULT_GRAPH_NODES[index] || DEFAULT_GRAPH_NODES[0];
      return {
        ...fallbackDef,
        ...node,
        id: node.id || node.nodeId || fallbackDef.id || `node-${index + 1}`,
        label: node.label || fallbackDef.label,
        abbr: node.abbr || fallbackDef.abbr,
        category: node.category || fallbackDef.category,
        color: node.color || fallbackDef.color,
        glowColor: node.glowColor || fallbackDef.glowColor,
        bgGradient: node.bgGradient || fallbackDef.bgGradient,
        x: typeof node.x === "number" ? node.x : Number(node.x) || fallbackDef.x,
        y: typeof node.y === "number" ? node.y : Number(node.y) || fallbackDef.y,
        depth: typeof node.depth === "number" ? node.depth : Number(node.depth) || fallbackDef.depth,
        skills: Array.isArray(node.skills) ? node.skills : fallbackDef.skills,
        desc: node.desc || fallbackDef.desc,
      };
    });
  }, [nodes]);

  const { handleNodeInteraction } = useNodeGraphAnimation({
    containerRef,
    svgRef,
    nodes: displayNodes,
    center,
    hoveredNodeId: activeNodeId,
    setHoveredNodeId: setActiveNodeId,
  });

  const onNodeMouseEnter = (nodeId) => {
    setActiveNodeId(nodeId);
    handleNodeInteraction(nodeId, true);
  };

  const onNodeMouseLeave = () => {
    setActiveNodeId(null);
    handleNodeInteraction(null, false);
  };

  const onNodeClick = (nodeId) => {
    // Toggle for touch devices
    if (activeNodeId === nodeId) {
      setActiveNodeId(null);
      handleNodeInteraction(null, false);
    } else {
      setActiveNodeId(nodeId);
      handleNodeInteraction(nodeId, true);
    }
  };

  // Generate background dot-grid coordinates
  const gridDots = [];
  const cols = 14;
  const rows = 10;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      gridDots.push({
        id: `dot-${r}-${c}`,
        cx: 50 + c * 70,
        cy: 40 + r * 68,
      });
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[400px] lg:min-h-[480px] select-none flex items-center justify-center overflow-visible ${className}`}
      style={{
        "--spot-x": "50%",
        "--spot-y": "50%",
      }}
      aria-label="Interactive Technology Stack Node Graph"
      role="region"
    >
      {/* ── Background Cursor Spotlight Vignette ─────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl opacity-30 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(circle 320px at var(--spot-x, 50%) var(--spot-y, 50%), rgba(6,182,212,0.14) 0%, rgba(5,12,26,0) 80%)",
        }}
      />

      {/* ── Parallax Wrapper for 60fps mouse tracking ────────────── */}
      <div className="ng-parallax-group relative w-full h-full flex items-center justify-center">
        {/* ── SVG Connection Network Layer ───────────────────────── */}
        <svg
          ref={svgRef}
          viewBox="0 0 1000 700"
          className="ng-scroll-drift absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            {/* Ambient Line Gradient */}
            <linearGradient id="ng-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0891b2" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.15" />
            </linearGradient>

            {/* Core Pulse Filter */}
            <filter id="ng-glow-core" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Particle Glow Filter */}
            <filter id="ng-glow-particle" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Background Dot Grid (rippled from center) */}
          <g className="ng-grid-layer opacity-40">
            {gridDots.map((dot) => (
              <circle
                key={dot.id}
                className="ng-grid-dot"
                cx={dot.cx}
                cy={dot.cy}
                r="1.2"
                fill="#334155"
              />
            ))}
          </g>

          {/* 2. Concentric Central Ambient Rings */}
          <g className="ng-center-core" transform={`translate(${center.x}, ${center.y})`}>
            {/* Outer Halo */}
            <circle
              className="ng-core-halo"
              r="36"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1"
              strokeDasharray="4 6"
              opacity="0.25"
            />
            {/* Mid Ring */}
            <circle
              r="22"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="1.2"
              opacity="0.5"
            />
            {/* Core Solid Glow */}
            <circle
              r="10"
              fill="#06b6d4"
              opacity="0.8"
              filter="url(#ng-glow-core)"
            />
            <circle r="4" fill="#ffffff" />
          </g>

          {/* 3. Radiating Connector Lines */}
          <g className="ng-lines-layer">
            {displayNodes.map((node) => (
              <line
                key={node.id}
                data-line-id={node.id}
                className="ng-line transition-all duration-300"
                x1={center.x}
                y1={center.y}
                x2={node.x}
                y2={node.y}
                stroke={node.color}
                strokeWidth="1.2"
                strokeDasharray="4 6"
                opacity="0.6"
              />
            ))}
          </g>

          {/* 4. Traveling Energy Data Pulses */}
          <g className="ng-pulses-layer">
            {displayNodes.map((node) => (
              <circle
                key={node.id}
                data-pulse-id={node.id}
                className="ng-pulse-dot"
                cx={center.x}
                cy={center.y}
                r="3"
                fill="#ffffff"
                filter="url(#ng-glow-particle)"
                opacity="0"
              />
            ))}
          </g>

          {/* 5. Unconnected Ambient Floating Particles */}
          <circle
            className="ng-orbit-particle"
            cx={center.x - 70}
            cy={center.y + 40}
            r="2"
            fill="#22d3ee"
            opacity="0.6"
            filter="url(#ng-glow-particle)"
          />
          <circle
            className="ng-orbit-particle"
            cx={center.x + 80}
            cy={center.y - 50}
            r="1.8"
            fill="#a855f7"
            opacity="0.5"
            filter="url(#ng-glow-particle)"
          />
        </svg>

        {/* ── HTML Nodes Layer (Positioned over coordinates) ───────── */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {displayNodes.map((node) => {
            const isTarget = activeNodeId === node.id;
            const leftPct = (node.x / 1000) * 100;
            const topPct = (node.y / 700) * 100;

            return (
              <div
                key={node.id}
                data-node-id={node.id}
                className="ng-node-item absolute pointer-events-auto cursor-pointer focus:outline-none"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: isTarget ? 30 : Math.round(node.depth * 10),
                }}
                onMouseEnter={() => onNodeMouseEnter(node.id)}
                onMouseLeave={onNodeMouseLeave}
                onClick={() => onNodeClick(node.id)}
                tabIndex={0}
                role="button"
                aria-expanded={isTarget}
                aria-label={`${node.label} technology stack`}
              >
                {/* Pre-blurred Glow Layer (Animated via Opacity for 60FPS) */}
                <div
                  className="ng-node-glow absolute -inset-3 rounded-full blur-md pointer-events-none transition-opacity duration-300"
                  style={{
                    backgroundColor: node.glowColor,
                    opacity: 0.45,
                  }}
                />

                {/* Node Glass Circle */}
                <div
                  className="ng-node-circle relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border backdrop-blur-md transition-all duration-300 shadow-lg"
                  style={{
                    background: node.bgGradient,
                    borderColor: `${node.color}60`,
                    boxShadow: isTarget
                      ? `0 0 24px ${node.glowColor}, inset 0 0 12px ${node.color}40`
                      : `0 0 12px ${node.glowColor}`,
                  }}
                >
                  <span
                    className="font-mono text-xs sm:text-sm font-bold tracking-wider"
                    style={{ color: node.color }}
                  >
                    {node.abbr}
                  </span>

                  {/* Active Indicator Pulse Ring */}
                  {isTarget && (
                    <span
                      className="absolute -inset-1 rounded-full border animate-ping pointer-events-none opacity-40"
                      style={{ borderColor: node.color }}
                    />
                  )}
                </div>

                {/* Node Label & Category Tag */}
                <div className="ng-node-label absolute left-1/2 -translate-x-1/2 top-full mt-1.5 flex flex-col items-center pointer-events-none text-center whitespace-nowrap">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 font-semibold">
                    {node.category}
                  </span>
                  <span
                    className={`font-display text-xs sm:text-sm font-medium transition-colors duration-200 ${
                      isTarget ? "text-white font-semibold" : "text-slate-200"
                    }`}
                  >
                    {node.label}
                  </span>
                </div>

                {/* Interactive Tooltip Card (Revealed on hover / tap) */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-52 sm:w-60 p-3 rounded-xl bg-[#090f1e]/95 border border-slate-700/60 backdrop-blur-xl shadow-2xl transition-all duration-300 pointer-events-none ${
                    isTarget
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-2 scale-95"
                  }`}
                  style={{ zIndex: 40 }}
                >
                  <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-slate-800">
                    <span
                      className="font-mono text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: node.color }}
                    >
                      {node.label}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {node.abbr}
                    </span>
                  </div>

                  <p className="text-[11px] leading-snug text-slate-300 mb-2">
                    {node.desc}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {node.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
