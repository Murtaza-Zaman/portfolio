/**
 * GenesisCanvas.jsx — Single-Screen 3D Glass Neural Crystal & Monogram Engine
 *
 * Visual Artifact:
 * - Transparent 3D Glass Sphere / Refraction Shell
 * - Inner Neural Crystal Lattice & Volumetric Energy Light
 * - Swarm of organic micro-photons drifting inside the crystal
 * - Smooth transformation into the "MZ" developer monogram
 * - Glass highlights, chromatic dispersion, specular sheen, and soft bloom
 */

import { memo, useEffect, useRef } from "react";

// Precision 3D Vertices for the Internal Energy Crystal (Truncated Octahedron / Quantum Gem)
const CRYSTAL_VERTICES_3D = [
  { x: 0, y: 130, z: 0 },
  { x: 0, y: -130, z: 0 },
  { x: 110, y: 0, z: 65 },
  { x: -110, y: 0, z: 65 },
  { x: 110, y: 0, z: -65 },
  { x: -110, y: 0, z: -65 },
  { x: 0, y: 65, z: 110 },
  { x: 0, y: -65, z: 110 },
  { x: 0, y: 65, z: -110 },
  { x: 0, y: -65, z: -110 },
];

const CRYSTAL_EDGES = [
  [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 8],
  [1, 2], [1, 3], [1, 4], [1, 5], [1, 7], [1, 9],
  [2, 6], [6, 3], [3, 7], [7, 2],
  [4, 8], [8, 5], [5, 9], [9, 4],
  [2, 4], [3, 5], [6, 8], [7, 9],
];

export const GenesisCanvas = memo(function GenesisCanvas({
  phaseProgress = 0, // 0.0 -> 1.0 (across total 3.6s)
  globalTime = 0,
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    particles: [],
    monogramTargets: [],
    width: 0,
    height: 0,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
  });

  const propsRef = useRef({ phaseProgress, globalTime });
  propsRef.current = { phaseProgress, globalTime };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext ? canvas.getContext("2d", { alpha: true }) : null;
    if (!ctx) return;

    let animId = null;
    let isMounted = true;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth || 1200;
      const h = window.innerHeight || 800;
      stateRef.current.width = w;
      stateRef.current.height = h;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      if (typeof ctx.setTransform === "function") {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      generateMonogramTargets(w, h);
    }

    // Generate precision architectural vector coordinates for "MZ" Monogram
    function generateMonogramTargets(w, h) {
      const targets = [];
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w * 0.22, h * 0.26, 125);

      // Stroke paths for "M" and "Z"
      const strokes = [
        // 'M'
        { x1: -0.75, y1: 0.65, x2: -0.75, y2: -0.65 },
        { x1: -0.75, y1: -0.65, x2: -0.32, y2: 0.15 },
        { x1: -0.32, y1: 0.15, x2: 0.08, y2: -0.65 },
        { x1: 0.08, y1: -0.65, x2: 0.08, y2: 0.65 },
        // 'Z'
        { x1: 0.22, y1: -0.65, x2: 0.78, y2: -0.65 },
        { x1: 0.78, y1: -0.65, x2: 0.22, y2: 0.65 },
        { x1: 0.22, y1: 0.65, x2: 0.78, y2: 0.65 },
      ];

      const stepCount = 45;
      strokes.forEach((stroke) => {
        for (let i = 0; i <= stepCount; i++) {
          const t = i / stepCount;
          const px = stroke.x1 + (stroke.x2 - stroke.x1) * t;
          const py = stroke.y1 + (stroke.y2 - stroke.y1) * t;
          targets.push({
            x: cx + px * scale,
            y: cy + py * scale,
            normX: px,
            normY: py,
            alpha: 0.9 + Math.random() * 0.1,
          });
        }
      });

      // Outer precision glass bevel ring
      const ringSteps = 72;
      const r = scale * 1.25;
      for (let i = 0; i < ringSteps; i++) {
        const ang = (i / ringSteps) * Math.PI * 2;
        targets.push({
          x: cx + Math.cos(ang) * r,
          y: cy + Math.sin(ang) * r,
          normX: Math.cos(ang) * 1.25,
          normY: Math.sin(ang) * 1.25,
          alpha: 0.55,
        });
      }

      stateRef.current.monogramTargets = targets;
    }

    // Initialize organic micro-photons inside the sphere
    function initParticles() {
      const isMobile = (window.innerWidth || 1200) < 768;
      const count = isMobile ? 400 : 850;
      const particles = [];

      for (let i = 0; i < count; i++) {
        // Spherical cloud within the glass sphere radius
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 115; // distributed volume

        const sinPhi = Math.sin(phi);
        const x = r * sinPhi * Math.cos(theta);
        const y = r * sinPhi * Math.sin(theta);
        const z = r * Math.cos(phi);

        const speed = 0.008 + Math.random() * 0.018;
        const axis = {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
          z: (Math.random() - 0.5) * 2,
        };
        const len = Math.hypot(axis.x, axis.y, axis.z) || 1;
        axis.x /= len;
        axis.y /= len;
        axis.z /= len;

        particles.push({
          x,
          y,
          z,
          origX: x,
          origY: y,
          origZ: z,
          axis,
          speed,
          angle: Math.random() * Math.PI * 2,
          radius: 0.9 + Math.random() * 1.5,
          alpha: 0.35 + Math.random() * 0.65,
          color: Math.random() > 0.4 ? "#00E5FF" : "#FFFFFF",
        });
      }

      stateRef.current.particles = particles;
    }

    resize();
    initParticles();

    function onPointerMove(e) {
      const w = window.innerWidth || 1200;
      const h = window.innerHeight || 800;
      stateRef.current.mouse.targetX = (e.clientX - w / 2) * 0.0008;
      stateRef.current.mouse.targetY = (e.clientY - h / 2) * 0.0008;
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);

    // ── 60-120 FPS Render Loop ──────────────────────────────────
    function render() {
      if (!isMounted) return;
      const { phaseProgress: p, globalTime } = propsRef.current;
      const w = stateRef.current.width || 1200;
      const h = stateRef.current.height || 800;
      const cx = w / 2;
      const cy = h / 2;
      const mouse = stateRef.current.mouse;

      // Smooth camera orbit with mouse tilt
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Clear with absolute deep black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      // ── Timing Segments ──────────────────────────────────────────
      // 0.0 -> 0.25: Emergence & Growth of Glass Sphere (0-1s)
      // 0.25 -> 0.70: Alive Neural Core Rotation & Living Photons (1-2.5s)
      // 0.70 -> 0.92: Monogram Transformation & Glass Lock (2.5-3.3s)
      // 0.92 -> 1.00: Smooth Dissolve into Homepage (3.3-3.6s)

      const sphereScale = Math.min(1, p < 0.25 ? (p / 0.25) * 1.05 : 1);
      const sphereRadius = 145 * Math.min(1, p * 4);
      const focalLength = 480;

      // 3D Camera Angles
      const rotY = globalTime * 0.55 + mouse.x * 2.5;
      const rotX = Math.sin(globalTime * 0.4) * 0.22 - mouse.y * 2.5;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // ── 1. BACKGROUND GLOW & VOLUMETRIC LIGHT FALLOFF ─────────────
      if (sphereRadius > 5 && p < 0.95) {
        const glowAlpha = Math.sin(Math.min(Math.PI, p * Math.PI)) * 0.85;
        let bgGlow = null;
        if (typeof ctx.createRadialGradient === "function") {
          try {
            bgGlow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 260);
            if (bgGlow && typeof bgGlow.addColorStop === "function") {
              bgGlow.addColorStop(0, `rgba(0, 229, 255, ${glowAlpha * 0.28})`);
              bgGlow.addColorStop(0.35, `rgba(0, 229, 255, ${glowAlpha * 0.08})`);
              bgGlow.addColorStop(0.7, `rgba(56, 189, 248, ${glowAlpha * 0.02})`);
              bgGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
            }
          } catch {
            bgGlow = null;
          }
        }
        if (bgGlow) {
          ctx.fillStyle = bgGlow;
          ctx.beginPath();
          ctx.arc(cx, cy, 260, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── 2. INTERNAL 3D CRYSTAL LATTICE ────────────────────────────
      const monogramMorph = p > 0.7 ? Math.min(1, (p - 0.7) / 0.22) : 0;
      const crystalAlpha = Math.max(0, 1 - monogramMorph * 1.5) * Math.min(1, p * 4);

      if (crystalAlpha > 0.01) {
        // Project 3D Crystal Vertices
        const projectedVerts = CRYSTAL_VERTICES_3D.map((v) => {
          const x1 = v.x * cosY - v.z * sinY;
          const z1 = v.x * sinY + v.z * cosY;
          const y2 = v.y * cosX - z1 * sinX;
          const z2 = v.y * sinX + z1 * cosX;

          const scale = focalLength / (focalLength + z2);
          return {
            x: cx + x1 * scale * sphereScale,
            y: cy + y2 * scale * sphereScale,
            z: z2,
            scale,
            alpha: Math.max(0.15, Math.min(1, scale * 0.8)),
          };
        });

        // Draw Crystal Facet Edges with Specular Light Reflection
        CRYSTAL_EDGES.forEach(([i, j], edgeIdx) => {
          const v1 = projectedVerts[i];
          const v2 = projectedVerts[j];
          const avgZ = (v1.z + v2.z) / 2;
          const depthAlpha = ((avgZ + 150) / 300) * 0.6 + 0.2;

          const edgeLight = Math.sin(globalTime * 3 + edgeIdx) * 0.2 + 0.8;
          ctx.strokeStyle = `rgba(0, 229, 255, ${crystalAlpha * depthAlpha * edgeLight * 0.45})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(v1.x, v1.y);
          ctx.lineTo(v2.x, v2.y);
          ctx.stroke();

          // Flowing data photon pulses along crystal facets
          const pulseT = (globalTime * 0.9 + edgeIdx * 0.15) % 1;
          const px = v1.x + (v2.x - v1.x) * pulseT;
          const py = v1.y + (v2.y - v1.y) * pulseT;

          ctx.fillStyle = "#FFFFFF";
          ctx.shadowColor = "#00E5FF";
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(px, py, 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Draw Crystal Vertices
        projectedVerts.forEach((v) => {
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowColor = "#00E5FF";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(v.x, v.y, 2.5 * v.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // ── 3. ORGANIC LIVING PARTICLES INSIDE THE GLASS ARTIFACT ─────
      const particles = stateRef.current.particles;
      const targets = stateRef.current.monogramTargets;

      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];

        // 3D organic orbit inside sphere
        pt.angle += pt.speed;
        const cosA = Math.cos(pt.angle);
        const sinA = Math.sin(pt.angle);

        // Rodrigues rotation formula for 3D axis spin
        const rx = pt.origX * cosA + (pt.axis.y * pt.origZ - pt.axis.z * pt.origY) * sinA;
        const ry = pt.origY * cosA + (pt.axis.z * pt.origX - pt.axis.x * pt.origZ) * sinA;
        const rz = pt.origZ * cosA + (pt.axis.x * pt.origY - pt.axis.y * pt.origX) * sinA;

        // Apply camera rotation
        const x1 = rx * cosY - rz * sinY;
        const z1 = rx * sinY + rz * cosY;
        const y2 = ry * cosX - z1 * sinX;
        const z2 = ry * sinX + z1 * cosX;

        const scale = focalLength / (focalLength + z2);
        const sphereScreenX = cx + x1 * scale * sphereScale;
        const sphereScreenY = cy + y2 * scale * sphereScale;

        // Smooth convergence into Monogram targets during Phase 3
        let finalX = sphereScreenX;
        let finalY = sphereScreenY;
        let finalAlpha = pt.alpha * Math.min(1, p * 4);
        let finalRadius = pt.radius * scale;

        if (monogramMorph > 0 && i < targets.length) {
          const tgt = targets[i];
          const easeMorph = Math.sin((monogramMorph * Math.PI) / 2); // smooth easeOut
          finalX = sphereScreenX + (tgt.x - sphereScreenX) * easeMorph;
          finalY = sphereScreenY + (tgt.y - sphereScreenY) * easeMorph;
          finalAlpha = pt.alpha + (tgt.alpha - pt.alpha) * easeMorph;
          finalRadius = 1.3 + (1 - easeMorph) * 0.5;

          // Specular glint sweep across the monogram
          const sweepX = (monogramMorph * 2 - 0.5) * w;
          const dist = Math.abs(finalX - sweepX);
          if (dist < 40) {
            ctx.fillStyle = "#FFFFFF";
            ctx.shadowColor = "#FFFFFF";
            ctx.shadowBlur = 10;
          } else {
            ctx.fillStyle = pt.color;
            ctx.shadowColor = "#00E5FF";
            ctx.shadowBlur = 4;
          }
        } else {
          ctx.fillStyle = pt.color;
          ctx.shadowBlur = 0;
        }

        // Draw particle
        ctx.globalAlpha = Math.max(0.05, Math.min(1, finalAlpha));
        ctx.beginPath();
        ctx.arc(finalX, finalY, Math.max(0.8, finalRadius), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // ── 4. GLASS SPHERE REFRACTION SHELL & METALLIC HIGHLIGHTS ────
      if (sphereRadius > 10 && crystalAlpha > 0.05) {
        // Outer glass fresnel rim sheen
        const glassRimGrad = ctx.createLinearGradient(
          cx - sphereRadius,
          cy - sphereRadius,
          cx + sphereRadius,
          cy + sphereRadius
        );
        if (glassRimGrad && typeof glassRimGrad.addColorStop === "function") {
          glassRimGrad.addColorStop(0, `rgba(255, 255, 255, ${crystalAlpha * 0.45})`);
          glassRimGrad.addColorStop(0.3, `rgba(0, 229, 255, ${crystalAlpha * 0.2})`);
          glassRimGrad.addColorStop(0.7, `rgba(0, 229, 255, ${crystalAlpha * 0.05})`);
          glassRimGrad.addColorStop(1, `rgba(255, 255, 255, ${crystalAlpha * 0.35})`);

          ctx.strokeStyle = glassRimGrad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, sphereRadius * sphereScale, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Specular top-left curvature glint (Apple-style precision reflection)
        const glintGrad = ctx.createRadialGradient(
          cx - sphereRadius * 0.45,
          cy - sphereRadius * 0.45,
          1,
          cx - sphereRadius * 0.45,
          cy - sphereRadius * 0.45,
          sphereRadius * 0.6
        );
        if (glintGrad && typeof glintGrad.addColorStop === "function") {
          glintGrad.addColorStop(0, `rgba(255, 255, 255, ${crystalAlpha * 0.35})`);
          glintGrad.addColorStop(0.5, `rgba(0, 229, 255, ${crystalAlpha * 0.08})`);
          glintGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = glintGrad;
          ctx.beginPath();
          ctx.arc(
            cx - sphereRadius * 0.45,
            cy - sphereRadius * 0.45,
            sphereRadius * 0.6,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-10 block"
    />
  );
});
