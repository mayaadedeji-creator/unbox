import { WHY_PREFIX } from './helpers.js';
const WHY_MAX = 200;

export default function WhyEditor({ value, onChange }) {
  return (
    <label className="why-card">
      <span className="why-prefix">{WHY_PREFIX}…</span>
      <textarea
        className="why-input"
        placeholder="you need a reminder that you're not alone."
        maxLength={WHY_MAX}
        value={value.text}
        onChange={(e) => onChange({ text: e.target.value })}
        autoFocus
      />
      <span className="feature-hint">
        {value.text.length} / {WHY_MAX}
      </span>
    </label>
  );
}
