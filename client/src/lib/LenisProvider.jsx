/**
 * LenisProvider — passes through children cleanly.
 * Native browser scrolling provides 100% reliable performance,
 * flawless mouse-wheel / trackpad response, and avoids scroll-jacking freezes.
 */
export function LenisProvider({ children }) {
  return children;
}
