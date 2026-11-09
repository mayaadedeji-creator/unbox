import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePackage } from '../context/PackageContext';
import Unboxing from '../components/Unboxing.jsx';
import { saveGift } from '../storage/gifts.js';
import './PreviewPage.css';

// Step 3: the maker sees the gift exactly as the recipient will.
// Nothing here is remembered — it resets every time, so it never "uses up" the gift.
export default function PreviewPage() {
  const navigate = useNavigate();
  const { to, from, items } = usePackage();
  const [opened, setOpened] = useState(false);
  const [seen, setSeen] = useState(() => new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const wrap = async () => {
    setSaving(true);
    setError('');
    try {
      const id = await saveGift({ to, from, items });
      navigate(`/share/${id}`);
    } catch (err) {
      console.error("Couldn't save gift", err);
      setError("Couldn't save your gift. Try again.");
      setSaving(false);
    }
  };

  return (
    <>
      <h1 className="sr-only">Step 3 of 4: Preview your gift</h1>

      <button className="room-back" onClick={() => navigate('/fill-the-box')}>
        ← Keep editing
      </button>

      {/* A small handwritten aside up in the corner */}
      <p className="preview-note">
        Preview: this is what {to || 'they'} will see. Opening things here won't spoil it.
      </p>

      <Unboxing
        wrapped={false}
        gift={{ to, from, items }}
        opened={opened}
        onOpen={() => setOpened(true)}
        seen={seen}
        onSee={(id) => setSeen((prev) => new Set(prev).add(id))}
        actions={
          <>
            <button className="unbox-next" onClick={wrap} disabled={saving || items.length === 0}>
              {saving ? 'Wrapping it up…' : 'Wrap it up'}
              <svg viewBox="0 0 80 40" aria-hidden="true">
                <path d="M4 10 C 22 4, 40 30, 66 26" />
                <path d="M56 17 L 67 26 L 55 33" />
              </svg>
            </button>
            {error && <p className="room-error">{error}</p>}
          </>
        }
      />
    </>
  );
}
