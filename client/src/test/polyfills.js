const rafMock = (cb) => setTimeout(cb, 16);
const cafMock = (id) => clearTimeout(id);

if (typeof globalThis !== "undefined") {
  globalThis.requestAnimationFrame = rafMock;
  globalThis.cancelAnimationFrame = cafMock;
}
if (typeof global !== "undefined") {
  global.requestAnimationFrame = rafMock;
  global.cancelAnimationFrame = cafMock;
}
if (typeof window !== "undefined") {
  window.requestAnimationFrame = rafMock;
  window.cancelAnimationFrame = cafMock;
}
