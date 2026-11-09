import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePackage } from '../context/PackageContext';
import BoxDisplay from '../components/BoxDisplay.jsx';
import { giftUrl, loadGift } from '../storage/gifts.js';
import './SharePage.css';

// Step 4: the gift is saved. It gets wrapped in front of you, then you deliver it.
// The paper note is a delivery slip: who it's to and from, a short message to send
// along with it, and the button.
// "Deliver your gift" opens the phone's share menu (Messages, WhatsApp, email…); on a
// computer it copies the link to paste into a message. If neither works, the link shows
// so it can be copied by hand.

// Phones and tablets get the share menu. Computers copy instead, since their share
// menus are less familiar.
const canUseShareMenu = () =>
  typeof navigator.share === 'function' && window.matchMedia('(pointer: coarse)').matches;

// What the message on the delivery slip starts as (the maker can change it)
const DEFAULT_MESSAGE = 'I made you something 💌 Open it when you have a quiet minute.';
const MESSAGE_MAX = 200;

export default function SharePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reset } = usePackage();
  const [gift, setGift] = useState(undefined); // undefined = loading, null = not found
  const [copied, setCopied] = useState(false);
  const [showLink, setShowLink] = useState(false); // if asked for, or copying didn't work
  // A short message that goes along with the link when it's delivered
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const url = giftUrl(id);
  const name = gift?.to || 'them';
  const withMessage = message.trim() ? `${message.trim()}\n${url}` : url;

  useEffect(() => {
    loadGift(id).then(setGift, () => setGift(null));
  }, [id]);

  // "Copied!" goes back to the normal wording after a few seconds
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 4000);
    return () => clearTimeout(timer);
  }, [copied]);

  const deliver = async () => {
    if (canUseShareMenu()) {
      try {
        await navigator.share({ title: `A gift for ${name}`, text: message.trim(), url });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return; // they closed the share menu
        // Anything else: fall through and copy instead
      }
    }
    try {
      await navigator.clipboard.writeText(withMessage);
      setCopied(true);
    } catch {
      // Copying is blocked: show the link so they can copy it themselves
      setShowLink(true);
    }
  };

  const makeAnother = () => {
    reset();
    navigate('/');
  };

  if (gift === null) {
    return (
      <div className="share-wall is-missing">
        <h1 className="share-title">We couldn't find that gift</h1>
        <button className="share-copy" onClick={makeAnother}>
          Make a gift →
        </button>
      </div>
    );
  }

  return (
    <>
      {/* The wrapped box rests low in the room, like on the other steps */}
      <div className="share-stage">
        <BoxDisplay state="closed" wrapped label={gift && { to: gift.to, from: gift.from }} />
      </div>

      {/* Written on the wall to the left: the title, and a paper note taped up with the
          button to deliver it */}
      <div className="share-wall">
        <h1 className="share-title">All wrapped up!</h1>

        <div className="share-card">
          {/* The delivery slip: who it's to and from, like the label on the box */}
          <p className="share-slip">
            <span>
              To: <strong>{gift?.to || '…'}</strong>
            </span>
            <span>
              From: <strong>{gift?.from || '…'}</strong>
            </span>
          </p>

          {/* A message that goes along with the gift when it's delivered */}
          <label className="sr-only" htmlFor="share-message">
            Message to send with your gift
          </label>
          <textarea
            id="share-message"
            className="share-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={MESSAGE_MAX}
            rows={3}
            placeholder={`Add a note for ${name}…`}
          />

          <button className="share-copy" onClick={deliver}>
            Deliver your gift to {name} →
          </button>
          {/* A little alert under the button once the link is copied (screen readers
              read it out too). It's always there so the space doesn't jump. */}
          <p className={`share-copied${copied ? ' is-shown' : ''}`} role="status">
            {copied ? 'Copied! Paste it in a message' : ''}
          </p>

          {showLink ? (
            <>
              <label className="share-label" htmlFor="share-link">
                Copy this link and send it to {name}
              </label>
              <input
                id="share-link"
                className="share-link"
                readOnly
                value={url}
                autoFocus
                onFocus={(e) => e.target.select()}
              />
            </>
          ) : (
            // For anyone who'd rather copy the link by hand
            <button className="share-own-link" onClick={() => setShowLink(true)}>
              or copy the link yourself
            </button>
          )}
        </div>
      </div>

      <button className="share-again" onClick={makeAnother}>
        Make another gift
      </button>
    </>
  );
}
