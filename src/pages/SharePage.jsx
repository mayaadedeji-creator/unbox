import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePackage } from '../context/PackageContext';
import SenderSteps from '../components/SenderSteps.jsx';
import BoxDisplay from '../components/BoxDisplay.jsx';
import { giftUrl, loadGift } from '../storage/gifts.js';
import './SharePage.css';

// Step 4: the gift is saved — give the maker the link to send.
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
      <div className="in-box-1">
        <SenderSteps step={4} title="We couldn't find that gift" />
      </div>
    );
  }

  return (
    <>
      <div className="in-box-1">
        <SenderSteps step={4} title="Your gift is wrapped!" subtitle="Send this link and they'll get to unbox it." />
      </div>

      <div className="in-box-2">
        <BoxDisplay state="closed" label={gift && { to: gift.to, from: gift.from }} />
      </div>

      <div className="in-box-3 share-panel">
        <label className="share-field">
          Send this link to {gift?.to || 'them'}
          <input id="share-link" readOnly value={url} onFocus={(e) => e.target.select()} />
        </label>
        <button className="panel-button" onClick={copy}>
          {copied ? 'Copied ✓' : 'Copy link'}
        </button>
        <p className="share-note">
          Heads up: opening the link yourself counts as unwrapping it on this device.
          Use your preview to check it instead.
        </p>

        <div className="unboxing-actions">
          <button className="panel-button is-secondary" onClick={makeAnother}>
            Make another gift
          </button>
        </div>
      </div>
    </>
  );
}
