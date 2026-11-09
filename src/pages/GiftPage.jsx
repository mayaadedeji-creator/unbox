import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePackage } from '../context/PackageContext';
import Unboxing from '../components/Unboxing.jsx';
import { loadGift, savesOnline, wasMadeHere } from '../storage/gifts.js';
import './GiftPage.css';

// What the recipient opens from the link. They unbox it once; this browser remembers
// what they've opened, so coming back shows the open box with everything still there.
// If the link is opened in the browser the gift was made in, it's the maker checking
// their own gift: nothing is remembered, so it starts wrapped every time (like the preview).
const progressKey = (id) => `gift-progress:${id}`;

function readProgress(id) {
  try {
    const saved = JSON.parse(localStorage.getItem(progressKey(id)));
    if (saved) return { opened: true, seen: new Set(saved.seen) };
  } catch {
    // Storage unavailable (e.g. private mode) — just start fresh.
  }
  return { opened: false, seen: new Set() };
}

function writeProgress(id, seen) {
  try {
    localStorage.setItem(progressKey(id), JSON.stringify({ seen: [...seen] }));
  } catch {
    // Not being able to remember progress shouldn't break the gift.
  }
}

export default function GiftPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reset } = usePackage();
  const [gift, setGift] = useState(undefined); // undefined = loading, null = not found
  const [madeHere] = useState(() => wasMadeHere(id));
  const [progress, setProgress] = useState(() =>
    madeHere ? { opened: false, seen: new Set() } : readProgress(id)
  );
  const remember = (seen) => !madeHere && writeProgress(id, seen);

  useEffect(() => {
    loadGift(id).then(setGift, (err) => {
      console.error("Couldn't load gift", err);
      setGift(null);
    });
  }, [id]);

  const open = () => {
    setProgress((prev) => ({ ...prev, opened: true }));
    remember(progress.seen);
  };

  const see = (itemId) => {
    const seen = new Set(progress.seen).add(itemId);
    setProgress({ opened: true, seen });
    remember(seen);
  };

  const makeOwn = () => {
    reset();
    navigate('/');
  };

  if (gift === undefined) {
    return <p className="gift-loading">Loading your gift…</p>;
  }

  if (gift === null) {
    return (
      <>
        <h1 className="gift-title">We couldn't find this gift</h1>
        <p className="gift-caption">
          Double-check the link you were sent.
          {!savesOnline && " (While testing locally, gifts only open in the browser they were made in.)"}
        </p>
        <button className="unbox-next" onClick={makeOwn}>
          Make a gift
        </button>
      </>
    );
  }

  const allSeen = progress.seen.size >= gift.items.length;

  return (
    <>
      <h1 className="gift-title">
        {gift.from ? `A package from ${gift.from}` : "You've got a package!"}
      </h1>

      {madeHere && (
        <p className="gift-maker-note">
          You made this gift, so opening it here won't count. It'll still be wrapped when{' '}
          {gift.to || 'they'} {gift.to ? 'opens' : 'open'} it.
        </p>
      )}

      <Unboxing
        gift={gift}
        opened={progress.opened}
        onOpen={open}
        seen={progress.seen}
        onSee={see}
        actions={
          <button className={allSeen ? 'unbox-next' : 'unbox-next is-quiet'} onClick={makeOwn}>
            {madeHere ? 'Make another gift' : 'Make your own gift'}
          </button>
        }
      />
    </>
  );
}
