import { useEffect, useRef } from "react";
import { cursorState } from "./CursorState";

const MAX_PARTICLES = 140;

export function CursorParticles() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

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

    // Initialize particle pool
    const particles = particlesRef.current;
    particles.length = 0;

    const colors = [
      "rgba(6, 182, 212, ",   // Cyan
      "rgba(248, 250, 252, ", // Luminous white
      "rgba(34, 211, 238, ",  // Light cyan
      "rgba(244, 63, 94, ",   // Accent crimson data fragment
    ];

    const spawnParticle = (x, y, speedVx, speedVy, isBurst = false) => {
      if (particles.length >= MAX_PARTICLES) {
        particles.shift();
      }

      const angle = isBurst
        ? Math.random() * Math.PI * 2
        : Math.atan2(speedVy, speedVx) + (Math.random() - 0.5) * 1.2 + Math.PI;

      const speed = isBurst
        ? 2 + Math.random() * 5.5
        : 0.5 + Math.random() * 2.2;

      // Color selection (mostly cyan & white, rare crimson)
      const colorBase =
        Math.random() > 0.92
          ? colors[3]
          : colors[Math.floor(Math.random() * 3)];

      particles.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: isBurst ? 1.5 + Math.random() * 2 : 1 + Math.random() * 2,
        alpha: isBurst ? 1 : 0.75 + Math.random() * 0.25,
        decay: isBurst ? 0.022 + Math.random() * 0.015 : 0.018 + Math.random() * 0.02,
        colorBase,
        isBurst,
      });
    };

    // Listen for click bursts
    const unsubscribeBurst = cursorState.subscribeBurst((bx, by) => {
      for (let i = 0; i < 22; i++) {
        spawnParticle(bx, by, 0, 0, true);
      }
    });

    let lastTime = performance.now();

    // 60 FPS Canvas render loop
    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      cursorState.update(dt);

      ctx.clearRect(0, 0, width, height);

      // Spawn trail particles based on mouse velocity and visibility
      if (cursorState.isVisible && cursorState.speed > 0.3 && cursorState.mode !== "thinking") {
        const spawnCount = Math.min(Math.floor(cursorState.speed * 0.45) + 1, 4);
        for (let i = 0; i < spawnCount; i++) {
          spawnParticle(cursorState.x, cursorState.y, cursorState.vx, cursorState.vy);
        }
      }

      // Render & update active particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96; // Fluid friction
        p.vy *= 0.96;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `${p.colorBase}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle soft glow for burst or brighter particles
        if (p.isBurst && p.alpha > 0.5) {
          ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      unsubscribeBurst();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9997]"
      style={{ willChange: "transform" }}
    />
  );
}
