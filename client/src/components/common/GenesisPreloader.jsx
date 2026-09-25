/**
 * GenesisPreloader.jsx — Single-Screen 3D Glass & Neural Crystal Preloader
 *
 * Requirements:
 * - One screen only
 * - No multiple scenes
 * - No loading text
 * - No progress bar
 * - No dashboard UI
 * - Pure black infinite space (#000000)
 * - 3D digital glass core + neural energy crystal transforming into "MZ" monogram
 * - Seamless homepage reveal
 */

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Volume2, VolumeX } from "lucide-react";
import { GenesisCanvas } from "./GenesisCanvas";
import { crystalAudio } from "./genesisAudio";

const PRELOADER_SESSION_KEY = "murtaza_genesis_seen";

export function GenesisPreloader({ onComplete, forcePlay = false }) {
  const [isVisible, setIsVisible] = useState(true);
  const [phaseProgress, setPhaseProgress] = useState(0); // 0.0 -> 1.0
  const [globalTime, setGlobalTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const audioInitializedRef = useRef(false);

  // Check if user already saw the preloader in this session
  useEffect(() => {
    if (!forcePlay) {
      const alreadySeen = sessionStorage.getItem(PRELOADER_SESSION_KEY);
      if (alreadySeen === "true") {
        setIsVisible(false);
        onComplete?.();
        return;
      }
    }
  }, [forcePlay, onComplete]);

  // Audio Toggle
  const toggleSound = useCallback(() => {
    if (!audioInitializedRef.current) {
      crystalAudio.init();
      audioInitializedRef.current = true;
    }
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    crystalAudio.setMuted(nextMuted);
    if (!nextMuted && phaseProgress < 0.3) {
      crystalAudio.startCrystalEmergence();
    }
  }, [isMuted, phaseProgress]);

  // Fast Skip Handler
  const handleSkip = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    crystalAudio.destroy();
    sessionStorage.setItem(PRELOADER_SESSION_KEY, "true");

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          setIsVisible(false);
          onComplete?.();
        },
      });
    } else {
      setIsVisible(false);
      onComplete?.();
    }
  }, [onComplete]);

  // Keyboard shortcut: Escape to skip
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        handleSkip();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  // GSAP 3.6-Second Single-Screen Master Timeline
  useEffect(() => {
    if (!isVisible) return;

    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    if (prefersReducedMotion) {
      handleSkip();
      return;
    }

    const tracker = {
      progress: 0,
      globalTime: 0,
    };

    const tl = gsap.timeline({
      onUpdate: () => {
        setPhaseProgress(tracker.progress);
        setGlobalTime(tracker.globalTime);
      },
      onComplete: () => {
        sessionStorage.setItem(PRELOADER_SESSION_KEY, "true");
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 1.04,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
              setIsVisible(false);
              onComplete?.();
            },
          });
        } else {
          setIsVisible(false);
          onComplete?.();
        }
      },
    });

    timelineRef.current = tl;

    // 0.0s - 1.0s: Digital Singularity & Core Growth
    tl.to(tracker, {
      progress: 0.28,
      globalTime: 1.0,
      duration: 1.0,
      ease: "power2.inOut",
      onStart: () => {
        crystalAudio.startCrystalEmergence();
      },
    });

    // 1.0s - 2.5s: Living Neural Glass Crystal Rotation
    tl.to(tracker, {
      progress: 0.70,
      globalTime: 2.5,
      duration: 1.5,
      ease: "sine.inOut",
      onStart: () => {
        crystalAudio.triggerGlassResonance();
      },
    });

    // 2.5s - 3.2s: Precision Monogram Transformation
    tl.to(tracker, {
      progress: 0.90,
      globalTime: 3.2,
      duration: 0.7,
      ease: "power3.inOut",
      onStart: () => {
        crystalAudio.triggerMonogramLock();
      },
    });

    // 3.2s - 3.6s: Atmospheric Website Reveal
    tl.to(tracker, {
      progress: 1.0,
      globalTime: 3.6,
      duration: 0.4,
      ease: "power2.in",
      onStart: () => {
        crystalAudio.triggerTransitionRelease();
      },
    });

    return () => {
      tl.kill();
      crystalAudio.destroy();
    };
  }, [isVisible, onComplete, handleSkip]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-label="Portfolio initialization experience"
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#000000] text-slate-100 select-none"
    >
      {/* 3D Glass Neural Crystal & Monogram Canvas */}
      <GenesisCanvas
        globalTime={globalTime}
        phaseProgress={phaseProgress}
      />

      {/* ── Minimal Ambient Audio & Skip Controls ────────── */}
      <header className="absolute top-6 right-6 md:top-8 md:right-8 z-30 flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? "Enable audio soundscape" : "Mute audio soundscape"}
          className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-slate-400 backdrop-blur-md transition-all hover:border-cyan-400/50 hover:text-cyan-300"
        >
          {isMuted ? (
            <VolumeX className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
          ) : (
            <Volume2 className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          )}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          aria-label="Skip initialization animation"
          className="rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 font-mono text-[10px] tracking-widest text-slate-400 backdrop-blur-md transition-all hover:border-cyan-400/50 hover:text-cyan-300"
        >
          SKIP
        </button>
      </header>
    </div>
  );
}
