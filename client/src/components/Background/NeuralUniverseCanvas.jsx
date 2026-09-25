/**
 * NeuralUniverseCanvas — Living Sentient Engineering Universe Canvas Engine
 *
 * Hardware-Accelerated 60-120 FPS Features:
 * - Layer 2: Neural Particle Web with dynamic proximity line connections & traveling photon packets.
 * - Layer 3: Major Constellation Hubs with glowing double-halos & orbiting micro-satellites.
 * - Layer 4: Vertical digital bus data lines with ascending data packet trails.
 * - Layer 5: High-speed cosmic laser data streams / shooting photon beams.
 * - Layer 6: Interactive Gravitational Shockwave Ripples (spawn on click & quick mouse flick).
 * - Layer 7: Cursor Magnetic Intelligence & ephemeral kinetic stardust trail.
 *
 * Auto-pauses on document hidden / tab background for 0% CPU consumption.
 */

import { memo, useEffect, useRef } from "react";

// Canvas System Constants
const PARTICLE_COUNT_DESKTOP = 70;
const PARTICLE_COUNT_MOBILE = 35;
const MAX_CONNECTION_DIST = 140;
const CURSOR_INTERACTION_RADIUS = 200;
const DATA_STREAM_COUNT = 10;
const HUB_COUNT = 5;

export const NeuralUniverseCanvas = memo(function NeuralUniverseCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animFrameId = null;
    let isRunning = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const isMobile = width < 768;
    const particleCount = isMobile
      ? PARTICLE_COUNT_MOBILE
      : PARTICLE_COUNT_DESKTOP;

    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    // Mouse & Kinetic Stardust
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      prevX: -1000,
      prevY: -1000,
      active: false,
      radius: CURSOR_INTERACTION_RADIUS,
    };

    const stardust = [];
    const shockwaves = [];
    const shootingBeams = [];

    // ── 1. Initialize Neural Particles ─────────────────────────────
    const particles = [];
    const colors = [
      "rgba(6, 182, 212,",   // Electric Cyan
      "rgba(45, 212, 191,",  // Aurora Teal
      "rgba(96, 165, 250,",  // Cosmic Blue
      "rgba(167, 139, 250,", // Neon Violet
      "rgba(255, 255, 255,", // Pure Starlight
    ];

    for (let i = 0; i < particleCount; i++) {
      const z = 0.35 + Math.random() * 0.65;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42 * z,
        vy: (Math.random() - 0.5) * 0.42 * z,
        radius: (1.3 + Math.random() * 1.8) * z,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.3 + Math.random() * 0.55 * z,
        pulseSpeed: 0.018 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI * 2,
        z,
        highlight: 0,
      });
    }

    // ── 2. Initialize Major Constellation Hubs ─────────────────────
    const hubs = [];
    for (let h = 0; h < HUB_COUNT; h++) {
      hubs.push({
        x: (width * (h + 1)) / (HUB_COUNT + 1) + (Math.random() - 0.5) * 120,
        y: (height * 0.2) + Math.random() * (height * 0.6),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        coreRadius: 3.5 + Math.random() * 2,
        orbitRadius: 18 + Math.random() * 14,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitSpeed: 0.02 + Math.random() * 0.02,
        satellites: [
          { angle: 0, dist: 14 + Math.random() * 10, radius: 1.4, speed: 0.025 },
          { angle: Math.PI, dist: 22 + Math.random() * 8, radius: 1.1, speed: -0.018 },
        ],
        pulse: 0,
      });
    }

    // ── 3. Traveling Neural Data Pulses ─────────────────────────────
    const dataPulses = [];
    const spawnDataPulse = (p1, p2) => {
      if (dataPulses.length > 16) return;
      dataPulses.push({
        p1,
        p2,
        progress: 0,
        speed: 0.02 + Math.random() * 0.03,
        color: "rgba(34, 211, 238, 0.95)",
      });
    };

    // ── 4. Vertical Bus Data Streams ────────────────────────────────
    const dataStreams = [];
    const streamSpacing = width / DATA_STREAM_COUNT;
    for (let i = 0; i < DATA_STREAM_COUNT; i++) {
      dataStreams.push({
        x: i * streamSpacing + Math.random() * (streamSpacing * 0.8),
        speed: 0.8 + Math.random() * 1.4,
        packets: [
          { y: Math.random() * height, length: 24 + Math.random() * 36, alpha: 0.2 + Math.random() * 0.25 },
          { y: Math.random() * height, length: 14 + Math.random() * 24, alpha: 0.12 + Math.random() * 0.2 },
        ],
      });
    }

    // ── 5. Shockwave / Ripple Spawner ──────────────────────────────
    const addShockwave = (x, y, powerful = false) => {
      if (shockwaves.length > 6) return;
      shockwaves.push({
        x,
        y,
        radius: 5,
        maxRadius: powerful ? Math.min(width, height) * 0.48 : 180,
        speed: powerful ? 7.5 : 4.5,
        alpha: powerful ? 0.75 : 0.45,
      });
    };

    // ── 6. Cosmic Shooting Beam Spawner ────────────────────────────
    const spawnShootingBeam = () => {
      if (shootingBeams.length > 3 || prefersReducedMotion) return;
      const angle = (Math.PI / 6) + (Math.random() - 0.5) * (Math.PI / 8); // ~30 deg downward slant
      shootingBeams.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * (height * 0.4),
        length: 80 + Math.random() * 120,
        speed: 14 + Math.random() * 8,
        angle,
        alpha: 0.7 + Math.random() * 0.3,
      });
    };

    // ── Resize handler ─────────────────────────────────────────────
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      if (typeof ctx.scale === "function") {
        ctx.scale(dpr, dpr);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // ── Pointer Interaction Listeners ──────────────────────────────
    const handlePointerMove = (e) => {
      mouse.prevX = mouse.targetX;
      mouse.prevY = mouse.targetY;
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;

      // Kinetic cursor stardust
      if (!prefersReducedMotion && Math.random() < 0.65) {
        stardust.push({
          x: e.clientX + (Math.random() - 0.5) * 12,
          y: e.clientY + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 - 0.3,
          radius: 1 + Math.random() * 1.6,
          life: 1,
          decay: 0.035 + Math.random() * 0.025,
        });
      }

      // Quick flick shockwave trigger
      const moveDist = Math.hypot(mouse.targetX - mouse.prevX, mouse.targetY - mouse.prevY);
      if (moveDist > 65 && Math.random() < 0.25) {
        addShockwave(e.clientX, e.clientY, false);
      }
    };

    const handleClick = (e) => {
      addShockwave(e.clientX, e.clientY, true);
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);

    // ── Master Render Loop (60-120 FPS) ────────────────────────────
    let lastBeamTime = performance.now();

    const render = (timestamp) => {
      if (!isRunning || typeof ctx.clearRect !== "function") return;

      ctx.clearRect(0, 0, width, height);

      // Smooth cursor interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.18;
      mouse.y += (mouse.targetY - mouse.y) * 0.18;

      // Periodic cosmic shooting beam (~every 3.5s)
      if (timestamp - lastBeamTime > 3500 + Math.random() * 2000) {
        spawnShootingBeam();
        lastBeamTime = timestamp;
      }

      // ── 1. Cursor Ambient Magnetic Aura ──────────────────────────
      if (mouse.active && mouse.x > 0 && mouse.y > 0 && typeof ctx.createRadialGradient === "function") {
        const cursorGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius * 1.4
        );
        cursorGlow.addColorStop(0, "rgba(6, 182, 212, 0.12)");
        cursorGlow.addColorStop(0.4, "rgba(20, 184, 166, 0.04)");
        cursorGlow.addColorStop(1, "transparent");
        ctx.fillStyle = cursorGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 2. Update & Draw Shockwaves ──────────────────────────────
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += sw.speed;
        sw.alpha *= 0.96;

        if (sw.radius >= sw.maxRadius || sw.alpha <= 0.01) {
          shockwaves.splice(s, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(34, 211, 238, ${sw.alpha.toFixed(3)})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Illuminate particles hit by shockwave wavefront
        particles.forEach((p) => {
          const pDist = Math.hypot(p.x - sw.x, p.y - sw.y);
          if (Math.abs(pDist - sw.radius) < 25) {
            p.highlight = Math.max(p.highlight, sw.alpha * 1.5);
          }
        });
      }

      // ── 3. Vertical Data Flow Streams ────────────────────────────
      if (!prefersReducedMotion) {
        ctx.lineWidth = 1;
        dataStreams.forEach((stream) => {
          ctx.strokeStyle = "rgba(6, 182, 212, 0.025)";
          ctx.beginPath();
          ctx.moveTo(stream.x, 0);
          ctx.lineTo(stream.x, height);
          ctx.stroke();

          stream.packets.forEach((packet) => {
            packet.y -= stream.speed;
            if (packet.y + packet.length < 0) {
              packet.y = height + Math.random() * 50;
            }

            if (typeof ctx.createLinearGradient === "function") {
              const streamGrad = ctx.createLinearGradient(
                stream.x,
                packet.y,
                stream.x,
                packet.y + packet.length
              );
              streamGrad.addColorStop(0, `rgba(34, 211, 238, ${packet.alpha})`);
              streamGrad.addColorStop(1, "transparent");
              ctx.strokeStyle = streamGrad;
              ctx.beginPath();
              ctx.moveTo(stream.x, packet.y);
              ctx.lineTo(stream.x, packet.y + packet.length);
              ctx.stroke();
            }
          });
        });
      }

      // ── 4. Neural Particle Interconnection Web ───────────────────
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_CONNECTION_DIST) {
            const baseAlpha = (1 - dist / MAX_CONNECTION_DIST) * 0.26 * p1.z * p2.z;
            let lineAlpha = baseAlpha + (p1.highlight + p2.highlight) * 0.4;

            if (mouse.active) {
              const midX = (p1.x + p2.x) * 0.5;
              const midY = (p1.y + p2.y) * 0.5;
              const mouseDist = Math.hypot(mouse.x - midX, mouse.y - midY);
              if (mouseDist < mouse.radius) {
                lineAlpha += (1 - mouseDist / mouse.radius) * 0.45;
              }
            }

            ctx.strokeStyle = `rgba(6, 182, 212, ${Math.min(lineAlpha, 0.85).toFixed(3)})`;
            ctx.lineWidth = 0.9 * Math.min(p1.z, p2.z);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // Random traveling photon packet
            if (Math.random() < 0.0006 && !prefersReducedMotion) {
              spawnDataPulse(p1, p2);
            }
          }
        }
      }

      // ── 5. Major Constellation Hubs ──────────────────────────────
      hubs.forEach((hub) => {
        if (!prefersReducedMotion) {
          hub.x += hub.vx;
          hub.y += hub.vy;
          if (hub.x < 50 || hub.x > width - 50) hub.vx *= -1;
          if (hub.y < 50 || hub.y > height - 50) hub.vy *= -1;
          hub.pulse += 0.03;
        }

        const hubGlow = 0.5 + Math.sin(hub.pulse) * 0.3;

        // Core Hub Ring
        ctx.strokeStyle = `rgba(34, 211, 238, ${(hubGlow * 0.4).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, hub.orbitRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Glowing Core
        ctx.fillStyle = `rgba(6, 182, 212, ${(hubGlow * 0.8).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, hub.coreRadius, 0, Math.PI * 2);
        ctx.fill();

        // Orbiting Satellites
        hub.satellites.forEach((sat) => {
          if (!prefersReducedMotion) {
            sat.angle += sat.speed;
          }
          const satX = hub.x + Math.cos(sat.angle) * sat.dist;
          const satY = hub.y + Math.sin(sat.angle) * sat.dist;

          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.beginPath();
          ctx.arc(satX, satY, sat.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // ── 6. Traveling Neural Photon Packets ────────────────────────
      if (!prefersReducedMotion) {
        for (let k = dataPulses.length - 1; k >= 0; k--) {
          const pulse = dataPulses[k];
          pulse.progress += pulse.speed;

          if (pulse.progress >= 1) {
            dataPulses.splice(k, 1);
            continue;
          }

          const px = pulse.p1.x + (pulse.p2.x - pulse.p1.x) * pulse.progress;
          const py = pulse.p1.y + (pulse.p2.y - pulse.p1.y) * pulse.progress;

          ctx.fillStyle = pulse.color;
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── 7. Cosmic Shooting Laser Beams ───────────────────────────
      for (let b = shootingBeams.length - 1; b >= 0; b--) {
        const beam = shootingBeams[b];
        beam.x += Math.cos(beam.angle) * beam.speed;
        beam.y += Math.sin(beam.angle) * beam.speed;
        beam.alpha *= 0.975;

        if (beam.x > width + 100 || beam.y > height + 100 || beam.alpha <= 0.02) {
          shootingBeams.splice(b, 1);
          continue;
        }

        const tailX = beam.x - Math.cos(beam.angle) * beam.length;
        const tailY = beam.y - Math.sin(beam.angle) * beam.length;

        if (typeof ctx.createLinearGradient === "function") {
          const beamGrad = ctx.createLinearGradient(beam.x, beam.y, tailX, tailY);
          beamGrad.addColorStop(0, `rgba(255, 255, 255, ${beam.alpha.toFixed(3)})`);
          beamGrad.addColorStop(0.3, `rgba(34, 211, 238, ${(beam.alpha * 0.8).toFixed(3)})`);
          beamGrad.addColorStop(1, "transparent");

          ctx.strokeStyle = beamGrad;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(beam.x, beam.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }
      }

      // ── 8. Kinetic Cursor Stardust Trail ─────────────────────────
      for (let d = stardust.length - 1; d >= 0; d--) {
        const dust = stardust[d];
        dust.x += dust.vx;
        dust.y += dust.vy;
        dust.life -= dust.decay;

        if (dust.life <= 0) {
          stardust.splice(d, 1);
          continue;
        }

        ctx.fillStyle = `rgba(34, 211, 238, ${(dust.life * 0.75).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.radius * dust.life, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 9. Update & Draw Neural Particles ────────────────────────
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.pulsePhase += p.pulseSpeed;
          p.x += p.vx;
          p.y += p.vy;

          if (p.highlight > 0) {
            p.highlight *= 0.94;
          }

          // Screen bounds wrap
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;

          // Cursor Magnetic Repulsion
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius && dist > 0) {
              const force = (1 - dist / mouse.radius) * 2.2 * p.z;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            }
          }
        }

        const dynamicAlpha = Math.min(
          1,
          p.alpha * (0.75 + Math.sin(p.pulsePhase) * 0.25) + p.highlight
        );

        ctx.fillStyle = `${p.colorBase} ${dynamicAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Luminous halo on foreground nodes
        if (p.z > 0.7) {
          ctx.fillStyle = `rgba(6, 182, 212, ${(dynamicAlpha * 0.4).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    // ── Visibility API: Auto-pause when tab is hidden ───────────────
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        if (animFrameId) cancelAnimationFrame(animFrameId);
      } else {
        isRunning = true;
        animFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isRunning = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("click", handleClick);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
});

export default NeuralUniverseCanvas;
