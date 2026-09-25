/**
 * splitTextHelper — High-performance text splitting utility for React & GSAP.
 *
 * Decomposes plain text or text strings into semantic words and character tokens
 * preserving whitespace, punctuation, accessibility, and 3D layout bounds.
 */

/**
 * Split text string into words and characters
 * @param {string} text
 * @returns {Array<{ word: string, wordIndex: number, chars: Array<{ char: string, charIndex: number, globalIndex: number }> }>}
 */
export function splitTextToTokens(text) {
  if (typeof text !== "string") {
    text = String(text ?? "");
  }

  // Split by whitespace while preserving space indicators
  const rawWords = text.split(/(\s+)/);
  let globalCharCount = 0;
  let wordIndex = 0;

  const result = [];

  rawWords.forEach((token) => {
    if (!token) return;

    const isWhitespace = /^\s+$/.test(token);

    if (isWhitespace) {
      result.push({
        word: token,
        isSpace: true,
        wordIndex: -1,
        chars: [
          {
            char: token,
            charIndex: 0,
            globalIndex: globalCharCount++,
            isSpace: true,
          },
        ],
      });
      return;
    }

    const chars = token.split("").map((char, cIdx) => ({
      char,
      charIndex: cIdx,
      globalIndex: globalCharCount++,
      isSpace: false,
    }));

    result.push({
      word: token,
      isSpace: false,
      wordIndex: wordIndex++,
      chars,
    });
  });

  return result;
}

/**
 * Extract pure plain text from React children
 */
export function extractPlainText(children) {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(extractPlainText).join("");
  }

  if (children && typeof children === "object" && children.props && children.props.children) {
    return extractPlainText(children.props.children);
  }

  return "";
}
