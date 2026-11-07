import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePackage } from '../context/PackageContext';
import Unboxing from '../components/Unboxing.jsx';
import { saveGift } from '../storage/gifts.js';

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

      <p className="room-caption">
        Preview: this is what {to || 'they'} will see. Opening things here won't spoil it.
      </p>

      <Unboxing
        gift={{ to, from, items }}
        opened={opened}
        onOpen={() => setOpened(true)}
        seen={seen}
        onSee={(id) => setSeen((prev) => new Set(prev).add(id))}
        actions={
          <>
            <button className="room-button" onClick={wrap} disabled={saving || items.length === 0}>
              {saving ? 'Wrapping it up…' : 'Wrap it up →'}
            </button>
            {error && <p className="room-error">{error}</p>}
          </>
        }
      />
    </>
  );
}
