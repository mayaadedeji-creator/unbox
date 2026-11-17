import { useRef } from 'react';
import labelImage from '../assets/mail-label.svg';
import './MailLabel.css';

// Longer names get smaller handwriting so they still fit on the label's two lines.
const sizeClass = (text) => (text.length > 14 ? ' is-long' : '');

// The handwriting you see while typing (the real text box above it is invisible).
function Ink({ text }) {
  return (
    <span className="mail-label-ink" aria-hidden="true">
      {text}
    </span>
  );
}

// One writing line you can type straight onto. The real text box sits on top with
// invisible text (so typing, the caret and screen readers all work), and the
// handwriting shows through from underneath. Each line holds one name, so Enter
// doesn't start a new line; it runs `onEnter` instead.
function EditableLine({
  which,
  label,
  value,
  onChange,
  onEnter,
  inputRef,
  placeholder,
  maxLength,
  autoFocus,
}) {
  return (
    <span className={`mail-label-text is-editable is-${which}${sizeClass(value)}`}>
      <Ink text={value} />
      <textarea
        ref={inputRef}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\n/g, ''))}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          onEnter?.();
        }}
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
// Pass `edit` ({ setTo, setFrom, maxLength, onSubmit }) to make the lines typeable.
// Enter on the To line moves down to From while From is still blank; otherwise
// Enter runs `onSubmit`, the same as clicking the finish button.
export default function MailLabel({ to, from, edit }) {
  const fromRef = useRef(null);

  if (edit) {
    return (
      <div className="mail-label">
        <img src={labelImage} alt="" />
        <EditableLine
          which="to"
          label="To"
          value={to}
          onChange={edit.setTo}
          onEnter={() => (from.trim() ? edit.onSubmit?.() : fromRef.current?.focus())}
          placeholder="Who's it for?"
          maxLength={edit.maxLength}
          autoFocus
        />
        <EditableLine
          which="from"
          label="From"
          value={from}
          onChange={edit.setFrom}
          onEnter={edit.onSubmit}
          inputRef={fromRef}
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
