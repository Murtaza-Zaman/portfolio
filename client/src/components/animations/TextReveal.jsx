/**
 * TextReveal — Global Reusable GSAP Typography Animation Component
 *
 * Automatically splits text into accessible masked tokens and applies
 * hardware-accelerated GSAP animations based on category:
 *
 * Categories (variant):
 * - "hero"    — Cinematic 3D character rise with blur transition
 * - "heading" — Crisp character rise with subtle blur
 * - "project" — Slot machine drop from above with back.out(1.7)
 * - "label"   — Fast terminal character boot effect
 * - "body"    — Word-based upward fade
 *
 * Features:
 * - ScrollTrigger integrated (triggers on viewport entry at "top 85%")
 * - 3D Perspective & Overflow Masking
 * - Accessible: aria-label with full string, children aria-hidden
 * - Responsive: adapts to mobile & respects prefers-reduced-motion
 */

import { memo, useRef, useMemo } from "react";
import { splitTextToTokens, extractPlainText } from "../../utils/splitTextHelper";
import { useSplitTextAnimation } from "../../hooks/useSplitTextAnimation";

export const TextReveal = memo(function TextReveal({
  as: Component = "span",
  variant = "heading",
  children,
  className = "",
  delay = 0,
  scrollTrigger = true,
  triggerStart = "top 85%",
  style = {},
  ariaLabel,
}) {
  const containerRef = useRef(null);

  // Extract plain text for screen readers & tokenization
  const rawText = useMemo(() => extractPlainText(children), [children]);
  const accessibilityLabel = ariaLabel || rawText;

  // Split tokens (words and characters)
  const tokens = useMemo(() => splitTextToTokens(rawText), [rawText]);

  // Hook handles GSAP ScrollTrigger + matchMedia
  useSplitTextAnimation({
    targetRef: containerRef,
    variant,
    scrollTrigger,
    triggerStart,
    delay,
    autoRun: true,
  });

  const isWordBased = variant === "body";

  return (
    <Component
      ref={containerRef}
      className={`text-wrapper-reveal inline-block ${className}`}
      style={style}
      aria-label={accessibilityLabel}
      data-split-variant={variant}
    >
      {/* Accessible semantic text node */}
      <span className="sr-only">{accessibilityLabel}</span>

      <span aria-hidden="true" className="inline-block">
        {tokens.map((token, wordIdx) => {
          if (token.isSpace) {
            return (
              <span key={`space-${wordIdx}`} className="inline">
                {" "}
              </span>
            );
          }

          if (isWordBased) {
            // Word-based splitting for body text
            return (
              <span
                key={`word-${wordIdx}`}
                className="text-mask-wrapper inline-block overflow-hidden align-top mr-[0.26em]"
              >
                <span className="split-word inline-block will-change-transform">
                  {token.word}
                </span>
              </span>
            );
          }

          // Character-based splitting for hero, heading, project, label
          return (
            <span
              key={`word-${wordIdx}`}
              className="text-mask-wrapper inline-block overflow-hidden align-top mr-[0.24em] last:mr-0"
            >
              {token.chars.map((charToken) => (
                <span
                  key={`char-${charToken.globalIndex}`}
                  className="split-char inline-block will-change-transform"
                >
                  {charToken.char}
                </span>
              ))}
            </span>
          );
        })}
      </span>
    </Component>
  );
});

export default TextReveal;
