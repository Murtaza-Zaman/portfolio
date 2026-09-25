import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";

/**
 * TerminalCard — Animated Git Bash-style terminal that types out
 * engineering philosophy lines with a live typewriter effect.
 *
 * Motion enhancements:
 * - GSAP entrance: card fades + slides in from right on mount
 * - Scan-line overlay adds CRT texture
 * - Cursor blinks via CSS animation (GPU-cheap)
 * Designed to never trap or interfere with page scrolling.
 */

const LINES = [
  { type: "prompt", text: "git status" },
  { type: "output", text: "On branch main · Working tree clean" },
  { type: "blank" },
  { type: "prompt", text: "cat philosophy.md" },
  { type: "comment", text: "# 1. Build for reality, not resumes." },
  { type: "comment", text: "# 2. Every line of code must earn its place." },
  { type: "comment", text: "# 3. Architect for resilience, scale with tests." },
  { type: "comment", text: "# 4. Ship with clarity. Scale with discipline." },
  { type: "blank" },
  { type: "prompt", text: "npm run test && git push origin main" },
  { type: "success", text: "✓ 131 tests passed · Deployed to production" },
];

const CHAR_DELAY = 22;   // ms per character
const LINE_PAUSE = 340;  // ms pause between lines
const LOOP_PAUSE = 4200; // ms pause before loop restart

export function TerminalCard() {
  const [rendered, setRendered] = useState([]);
  const [typing, setTyping] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const timerRef = useRef(null);
  const cardRef = useRef(null);

  // GSAP entrance animation
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  // Typewriter sequence (React state machine — unchanged logic)
  useEffect(() => {
    if (lineIdx >= LINES.length) {
      timerRef.current = setTimeout(() => {
        setRendered([]);
        setTyping("");
        setLineIdx(0);
        setCharIdx(0);
      }, LOOP_PAUSE);
      return;
    }

    const line = LINES[lineIdx];

    if (line.type === "blank") {
      timerRef.current = setTimeout(() => {
        setRendered((prev) => [...prev, line]);
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      }, LINE_PAUSE / 2);
      return;
    }

    const target = line.text;

    if (charIdx < target.length) {
      timerRef.current = setTimeout(() => {
        setTyping(target.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, CHAR_DELAY);
    } else {
      timerRef.current = setTimeout(() => {
        setRendered((prev) => [...prev, { ...line, text: target }]);
        setTyping("");
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      }, LINE_PAUSE);
    }

    return () => clearTimeout(timerRef.current);
  }, [lineIdx, charIdx]);

  const currentLine = lineIdx < LINES.length ? LINES[lineIdx] : null;

  return (
    <div
      ref={cardRef}
      className="relative flex flex-col rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-slate-950/30 bg-[#0d1117] text-slate-200 select-none w-full min-h-[360px] max-w-lg justify-self-center lg:justify-self-end"
      style={{ opacity: 0 }} // GSAP will reveal it
    >
      {/* CRT scan-line overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
        }}
      />

      {/* Git Bash Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-700/60 shrink-0">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ef4444] inline-block shadow-sm" />
          <span className="h-3 w-3 rounded-full bg-[#eab308] inline-block shadow-sm" />
          <span className="h-3 w-3 rounded-full bg-[#22c55e] inline-block shadow-sm" />
        </div>
        <span className="font-mono text-xs text-slate-400 font-medium tracking-wide">
          bash — murtaza@dev: ~/portfolio (main)
        </span>
        <div className="w-10" />
      </div>

      {/* Terminal Content */}
      <div className="flex-1 p-5 font-mono text-[13px] leading-[1.7] space-y-0.5 overflow-hidden">
        {rendered.map((line, i) => (
          <TerminalLine key={i} line={line} />
        ))}

        {/* Currently typing line */}
        {currentLine && currentLine.type !== "blank" && (
          <div className="flex items-start">
            <LinePrefix type={currentLine.type} />
            <span className={lineColor(currentLine.type)}>
              {typing}
              <span className="terminal-cursor" />
            </span>
          </div>
        )}

        {/* Idle prompt */}
        {lineIdx >= LINES.length && (
          <div className="flex items-center gap-1 text-teal-400">
            <span>$</span>
            <span className="terminal-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}

function TerminalLine({ line }) {
  if (line.type === "blank") return <div className="h-2" />;
  return (
    <div className="flex items-start">
      <LinePrefix type={line.type} />
      <span className={lineColor(line.type)}>{line.text}</span>
    </div>
  );
}

function LinePrefix({ type }) {
  if (type === "prompt") {
    return <span className="shrink-0 text-teal-400 mr-2 font-bold select-none">$</span>;
  }
  return null;
}

function lineColor(type) {
  if (type === "prompt") return "text-slate-100 font-medium";
  if (type === "output") return "text-slate-400";
  if (type === "comment") return "text-emerald-400/90";
  if (type === "success") return "text-teal-300 font-semibold";
  return "text-slate-300";
}
