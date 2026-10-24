const SPOTIFY_TYPES = ['track', 'album', 'playlist', 'episode'];

// Accepts share links like
//   https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC?si=...
//   https://open.spotify.com/intl-fr/track/4uLU6hMCjMI75M1A2tKUQC
//   spotify:track:4uLU6hMCjMI75M1A2tKUQC
// and returns { type, id }, or null if it isn't a Spotify link we can embed.
export function parseSpotifyLink(input) {
  const text = input.trim();

  const uri = text.match(/^spotify:(\w+):([A-Za-z0-9]{22})$/);
  if (uri && SPOTIFY_TYPES.includes(uri[1])) {
    return { type: uri[1], id: uri[2] };
  }

  let url;
  try {
    url = new URL(text);
  } catch {
    return null;
  }
  if (url.hostname !== 'open.spotify.com') return null;

  const parts = url.pathname.split('/').filter(Boolean).filter((p) => !p.startsWith('intl-'));
  const [type, id] = parts[0] === 'embed' ? parts.slice(1) : parts;
  if (!SPOTIFY_TYPES.includes(type) || !/^[A-Za-z0-9]{22}$/.test(id ?? '')) return null;

  return { type, id };
}
