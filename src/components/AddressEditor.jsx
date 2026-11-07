import { useState } from 'react';
import MailLabel from './MailLabel.jsx';
import RoomOverlay from './RoomOverlay.jsx';
import './AddressEditor.css';

// The address tag brought forward so you can write on it.
export default function AddressEditor({ to, from, setTo, setFrom, maxLength, onAttach, onClose }) {
  const [error, setError] = useState('');

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

  return (
    <RoomOverlay
      label="Address your box"
      onClose={onClose}
      error={error}
      actions={
        <button className="room-button" onClick={attach}>
          Attach to box
        </button>
      }
    >
      <div className="address-tag">
        <MailLabel
          to={to}
          from={from}
          edit={{ setTo: clearError(setTo), setFrom: clearError(setFrom), maxLength }}
        />
      </div>
    </RoomOverlay>
  );
}
