import { useEffect, useRef } from "react";
import { cursorState } from "./CursorState";

const TRAIL_LENGTH = 12;

export function CursorTrail() {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const historyRef = useRef([]);

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

    const history = historyRef.current;
    history.length = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (cursorState.isVisible && cursorState.mode !== "thinking") {
        history.unshift({ x: cursorState.x, y: cursorState.y });
        if (history.length > TRAIL_LENGTH) {
          history.pop();
        }
      } else {
        if (history.length > 0) history.pop();
      }

      // Draw smooth quadratic curve through points
      if (history.length > 2 && cursorState.speed > 1.2) {
        ctx.beginPath();
        ctx.moveTo(history[0].x, history[0].y);

        for (let i = 1; i < history.length - 1; i++) {
          const xc = (history[i].x + history[i + 1].x) / 2;
          const yc = (history[i].y + history[i + 1].y) / 2;
          ctx.quadraticCurveTo(history[i].x, history[i].y, xc, yc);
        }

        const opacity = Math.min(cursorState.speed * 0.04, 0.35);
        ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
        ctx.lineWidth = 1.2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9996]"
      style={{ willChange: "transform" }}
    />
  );
}
