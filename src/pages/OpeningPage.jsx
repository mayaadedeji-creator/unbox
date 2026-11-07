import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePackage } from '../context/PackageContext';
import BoxDisplay from '../components/BoxDisplay';
import MailLabel from '../components/MailLabel.jsx';
import AddressEditor from '../components/AddressEditor.jsx';
import './OpeningPage.css';

// Long enough for "Grandma & Grandpa Johnson"; the label fits about two lines.
const NAME_MAX = 30;

// Step 1: a closed box in the middle of the room with a blank tag floating beside it.
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
        <BoxDisplay state="closed" label={attached ? { to, from } : null} />

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

      <div className="room-actions">
        {attached ? (
          <>
            <button className="room-button" onClick={() => navigate('/fill-the-box')}>
              Fill the box →
            </button>
            <button className="room-text-button" onClick={() => setEditing(true)}>
              Edit the label
            </button>
          </>
        ) : (
          <p className="room-hint" hidden={editing}>
            Tap the tag to address your gift
          </p>
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
