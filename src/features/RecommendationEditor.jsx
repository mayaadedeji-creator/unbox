import { normalizeLink } from './helpers.js';

const RECOMMENDATION_MAX = 500;

export default function RecommendationEditor({ value, onChange }) {
  const linkInvalid = normalizeLink(value.link) === null;

  return (
    <div className="feature-stack">
      <label className="feature-field">
        What are you recommending, and why?
        <textarea
          rows={5}
          maxLength={RECOMMENDATION_MAX}
          placeholder="You have to read this book — it made me think of you..."
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          autoFocus
        />
        <span className="feature-hint">
          {value.text.length} / {RECOMMENDATION_MAX}
        </span>
      </label>
      <label className="feature-field">
        Link <span className="feature-hint">(optional)</span>
        <input
          type="url"
          placeholder="https://..."
          value={value.link}
          onChange={(e) => onChange({ ...value, link: e.target.value })}
        />
        {linkInvalid && <span className="feature-error">That doesn't look like a link.</span>}
      </label>
    </div>
  );
}
