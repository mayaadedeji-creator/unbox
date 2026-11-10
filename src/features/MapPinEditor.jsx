import { useState } from 'react';
import { placeName, shortName, zoomFor } from './places.js';

// OpenStreetMap's free geocoder finds the places. Its usage policy doesn't allow
// search-as-you-type, so we only search when the user submits.
const SEARCH_URL =
  'https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&q=';

const NOTE_MAX = 200;

// OpenStreetMap's embeddable map with a marker. The zoom saved with the place sets how
// much area is shown (close in on a café, further out for a city); older gifts have no
// zoom, so they get the street-level view they always had.
export function MapEmbed({ lat, lon, zoom = 14 }) {
  const halfWidth = 180 / 2 ** zoom;
  const halfHeight = halfWidth * 0.6;
  const bbox = [lon - halfWidth, lat - halfHeight, lon + halfWidth, lat + halfHeight].join(',');
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
  const note = value.note ?? '';

  const search = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setStatus('searching');
    try {
      const res = await fetch(SEARCH_URL + encodeURIComponent(q));
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setResults(data.map((r) => ({ id: r.place_id, raw: r, ...shortName(r) })));
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  };

  const choose = ({ raw, name, area }) => {
    onChange({
      place: {
        label: raw.display_name,
        name,
        area,
        lat: Number(raw.lat),
        lon: Number(raw.lon),
        zoom: zoomFor(raw),
      },
      note,
    });
    setResults(null);
    setQuery('');
  };

  return (
    <div className="feature-stack">
      <form className="feature-field" onSubmit={search}>
        <label htmlFor="map-search">{value.place ? 'Search for a different place' : 'Search for a place'}</label>
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
        <span className="feature-error">Couldn't search right now. Try again in a moment.</span>
      )}
      {results && results.length === 0 && <span className="feature-hint">No places found.</span>}
      {results && results.length > 0 && (
        <ul className="map-results">
          {results.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => choose(r)}>
                <span className="map-result-name">{r.name}</span>
                {r.area && <span className="map-result-area">{r.area}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      {value.place && (
        <>
          <MapEmbed lat={value.place.lat} lon={value.place.lon} zoom={value.place.zoom} />
          <p className="map-chosen">
            <span className="map-result-name">{placeName(value.place)}</span>
            {value.place.area && <span className="map-result-area">{value.place.area}</span>}
          </p>
          <label className="feature-field">
            Add a note (optional)
            <textarea
              rows={2}
              maxLength={NOTE_MAX}
              placeholder="Where we had our first coffee..."
              value={note}
              onChange={(e) => onChange({ place: value.place, note: e.target.value })}
            />
            <span className="feature-hint">
              {note.length} / {NOTE_MAX}
            </span>
          </label>
        </>
      )}
    </div>
  );
}
