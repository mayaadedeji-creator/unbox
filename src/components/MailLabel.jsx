import labelImage from '../assets/mail-label.svg';
import './MailLabel.css';

// Longer names get smaller handwriting so they still fit on the label's two lines.
const sizeClass = (text) => (text.length > 14 ? ' is-long' : '');

// Each letter is its own span so new letters can "ink in" as they're typed.
// Keyed by position, so only letters that weren't there before animate.
function Ink({ text }) {
  return (
    <span className="mail-label-ink" aria-hidden="true">
      {[...text].map((char, i) => (
        <span key={i} className="ink-letter">
          {char}
        </span>
      ))}
    </span>
  );
}

// One writing line you can type straight onto. The real text box sits on top with
// invisible text (so typing, the caret and screen readers all work), and the
// handwriting shows through from underneath.
function EditableLine({ which, label, value, onChange, placeholder, maxLength, autoFocus }) {
  return (
    <span className={`mail-label-text is-editable is-${which}${sizeClass(value)}`}>
      <Ink text={value} />
      <textarea
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\n/g, ''))}
        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={2}
        autoFocus={autoFocus}
        spellCheck={false}
        autoComplete="off"
      />
    </span>
  );
}

// The To/From shipping label, with the names written on its lines.
// Everything is sized relative to the label's width, so it works at any size.
// Pass `edit` ({ setTo, setFrom, maxLength }) to make the lines typeable.
export default function MailLabel({ to, from, edit }) {
  if (edit) {
    return (
      <div className="mail-label">
        <img src={labelImage} alt="" />
        <EditableLine
          which="to"
          label="To"
          value={to}
          onChange={edit.setTo}
          placeholder="Who's it for?"
          maxLength={edit.maxLength}
          autoFocus
        />
        <EditableLine
          which="from"
          label="From"
          value={from}
          onChange={edit.setFrom}
          placeholder="Who's it from?"
          maxLength={edit.maxLength}
        />
      </div>
    );
  }

  return (
    <div
      className="mail-label"
      role="img"
      aria-label={`Shipping label. To: ${to || 'blank'}. From: ${from || 'blank'}.`}
    >
      <img src={labelImage} alt="" />
      <span className={`mail-label-text is-to${sizeClass(to)}`}>{to}</span>
      <span className={`mail-label-text is-from${sizeClass(from)}`}>{from}</span>
    </div>
  );
}
