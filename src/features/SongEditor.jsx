import { useEffect, useRef, useState } from 'react';
import { parseSpotifyLink } from './spotify.js';

// Our Vercel function (api/song-search.js), which holds the Spotify secret.
const SEARCH_URL = '/api/song-search?q=';
const SEARCH_DELAY_MS = 350;

export function SpotifyEmbed({ type, id }) {
  return (
    <iframe
      title="Spotify player"
      src={`https://open.spotify.com/embed/${type}/${id}`}
      width="100%"
      height={type === 'track' ? 152 : 352}
      style={{ border: 0, borderRadius: 12 }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}

export default function SongEditor({ value, onChange }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState('idle');
  const timer = useRef(null);
  const latest = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const search = async (q) => {
    const requestId = ++latest.current;
    setStatus('searching');
    try {
      const res = await fetch(SEARCH_URL + encodeURIComponent(q));
      if (!res.ok) throw new Error(res.statusText);
      const tracks = await res.json();
      // Ignore answers to older searches that arrive after newer ones.
      if (requestId !== latest.current) return;
      setResults(tracks);
      setStatus('idle');
    } catch {
      if (requestId === latest.current) setStatus('error');
    }
  };

  const handleChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    clearTimeout(timer.current);
    latest.current++; // cancels any search still in flight

    // A pasted Spotify link skips search and goes straight in, like before.
    const spotify = parseSpotifyLink(text);
    if (spotify) {
      onChange({ link: text.trim(), spotify });
      setResults(null);
      setStatus('idle');
      return;
    }

    if (text.trim() === '') {
      setResults(null);
      setStatus('idle');
      return;
    }
    timer.current = setTimeout(() => search(text.trim()), SEARCH_DELAY_MS);
  };

  const choose = (track) => {
    onChange({
      link: `https://open.spotify.com/track/${track.id}`,
      spotify: { type: 'track', id: track.id },
    });
    setQuery('');
    setResults(null);
  };

  return (
    <div className="feature-stack">
      <label className="feature-field">
        Search for a song
        <input
          type="search"
          placeholder="Song title or artist, or paste a Spotify link"
          value={query}
          onChange={handleChange}
          autoFocus
        />
      </label>

      {status === 'searching' && !results && <span className="feature-hint">Searching…</span>}
      {status === 'error' && (
        <span className="feature-error">Couldn't search right now. Try again in a moment.</span>
      )}
      {results && results.length === 0 && <span className="feature-hint">No songs found.</span>}
      {results && results.length > 0 && (
        <ul className="song-results">
          {results.map((track) => (
            <li key={track.id}>
              <button type="button" onClick={() => choose(track)}>
                {track.image ? (
                  <img src={track.image} alt="" width={40} height={40} />
                ) : (
                  <span className="song-results-blank" />
                )}
                <span className="song-results-text">
                  <span className="song-results-title">{track.title}</span>
                  <span className="song-results-artist">{track.artist}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {value.spotify && <SpotifyEmbed {...value.spotify} />}
    </div>
  );
}
