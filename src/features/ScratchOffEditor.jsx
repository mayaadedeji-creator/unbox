import { useState } from 'react';
import DrawingCanvas from './DrawingCanvas.jsx';
import ScratchReveal from './ScratchReveal.jsx';
import { DRAWING_COLORS } from './helpers.js';

const SCRATCH_TEXT_MAX = 120;

export function ScratchContent({ value }) {
  return value.mode === 'draw' ? (
    <img src={value.image} alt="Hidden drawing" />
  ) : (
    <p className="scratch-text">{value.text}</p>
  );
}

export default function ScratchOffEditor({ value, onChange }) {
  const [previewing, setPreviewing] = useState(false);
  const hasContent = value.mode === 'draw' ? Boolean(value.image) : value.text.trim() !== '';

  if (previewing) {
    return (
      <div className="feature-stack">
        <span className="feature-hint">This is what they'll see — try scratching it.</span>
        <ScratchReveal>
          <ScratchContent value={value} />
        </ScratchReveal>
        <button type="button" className="feature-button secondary" onClick={() => setPreviewing(false)}>
          ← Back to editing
        </button>
      </div>
    );
  }

  return (
    <div className="feature-stack">
      <div className="mode-tabs" role="tablist">
        {['type', 'draw'].map((mode) => (
          <button
            key={mode}
            type="button"
            role="tab"
            aria-selected={value.mode === mode}
            className={value.mode === mode ? 'is-active' : ''}
            onClick={() => onChange({ ...value, mode })}
          >
            {mode === 'type' ? 'Type a message' : 'Draw something'}
          </button>
        ))}
      </div>

      {value.mode === 'draw' ? (
        <DrawingCanvas
          value={value.image}
          onChange={(image) => onChange({ ...value, image })}
          colors={DRAWING_COLORS}
        />
      ) : (
        <label className="feature-field">
          What's hidden under the scratch-off?
          <textarea
            className="scratch-input"
            maxLength={SCRATCH_TEXT_MAX}
            placeholder="You just won… a hug!"
            value={value.text}
            onChange={(e) => onChange({ ...value, text: e.target.value })}
            autoFocus
          />
          <span className="feature-hint">
            {value.text.length} / {SCRATCH_TEXT_MAX}
          </span>
        </label>
      )}

      <button
        type="button"
        className="feature-button secondary"
        onClick={() => setPreviewing(true)}
        disabled={!hasContent}
      >
        Preview the scratch-off
      </button>
    </div>
  );
}
