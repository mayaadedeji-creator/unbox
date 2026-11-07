import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePackage } from '../context/PackageContext';
import BoxDisplay from '../components/BoxDisplay.jsx';
import { giftUrl, loadGift } from '../storage/gifts.js';
import './SharePage.css';

// Step 4: the gift is saved. It gets wrapped in front of you, then you get the link to send.
export default function SharePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reset } = usePackage();
  const [gift, setGift] = useState(undefined); // undefined = loading, null = not found
  const [copied, setCopied] = useState(false);
  const url = giftUrl(id);

  useEffect(() => {
    loadGift(id).then(setGift, () => setGift(null));
  }, [id]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — select the text so they can copy it themselves.
      document.getElementById('share-link')?.select();
    }
  };

  const makeAnother = () => {
    reset();
    navigate('/');
  };

  if (gift === null) {
    return (
      <>
        <h1 className="room-title">We couldn't find that gift</h1>
        <div className="room-actions">
          <button className="room-button" onClick={makeAnother}>
            Make a gift
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="room-title share-title">Your gift is wrapped!</h1>

      <div className="share-stage">
        <div className="share-box">
          <BoxDisplay state="closed" wrapped label={gift && { to: gift.to, from: gift.from }} />
        </div>
      </div>

      <div className="room-actions share-actions">
        <label className="share-label" htmlFor="share-link">
          Send this link to {gift?.to || 'them'}
        </label>
        <div className="share-link">
          <input id="share-link" readOnly value={url} onFocus={(e) => e.target.select()} />
          <button className="room-button" onClick={copy}>
            {copied ? 'Copied ✓' : 'Copy link'}
          </button>
        </div>
        <p className="share-note">
          Heads up: opening the link yourself counts as unwrapping it on this device. Use your
          preview to check it instead.
        </p>
        <button className="room-text-button" onClick={makeAnother}>
          Make another gift
        </button>
      </div>
    </>
  );
}
