/**
 * CursorState — High-performance reactive state controller for the AI Cursor.
 * Handles sub-pixel interpolation, velocity vector calculation, 3D normalized coordinates,
 * 3-second idle "AI Thinking Mode" detection, and magnetic attraction.
 */

export class CursorState {
  constructor() {
    this.x = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
    this.y = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
    this.targetX = this.x;
    this.targetY = this.y;

    this.vx = 0;
    this.vy = 0;
    this.speed = 0;

    // Normalized screen coordinates [-1, 1] for 3D & parallax integration
    this.nx = 0;
    this.ny = 0;

    this.mode = "default"; // 'default' | 'hero' | 'scanner' | 'project' | 'service' | 'button' | 'thinking' | 'text'
    this.label = "";
    this.isVisible = false;
    this.isClicking = false;

    // Magnetic pull coordinates
    this.magX = 0;
    this.magY = 0;
    this.magneticElement = null;

    // 3-second idle AI thinking timer
    this.idleTimer = null;
    this.isIdle = false;
    this.IDLE_DELAY = 3000;

    // Listeners
    this.listeners = new Set();
    this.burstListeners = new Set();

    // Bound handlers
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);

    this.lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
  }

  init() {
    if (typeof window === "undefined") return false;

    // Check device capabilities (only enable for pointer: fine & hover: hover)
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || prefersReducedMotion) {
      return false;
    }

    window.addEventListener("mousemove", this.onMouseMove, { passive: true });
    window.addEventListener("mousedown", this.onMouseDown, { passive: true });
    window.addEventListener("mouseup", this.onMouseUp, { passive: true });
    window.addEventListener("scroll", this.onScroll, { passive: true });
    document.addEventListener("mouseleave", this.onMouseLeave);
    document.addEventListener("mouseenter", this.onMouseEnter);

    this.resetIdleTimer();
    return true;
  }

  destroy() {
    if (typeof window === "undefined") return;

    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mousedown", this.onMouseDown);
    window.removeEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("scroll", this.onScroll);
    document.removeEventListener("mouseleave", this.onMouseLeave);
    document.removeEventListener("mouseenter", this.onMouseEnter);

    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
  }

  resetIdleTimer() {
    if (this.idleTimer) clearTimeout(this.idleTimer);

    if (this.mode === "thinking") {
      this.setMode("default", "");
    }
    this.isIdle = false;

    this.idleTimer = setTimeout(() => {
      // Enter AI Thinking Mode only if idle and in default/hero states
      if (this.mode === "default" || this.mode === "hero") {
        this.isIdle = true;
        this.setMode("thinking", "AI THINKING");
      }
    }, this.IDLE_DELAY);
  }

  onMouseMove(e) {
    if (!this.isVisible) {
      this.isVisible = true;
      this.x = e.clientX;
      this.y = e.clientY;
      this.targetX = e.clientX;
      this.targetY = e.clientY;
    } else {
      this.targetX = e.clientX;
      this.targetY = e.clientY;
    }

    // Normalized coordinates
    this.nx = (e.clientX / window.innerWidth) * 2 - 1;
    this.ny = -(e.clientY / window.innerHeight) * 2 + 1;

    this.resetIdleTimer();
  }

  onMouseDown() {
    this.isClicking = true;
    this.triggerBurst(this.x, this.y);
  }

  onMouseUp() {
    this.isClicking = false;
  }

  onScroll() {
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - this.lastScrollY;
    this.lastScrollY = currentScrollY;

    // Feed vertical momentum into particle speed
    this.vy += deltaY * 0.15;
    this.resetIdleTimer();
  }

  onMouseLeave() {
    this.isVisible = false;
    if (this.idleTimer) clearTimeout(this.idleTimer);
  }

  onMouseEnter() {
    this.isVisible = true;
    this.resetIdleTimer();
  }

  setMode(mode, label = "") {
    if (this.mode === mode && this.label === label) return;
    this.mode = mode;
    this.label = label;
    this.notify();
  }

  setMagnetic(element, magX, magY) {
    this.magneticElement = element;
    this.magX = magX;
    this.magY = magY;
  }

  clearMagnetic() {
    this.magneticElement = null;
    this.magX = 0;
    this.magY = 0;
  }

  update(deltaTime = 0.016) {
    // Smooth physical inertia (lerp)
    const factor = 0.18;
    const prevX = this.x;
    const prevY = this.y;

    // Apply magnetic attraction if active
    const targetWithMagX = this.targetX + this.magX;
    const targetWithMagY = this.targetY + this.magY;

    this.x += (targetWithMagX - this.x) * factor;
    this.y += (targetWithMagY - this.y) * factor;

    // Calculate instantaneous velocity
    this.vx = (this.x - prevX) / (deltaTime * 60);
    this.vy = (this.y - prevY) / (deltaTime * 60);
    this.speed = Math.hypot(this.vx, this.vy);
  }

  triggerBurst(x, y) {
    for (const listener of this.burstListeners) {
      listener(x, y);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  subscribeBurst(listener) {
    this.burstListeners.add(listener);
    return () => this.burstListeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this);
    }
  }
}

// Global singleton instance
export const cursorState = new CursorState();
