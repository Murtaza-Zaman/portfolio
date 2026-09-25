/**
 * Motion System Timing, Easing, and Spring Constants
 */

export const DURATION = {
  fast: 0.2,
  normal: 0.35,
  slow: 0.6,
  cinematic: 0.9,
};

export const EASING = {
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  luxuryReveal: [0.16, 1, 0.3, 1],
  smoothBounce: [0.34, 1.56, 0.64, 1],
};

export const SPRINGS = {
  soft: { type: "spring", stiffness: 100, damping: 20 },
  snappy: { type: "spring", stiffness: 300, damping: 25 },
  bentoHover: { type: "spring", stiffness: 400, damping: 30 },
};

export const STAGGER = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
};
