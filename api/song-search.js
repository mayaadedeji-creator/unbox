// Song search for the song gift: /api/song-search?q=golden+hour
//
// Spotify's search needs an app client ID + secret. The secret can't go in the React app
// (anyone could read it in the browser), so the browser asks this function, and this
// function asks Spotify. Uses the "client credentials" flow: no Spotify login for users.
//
// Needs SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in Vercel's environment variables
// (no VITE_ prefix, so Vite never puts them in the browser bundle).

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SEARCH_URL = 'https://api.spotify.com/v1/search';

// Tokens last an hour. Vercel sometimes reuses a warm function, so keep the token
// around between requests instead of asking Spotify for a new one every search.
let cached = { token: null, expiresAt: 0 };

async function getToken(clientId, clientSecret) {
  if (cached.token && Date.now() < cached.expiresAt) return cached.token;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`Spotify token request failed (${res.status})`);

  const data = await res.json();
  // Refresh a minute early so a token never expires mid-request.
  cached = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return cached.token;
}

export async function GET(request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return Response.json({ error: 'Spotify is not configured' }, { status: 500 });
  }

  const q = new URL(request.url).searchParams.get('q')?.trim();
  if (!q) return Response.json([]);

  try {
    const token = await getToken(clientId, clientSecret);
    const params = new URLSearchParams({ q: q.slice(0, 100), type: 'track', limit: '8' });
    const res = await fetch(`${SEARCH_URL}?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) cached = { token: null, expiresAt: 0 };
    if (!res.ok) throw new Error(`Spotify search failed (${res.status})`);

    const data = await res.json();
    const tracks = data.tracks.items.map((t) => ({
      id: t.id,
      title: t.name,
      artist: t.artists.map((a) => a.name).join(', '),
      album: t.album.name,
      // Spotify lists album art largest first; the last one (~64px) is enough for a thumbnail.
      image: t.album.images.at(-1)?.url ?? null,
    }));

    return Response.json(tracks, {
      // Let Vercel's CDN reuse results for the same search for a few minutes.
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 502 });
  }
}
