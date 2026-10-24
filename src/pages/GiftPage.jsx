import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePackage } from '../context/PackageContext';
import Unboxing from '../components/Unboxing.jsx';
import { loadGift, savesOnline } from '../storage/gifts.js';

// What the recipient opens from the link. They unbox it once; this browser remembers
// what they've opened, so coming back shows the open box with everything still there.
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
  const [progress, setProgress] = useState(() => readProgress(id));

  useEffect(() => {
    loadGift(id).then(setGift, (err) => {
      console.error("Couldn't load gift", err);
      setGift(null);
    });
  }, [id]);

  const open = () => {
    setProgress((prev) => ({ ...prev, opened: true }));
    writeProgress(id, progress.seen);
  };

  const see = (itemId) => {
    const seen = new Set(progress.seen).add(itemId);
    setProgress({ opened: true, seen });
    writeProgress(id, seen);
  };

  const makeOwn = () => {
    reset();
    navigate('/');
  };

  if (gift === undefined) {
    return (
      <div className="in-box-1">
        <h1>Loading your gift…</h1>
      </div>
    );
  }

  if (gift === null) {
    return (
      <>
        <div className="in-box-1">
          <h1>We couldn't find this gift</h1>
        </div>
        <div className="in-box-2 gift-missing">
          <p>
            Double-check the link you were sent.
            {!savesOnline && " (While testing locally, gifts only open in the browser they were made in.)"}
          </p>
        </div>
        <div className="in-box-3">
          <div className="unboxing-actions">
            <button className="panel-button" onClick={makeOwn}>
              Make a gift
            </button>
          </div>
        </div>
      </>
    );
  }

  const allSeen = progress.seen.size >= gift.items.length;

  return (
    <>
      <div className="in-box-1">
        <h1>{gift.from ? `A package from ${gift.from}` : "You've got a package!"}</h1>
      </div>

      <Unboxing
        gift={gift}
        opened={progress.opened}
        onOpen={open}
        seen={progress.seen}
        onSee={see}
        actions={
          <button className={`panel-button${allSeen ? '' : ' is-secondary'}`} onClick={makeOwn}>
            Make your own gift
          </button>
        }
      />
    </>
  );
}
