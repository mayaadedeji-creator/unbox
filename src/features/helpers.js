export const DRAWING_COLORS = ['#08060d', '#3E517A', '#e0607e'];

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
