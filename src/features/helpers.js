// Reads a color or font from src/styles/token.css, for code that can't use var() (like canvas drawing).
export const cssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// A function rather than a list so the colors are read after the stylesheet has loaded.
export const drawingColors = () => [cssVar('--color-ink'), cssVar('--color-primary'), cssVar('--color-pop')];

// Returns a normalized http(s) URL, '' for an empty field, or null if it isn't a usable link.
// "example.com/thing" is accepted and becomes "https://example.com/thing".
export function normalizeLink(input) {
  const text = input.trim();
  if (!text) return '';
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    return url.hostname.includes('.') ? url.href : null;
  } catch {
    return null;
  }
}

export const WHY_PREFIX = "I'm sending this for when";
