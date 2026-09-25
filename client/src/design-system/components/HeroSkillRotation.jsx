import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";

const DEFAULT_SKILLS = [
  "High-Performance APIs",
  "Technical SEO Strategy",
  "Scalable SaaS Architecture",
  "Full-Stack Web Engineering",
  "Cloud & Backend Architecture",
];

/**
 * HeroSkillRotation — Dynamic headline skill rotator with GSAP SplitText Drop & Shatter effect.
 *
 * Effect lifecycle:
 * 1. Drop In: Drops down with velocity from above (y: -100, opacity: 0 -> 1, ease: "power4.out")
 * 2. Hold & Read: Displays steadily for readable duration
 * 3. Shatter Out: Individual characters scatter with random Y/X trajectories, rotations, and fade
 * 4. Loop: Seamlessly advances to next skill
 */
export function HeroSkillRotation({
  className = "",
  interval = 3200,
  skills = DEFAULT_SKILLS,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const currentSkill = skills[currentIndex] || "";
  const words = currentSkill.split(" ");

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container || !skills.length) return;

      const isReduced =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

      const chars = container.querySelectorAll(".shatter-char");
      const wrapper = container.querySelector(".shatter-wrapper");

      if (isReduced) {
        if (wrapper) gsap.set(wrapper, { opacity: 1, y: 0 });
        if (chars.length) gsap.set(chars, { opacity: 1, y: 0, rotation: 0 });
        const timer = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % skills.length);
        }, interval);
        return () => clearTimeout(timer);
      }

      if (!wrapper || !chars.length) return;

      // Reset transforms
      gsap.set(wrapper, { opacity: 1 });
      gsap.set(chars, { opacity: 1, x: 0, y: 0, rotation: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          if (skills.length > 1) {
            setCurrentIndex((prev) => (prev + 1) % skills.length);
          }
        },
      });

      // 1. Drop In from above with high impact
      tl.fromTo(
        wrapper,
        { y: -90, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: "power4.out" }
      )
        // 2. Hold for reading
        .to({}, { duration: Math.max(1.2, (interval - 1300) / 1000) })
        // 3. Shatter characters with random angle, translation, and fade
        .to(chars, {
          y: () => gsap.utils.random(40, 120),
          x: () => gsap.utils.random(-25, 25),
          rotation: () => gsap.utils.random(-35, 35),
          opacity: 0,
          stagger: {
            amount: 0.22,
            from: "random",
          },
          duration: 0.55,
          ease: "power2.in",
        });

      return () => {
        tl.kill();
      };
    },
    { dependencies: [currentIndex, skills, interval], scope: containerRef }
  );

  return (
    <span
      ref={containerRef}
      aria-live="polite"
      className={`relative inline-block overflow-visible font-semibold text-cyan-300 ${className}`}
      style={{ verticalAlign: "baseline" }}
    >
      {/* Intact text for screen readers & test runners */}
      <span className="sr-only">{currentSkill}</span>

      {/* Visual Shatter Character Elements */}
      <span
        aria-hidden="true"
        className="shatter-wrapper inline-flex flex-wrap items-center gap-x-[0.3em]"
        style={{ perspective: "600px", willChange: "transform, opacity" }}
      >
        {words.map((word, wordIdx) => (
          <span
            className="inline-block whitespace-nowrap"
            key={`${currentIndex}-${wordIdx}-${word}`}
          >
            {word.split("").map((char, charIdx) => (
              <span
                className="shatter-char inline-block"
                key={`${currentIndex}-${wordIdx}-${charIdx}-${char}`}
                style={{
                  display: "inline-block",
                  willChange: "transform, opacity",
                  transformOrigin: "50% 50%",
                }}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}
