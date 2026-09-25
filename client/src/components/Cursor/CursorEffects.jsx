import { useEffect, useRef, useState } from "react";
import { cursorState } from "./CursorState";

export function CursorEffects() {
  const [mode, setMode] = useState(cursorState.mode);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Neural network nodes state
  const nodesRef = useRef([]);
  const pulsePacketRef = useRef({ nodeA: 0, nodeB: 1, progress: 0 });

  useEffect(() => {
    const unsubscribe = cursorState.subscribe((state) => {
      setMode(state.mode);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Initialize 6 neural nodes for thinking mode
    const numNodes = 6;
    nodesRef.current = Array.from({ length: numNodes }, (_, i) => ({
      angle: (i / numNodes) * Math.PI * 2,
      baseRadius: 28 + (i % 2) * 14,
      speed: 0.008 * (i % 2 === 0 ? 1 : -1),
      radiusOffset: Math.sin(i) * 6,
    }));

    let scannerAngle = 0;
    let thinkingAlpha = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = cursorState.x;
      const cy = cursorState.y;

      // ─── 1. AI THINKING MODE: Living Neural Network ───
      if (cursorState.mode === "thinking") {
        thinkingAlpha = Math.min(thinkingAlpha + 0.03, 1);
      } else {
        thinkingAlpha = Math.max(thinkingAlpha - 0.08, 0);
      }

      if (thinkingAlpha > 0.01 && cursorState.isVisible) {
        ctx.save();
        ctx.globalAlpha = thinkingAlpha;

        const nodes = nodesRef.current;
        const positions = [];

        // Update and draw neural nodes
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          n.angle += n.speed;
          const currentRadius = n.baseRadius + Math.sin(Date.now() * 0.002 + i) * 4;
          const nx = cx + Math.cos(n.angle) * currentRadius;
          const ny = cy + Math.sin(n.angle) * currentRadius;
          positions.push({ x: nx, y: ny });

          // Node core
          ctx.fillStyle = "rgba(6, 182, 212, 0.9)";
          ctx.beginPath();
          ctx.arc(nx, ny, 2.2, 0, Math.PI * 2);
          ctx.fill();

          // Node glow
          ctx.fillStyle = "rgba(6, 182, 212, 0.25)";
          ctx.beginPath();
          ctx.arc(nx, ny, 5.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw dynamic neural synaptic connections
        for (let i = 0; i < positions.length; i++) {
          const next = (i + 1) % positions.length;
          const cross = (i + 2) % positions.length;

          // Perimeter synapse
          ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(positions[i].x, positions[i].y);
          ctx.lineTo(positions[next].x, positions[next].y);
          ctx.stroke();

          // Cross-center synapse
          if (i % 2 === 0) {
            ctx.strokeStyle = "rgba(34, 211, 238, 0.18)";
            ctx.beginPath();
            ctx.moveTo(positions[i].x, positions[i].y);
            ctx.lineTo(positions[cross].x, positions[cross].y);
            ctx.stroke();
          }

          // Central core connector
          ctx.strokeStyle = "rgba(6, 182, 212, 0.22)";
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(positions[i].x, positions[i].y);
          ctx.stroke();
        }

        // Traveling synaptic pulse packet
        const packet = pulsePacketRef.current;
        packet.progress += 0.035;
        if (packet.progress >= 1) {
          packet.progress = 0;
          packet.nodeA = packet.nodeB;
          packet.nodeB = Math.floor(Math.random() * positions.length);
        }

        const pA = positions[packet.nodeA] || { x: cx, y: cy };
        const pB = positions[packet.nodeB] || { x: cx, y: cy };
        const px = pA.x + (pB.x - pA.x) * packet.progress;
        const py = pA.y + (pB.y - pA.y) * packet.progress;

        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // ─── 2. ARCHITECTURE SCANNER (Projects) ───
      if ((mode === "scanner" || mode === "project") && cursorState.isVisible) {
        scannerAngle += 0.025;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(scannerAngle);

        ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.stroke();

        // Corner tick marks
        ctx.setLineDash([]);
        ctx.strokeStyle = "rgba(34, 211, 238, 0.7)";
        const tickSize = 4;
        const r = 24;
        // Top tick
        ctx.beginPath();
        ctx.moveTo(0, -r - tickSize);
        ctx.lineTo(0, -r + tickSize);
        ctx.stroke();
        // Bottom tick
        ctx.beginPath();
        ctx.moveTo(0, r - tickSize);
        ctx.lineTo(0, r + tickSize);
        ctx.stroke();

        ctx.restore();
      }

      // ─── 3. CAPABILITY NODE (Services) ───
      if (mode === "service" && cursorState.isVisible) {
        ctx.save();
        ctx.translate(cx, cy);

        ctx.strokeStyle = "rgba(6, 182, 212, 0.45)";
        ctx.lineWidth = 0.8;
        // Crosshair ticks
        ctx.beginPath();
        ctx.moveTo(-16, 0);
        ctx.lineTo(-6, 0);
        ctx.moveTo(6, 0);
        ctx.lineTo(16, 0);
        ctx.moveTo(0, -16);
        ctx.lineTo(0, -6);
        ctx.moveTo(0, 6);
        ctx.lineTo(0, 16);
        ctx.stroke();

        ctx.restore();
      }

      // ─── 4. AI CORE (Hero Section) ───
      if (mode === "hero" && cursorState.isVisible) {
        const time = Date.now() * 0.003;
        ctx.save();
        ctx.translate(cx, cy);

        // Orbiting satellite 1
        const s1x = Math.cos(time) * 16;
        const s1y = Math.sin(time) * 16;
        ctx.fillStyle = "rgba(6, 182, 212, 0.8)";
        ctx.beginPath();
        ctx.arc(s1x, s1y, 1.4, 0, Math.PI * 2);
        ctx.fill();

        // Orbiting satellite 2 (reverse)
        const s2x = Math.cos(-time * 1.3) * 19;
        const s2y = Math.sin(-time * 1.3) * 19;
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.beginPath();
        ctx.arc(s2x, s2y, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9998]"
      style={{ willChange: "transform" }}
    />
  );
}
