import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePackage } from '../context/PackageContext';
import BoxDisplay from '../components/BoxDisplay';
import MailLabel from '../components/MailLabel.jsx';
import AddressEditor from '../components/AddressEditor.jsx';
import './OpeningPage.css';

// Long enough for "Grandma & Grandpa Johnson"; the label fits about two lines.
const NAME_MAX = 30;

// Step 1: a closed box sitting low in the room with a blank tag floating to its right.
// Tap the tag to write on it, then attach it and it lands on the box.
export default function OpeningPage() {
  const navigate = useNavigate();
  const { to, setTo, from, setFrom } = usePackage();
  const [attached, setAttached] = useState(to.trim() !== '' && from.trim() !== '');
  const [justAttached, setJustAttached] = useState(false);
  const [editing, setEditing] = useState(false);

  const attach = () => {
    setEditing(false);
    setAttached(true);
    setJustAttached(true);
  };

  return (
    <>
      <h1 className="sr-only">Step 1 of 4: Address your box</h1>

      <div className={`room-stage${justAttached ? ' just-attached' : ''}`}>
        <BoxDisplay
          state="closed"
          label={attached ? { to, from } : null}
          onLabelClick={() => setEditing(true)}
        />

        {!attached && !editing && (
          <button
            className="floating-tag"
            onClick={() => setEditing(true)}
            aria-label="Write on the address tag"
          >
            <MailLabel to={to} from={from} />
          </button>
        )}
      </div>

      {/* A handwritten note on the wall, up and to the left of the box */}
      {!attached && (
        <p className="room-note" hidden={editing}>
          Tap the tag to address your gift
        </p>
      )}

      <div className="room-actions opening-actions">
        {attached && (
          <>
            {/* Written on the wall like the hint, with a hand-drawn arrow toward the box */}
            <button className="note-link" onClick={() => navigate('/fill-the-box')}>
              Now fill the box
              <svg className="note-arrow" viewBox="0 0 80 40" aria-hidden="true">
                <path d="M4 10 C 22 4, 40 30, 66 26" />
                <path d="M56 17 L 67 26 L 55 33" />
              </svg>
            </button>
          </>
        )}
      </div>

      {editing && (
        <AddressEditor
          to={to}
          from={from}
          setTo={setTo}
          setFrom={setFrom}
          maxLength={NAME_MAX}
          onAttach={attach}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}
