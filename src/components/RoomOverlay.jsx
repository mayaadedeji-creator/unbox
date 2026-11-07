import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './RoomOverlay.css';

// Brings one thing forward over the dimmed room: no card around it, an X in the
// screen's corner, and the actions underneath. Used for the address tag and for
// every gift activity. Escape or clicking the dimmed room closes it.
export default function RoomOverlay({ label, heading, actions, error, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className="room-overlay" onClick={onClose}>
      <button className="room-overlay-close" onClick={onClose} aria-label="Close">
        ×
      </button>

      <div
        className="room-overlay-focus"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
      >
        {heading}
        <div className="room-overlay-content">{children}</div>
        <div className="room-overlay-actions">{actions}</div>
        <p className="room-overlay-error" role="alert">
          {error}
        </p>
      </div>
    </div>,
    document.body
  );
}
