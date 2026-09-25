/**
 * useNodeGraphAnimation — Award-Site-Quality GSAP Animation System for NodeGraph.
 *
 * Architecture:
 * 1. ENTRANCE TIMELINE: ScrollTriggered "network powering on" sequence (Center → Draw Lines → Node Elastic Pops → Label Reveal).
 * 2. IDLE TIMELINES: Infinite, un-synced ambient node floats, glowing energy ripples, traveling data pulses, and orbital particle drift.
 * 3. INTERACTIVE FOCUS: Single-timeline node focus / hover dimming, connector line highlighting, and tech tooltip reveal.
 * 4. 60FPS PARALLAX: High-performance gsap.quickTo mouse tracking + ScrollTrigger scrub.
 * 5. REDUCED MOTION: Gracefully degrades to simple static layout for prefers-reduced-motion.
 */

import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../../lib/gsap";

export function useNodeGraphAnimation({
  containerRef,
  svgRef,
  nodes,
  center,
  hoveredNodeId: _hoveredNodeId,
  setHoveredNodeId: _setHoveredNodeId,
}) {
  const idleTweensRef = useRef([]);
  const pulseTweensRef = useRef([]);
  const isEntranceDoneRef = useRef(false);

  useGSAP(
    () => {
      if (!containerRef.current || !svgRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ─────────────────────────────────────────────────────────────
      // 0. QUICKTO SETUP: 60FPS MOUSE PARALLAX & SPOTLIGHT
      // ─────────────────────────────────────────────────────────────
      const parallaxGroup = containerRef.current.querySelector(".ng-parallax-group");
      const quickX = parallaxGroup ? gsap.quickTo(parallaxGroup, "x", { duration: 0.8, ease: "power2.out" }) : null;
      const quickY = parallaxGroup ? gsap.quickTo(parallaxGroup, "y", { duration: 0.8, ease: "power2.out" }) : null;

      const handleMouseMove = (e) => {
        if (prefersReducedMotion || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mouseRelX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const mouseRelY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

        // Shift graph 8-12px opposite to cursor for 3D depth
        if (quickX && quickY) {
          quickX(mouseRelX * -10);
          quickY(mouseRelY * -8);
        }

        // Update spotlight CSS variables
        const spotX = ((e.clientX - rect.left) / rect.width) * 100;
        const spotY = ((e.clientY - rect.top) / rect.height) * 100;
        containerRef.current.style.setProperty("--spot-x", `${spotX}%`);
        containerRef.current.style.setProperty("--spot-y", `${spotY}%`);
      };

      const handleMouseLeave = () => {
        if (quickX && quickY) {
          quickX(0);
          quickY(0);
        }
      };

      const container = containerRef.current;
      container.addEventListener("mousemove", handleMouseMove, { passive: true });
      container.addEventListener("mouseleave", handleMouseLeave, { passive: true });

      // ─────────────────────────────────────────────────────────────
      // 1. SCROLL SCRUB PARALLAX (Subtle vertical drift during scroll)
      // ─────────────────────────────────────────────────────────────
      if (!prefersReducedMotion) {
        gsap.to(".ng-scroll-drift", {
          y: 20,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      // ─────────────────────────────────────────────────────────────
      // 2. IDLE / AMBIENT ANIMATION FACTORY
      // ─────────────────────────────────────────────────────────────
      const startAmbientAnimations = () => {
        if (prefersReducedMotion) return;
        isEntranceDoneRef.current = true;

        // A. Independent Node Floats (un-synced sine curves)
        nodes.forEach((node, i) => {
          const nodeElem = containerRef.current.querySelector(`[data-node-id="${node.id}"]`);
          if (!nodeElem) return;

          // Randomized duration between 3.6s and 5.2s so they never sync
          const floatDur = 3.6 + (i * 0.45) % 1.6;
          const floatTween = gsap.to(nodeElem, {
            y: "+=6",
            x: i % 2 === 0 ? "+=3" : "-=3",
            duration: floatDur,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.25,
          });
          idleTweensRef.current.push(floatTween);

          // B. Node Pre-blurred Glow Pulse (Opacity animation for 60fps)
          const glowElem = nodeElem.querySelector(".ng-node-glow");
          if (glowElem) {
            const glowTween = gsap.to(glowElem, {
              opacity: 0.85,
              duration: 2.2 + (i * 0.3) % 1.2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: i * 0.4,
            });
            idleTweensRef.current.push(glowTween);
          }
        });

        // C. Connector Lines Energy Flow Pulse (Data traveling from center to node)
        nodes.forEach((node, i) => {
          const energyPulse = svgRef.current.querySelector(`[data-pulse-id="${node.id}"]`);
          if (!energyPulse) return;

          const pulseTween = gsap.fromTo(
            energyPulse,
            { cx: center.x, cy: center.y, opacity: 0, r: 2 },
            {
              cx: node.x,
              cy: node.y,
              opacity: 0.9,
              r: 3.5,
              duration: 2.4 + (i % 3) * 0.3,
              ease: "power1.inOut",
              repeat: -1,
              delay: 0.4 + i * 0.35,
              repeatDelay: 0.8,
            }
          );
          pulseTweensRef.current.push(pulseTween);
        });

        // D. Unconnected Floating Particles Orbit
        const orbitParticles = containerRef.current.querySelectorAll(".ng-orbit-particle");
        orbitParticles.forEach((particle, idx) => {
          const orbitTween = gsap.to(particle, {
            x: idx === 0 ? "+=14" : "-=12",
            y: idx === 0 ? "-=10" : "+=14",
            rotation: 360,
            duration: 8 + idx * 3,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
          idleTweensRef.current.push(orbitTween);
        });

        // E. Central Core Ambient Halo Pulse
        const coreHalo = svgRef.current.querySelector(".ng-core-halo");
        if (coreHalo) {
          gsap.to(coreHalo, {
            r: 46,
            opacity: 0.25,
            duration: 3,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        }
      };

      // ─────────────────────────────────────────────────────────────
      // 3. ENTRANCE TIMELINE (ScrollTrigger "Network Powering On")
      // ─────────────────────────────────────────────────────────────
      if (prefersReducedMotion) {
        // Fast static reveal for reduced motion
        gsap.set(".ng-center-core, .ng-node-item, .ng-line, .ng-grid-dot", {
          opacity: 1,
          scale: 1,
          strokeDashoffset: 0,
        });
        return;
      }

      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
        onComplete: startAmbientAnimations,
      });

      // Step A: Background Dot Grid radial ripple reveal from center
      entranceTl.fromTo(
        ".ng-grid-dot",
        { opacity: 0, scale: 0 },
        {
          opacity: 0.4,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: {
            from: "center",
            grid: "auto",
            amount: 0.5,
          },
        },
        0
      );

      // Step B: Central Core fades and scales in (back.out punch)
      entranceTl.fromTo(
        ".ng-center-core",
        { scale: 0.2, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: "back.out(1.7)",
        },
        0.15
      );

      // Step C: Connector lines draw outward + Node elastic pop + Label reveal
      nodes.forEach((node, i) => {
        const lineElem = svgRef.current.querySelector(`[data-line-id="${node.id}"]`);
        const nodeElem = containerRef.current.querySelector(`[data-node-id="${node.id}"]`);
        const dotElem = nodeElem?.querySelector(".ng-node-circle");
        const labelElem = nodeElem?.querySelector(".ng-node-label");

        // Calculate exact length for stroke-dashoffset drawing
        const dx = node.x - center.x;
        const dy = node.y - center.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (lineElem) {
          gsap.set(lineElem, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: 0.65,
          });

          // Draw line outward from center
          entranceTl.to(
            lineElem,
            {
              strokeDashoffset: 0,
              duration: 0.8,
              ease: "power2.inOut",
            },
            0.3 + i * 0.08 // Staggered 0.08s
          );
        }

        // Node scales in with soft elastic pop right as line finishes
        if (dotElem) {
          entranceTl.fromTo(
            dotElem,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.65,
              ease: "back.out(2)",
            },
            `-=${0.22}` // Overlaps line finish
          );
        }

        // Node label fades up 0.1s after node appears
        if (labelElem) {
          entranceTl.fromTo(
            labelElem,
            { y: 8, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.45,
              ease: "power2.out",
            },
            `-=${0.1}`
          );
        }
      });
    },
    { scope: containerRef, dependencies: [nodes, center] }
  );

  // ─────────────────────────────────────────────────────────────
  // 4. INTERACTION HANDLER (Hover & Focus States)
  // ─────────────────────────────────────────────────────────────
  const handleNodeInteraction = useCallback(
    (targetNodeId, isHovered) => {
      if (!containerRef.current || !svgRef.current) return;

      const allNodes = containerRef.current.querySelectorAll(".ng-node-item");
      const allLines = svgRef.current.querySelectorAll(".ng-line");
      const allPulses = svgRef.current.querySelectorAll(".ng-pulse-dot");

      if (isHovered && targetNodeId) {
        // FOCUS STATE: Highlight target, dim everything else
        allNodes.forEach((nodeElem) => {
          const id = nodeElem.getAttribute("data-node-id");
          const isTarget = id === targetNodeId;

          gsap.to(nodeElem, {
            opacity: isTarget ? 1 : 0.35,
            scale: isTarget ? 1.14 : 0.95,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });

          const glowElem = nodeElem.querySelector(".ng-node-glow");
          if (glowElem) {
            gsap.to(glowElem, {
              opacity: isTarget ? 1 : 0.2,
              duration: 0.35,
              overwrite: "auto",
            });
          }
        });

        allLines.forEach((lineElem) => {
          const id = lineElem.getAttribute("data-line-id");
          const isTarget = id === targetNodeId;

          gsap.to(lineElem, {
            opacity: isTarget ? 1 : 0.2,
            strokeWidth: isTarget ? 2.5 : 1,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        });

        // Speed up energy pulse on target line
        allPulses.forEach((pulseElem) => {
          const id = pulseElem.getAttribute("data-pulse-id");
          const isTarget = id === targetNodeId;
          gsap.to(pulseElem, {
            opacity: isTarget ? 1 : 0.1,
            duration: 0.3,
            overwrite: "auto",
          });
        });
      } else {
        // RESET STATE: Restore all nodes & lines smoothly
        allNodes.forEach((nodeElem) => {
          gsap.to(nodeElem, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });

          const glowElem = nodeElem.querySelector(".ng-node-glow");
          if (glowElem) {
            gsap.to(glowElem, {
              opacity: 0.5,
              duration: 0.4,
              overwrite: "auto",
            });
          }
        });

        allLines.forEach((lineElem) => {
          gsap.to(lineElem, {
            opacity: 0.65,
            strokeWidth: 1.2,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        });

        allPulses.forEach((pulseElem) => {
          gsap.to(pulseElem, {
            opacity: 0.7,
            duration: 0.4,
            overwrite: "auto",
          });
        });
      }
    },
    [containerRef, svgRef]
  );

  return {
    handleNodeInteraction,
  };
}
