import { useState } from 'react';

// OpenStreetMap's free geocoder. Its usage policy doesn't allow search-as-you-type,
// so we only search when the user submits.
const SEARCH_URL = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=';

export function MapEmbed({ lat, lon }) {
  const bbox = [lon - 0.01, lat - 0.006, lon + 0.01, lat + 0.006].join(',');
  return (
    <iframe
      title="Map"
      className="map-embed"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`}
      loading="lazy"
    />
  );
}

export default function MapPinEditor({ value, onChange }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState('idle');

  const search = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setStatus('searching');
    try {
      const res = await fetch(SEARCH_URL + encodeURIComponent(q));
      if (!res.ok) throw new Error(res.statusText);
      setResults(await res.json());
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  };

  const choose = (r) => {
    onChange({ place: { label: r.display_name, lat: Number(r.lat), lon: Number(r.lon) } });
    setResults(null);
    setQuery('');
  };

  return (
    <div className="feature-stack">
      <form className="feature-field" onSubmit={search}>
        <label htmlFor="map-search">Search for a place</label>
        <div className="feature-row">
          <input
            id="map-search"
            type="search"
            placeholder="A café, a city, an address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button type="submit" className="feature-button" disabled={status === 'searching'}>
            {status === 'searching' ? 'Searching…' : 'Search'}
          </button>
        </div>
      </form>

      {status === 'error' && (
        <span className="feature-error">Couldn't search right now — try again in a moment.</span>
      )}
      {results && results.length === 0 && <span className="feature-hint">No places found.</span>}
      {results && results.length > 0 && (
        <ul className="map-results">
          {results.map((r) => (
            <li key={r.place_id}>
              <button type="button" onClick={() => choose(r)}>
                {r.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {value.place && (
        <>
          <p className="map-chosen">📍 {value.place.label}</p>
          <MapEmbed lat={value.place.lat} lon={value.place.lon} />
        </>
      )}
    </div>
  );
}
