import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import MailLabel from './MailLabel.jsx';
import './AddressEditor.css';

// The address tag brought forward over the dimmed room. No card around it:
// just the label you type on, "Attach to box" under it, and an X in the corner.
export default function AddressEditor({ to, from, setTo, setFrom, maxLength, onAttach, onClose }) {
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const attach = () => {
    if (!to.trim() || !from.trim()) {
      setError(!to.trim() ? 'Add who it’s for first' : 'Add who it’s from first');
      return;
    }
    onAttach();
  };

  const clearError = (set) => (value) => {
    setError('');
    set(value);
  };

  return createPortal(
    <div className="address-overlay" onClick={onClose}>
      <button className="address-close" onClick={onClose} aria-label="Close">
        ×
      </button>

      <div
        className="address-focus"
        role="dialog"
        aria-modal="true"
        aria-label="Address your box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="address-tag">
          <MailLabel
            to={to}
            from={from}
            edit={{ setTo: clearError(setTo), setFrom: clearError(setFrom), maxLength }}
          />
        </div>

        <button className="room-button" onClick={attach}>
          Attach to box
        </button>
        <p className="address-error" role="alert">
          {error}
        </p>
      </div>
    </div>,
    document.body
  );
}
