// Read-only views of each feature: what the person opening the box sees.
// Each gets { value } — the same data the matching editor saved.
import { SpotifyEmbed } from './SongEditor.jsx';
import { MapEmbed } from './MapPinEditor.jsx';
import ScratchReveal from './ScratchReveal.jsx';
import { ScratchContent } from './ScratchOffEditor.jsx';
import { AffirmationCard, AffirmationCredit } from './AffirmationCard.jsx';
import { WHY_PREFIX, normalizeLink } from './helpers.js';

export function LetterViewer({ value }) {
  return (
    <div className="letter-paper">
      <div className="letter-text is-reading">{value.text}</div>
    </div>
  );
}

export function SongViewer({ value }) {
  return <SpotifyEmbed {...value.spotify} />;
}

export function PhotoViewer({ value }) {
  return <img className="viewer-image" src={value.image} alt="A photo for you" />;
}

export function MapPinViewer({ value }) {
  const { label, lat, lon } = value.place;
  return (
    <div className="feature-stack">
      <p className="map-chosen">📍 {label}</p>
      <MapEmbed lat={lat} lon={lon} />
      <a
        className="viewer-link"
        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Google Maps ↗
      </a>
    </div>
  );
}

export function AffirmationViewer({ value }) {
  return (
    <div className="feature-stack">
      <AffirmationCard value={value} />
      <AffirmationCredit source={value.source} />
    </div>
  );
}

export function ScratchOffViewer({ value }) {
  return (
    <ScratchReveal>
      <ScratchContent value={value} />
    </ScratchReveal>
  );
}

export function VoiceMemoViewer({ value }) {
  return (
    <div className="feature-stack voice-memo">
      <audio controls src={value.audio} className="voice-player" />
    </div>
  );
}

export function DrawingViewer({ value }) {
  return <img className="viewer-image" src={value.image} alt="A drawing for you" />;
}

export function WhyViewer({ value }) {
  return (
    <div className="why-card">
      <span className="why-prefix">{WHY_PREFIX}…</span>
      <p className="why-input is-reading">{value.text}</p>
    </div>
  );
}

export function RecommendationViewer({ value }) {
  const href = normalizeLink(value.link);
  return (
    <div className="feature-stack">
      <p className="recommendation-text">{value.text}</p>
      {href && (
        <a className="viewer-link" href={href} target="_blank" rel="noopener noreferrer">
          {new URL(href).hostname.replace(/^www\./, '')} ↗
        </a>
      )}
    </div>
  );
}
