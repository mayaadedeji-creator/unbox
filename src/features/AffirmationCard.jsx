// The affirmation as a card. Shared by the editor (maker) and the viewer (recipient).
export function AffirmationCard({ value, loading = false }) {
  return (
    <figure className="affirmation-card">
      {loading ? (
        <span className="affirmation-loading">Finding an affirmation…</span>
      ) : (
        <blockquote className="affirmation-text">“{value.text}”</blockquote>
      )}
    </figure>
  );
}

// API League's free plan requires a link back to them wherever their content is shown.
export function AffirmationCredit({ source }) {
  if (source !== 'api') return null;
  return (
    <p className="affirmation-credit">
      Affirmation from{' '}
      <a href="https://apileague.com" target="_blank" rel="noopener noreferrer">
        API League
      </a>
    </p>
  );
}
