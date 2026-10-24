import { useState } from 'react';
import { parseSpotifyLink } from './spotify.js';

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
  const [input, setInput] = useState(value.link);
  const showError = input.trim() !== '' && !value.spotify;

  const handleChange = (e) => {
    const link = e.target.value;
    setInput(link);
    onChange({ link, spotify: parseSpotifyLink(link) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <label className="feature-field">
        Paste a Spotify link
        <input
          type="url"
          placeholder="https://open.spotify.com/track/..."
          value={input}
          onChange={handleChange}
          autoFocus
        />
        <span className="feature-hint">
          In Spotify, click ⋯ on a song → Share → Copy Song Link.
        </span>
        {showError && (
          <span className="feature-error">
            That doesn't look like a Spotify song, album, playlist, or episode link.
          </span>
        )}
      </label>

      {value.spotify && <SpotifyEmbed {...value.spotify} />}
    </div>
  );
}
