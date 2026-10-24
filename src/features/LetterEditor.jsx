const LETTER_MAX = 1500;

export default function LetterEditor({ value, onChange }) {
  return (
    <div className="letter-paper">
      <textarea
        className="letter-text"
        placeholder="Dear..."
        maxLength={LETTER_MAX}
        value={value.text}
        onChange={(e) => onChange({ text: e.target.value })}
        autoFocus
      />
      <span className="letter-count">
        {value.text.length} / {LETTER_MAX}
      </span>
    </div>
  );
}
