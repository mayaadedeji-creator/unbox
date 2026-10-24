import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePackage } from '../context/PackageContext';
import SenderSteps from '../components/SenderSteps.jsx';
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

  const share = async () => {
    setSaving(true);
    setError('');
    try {
      const id = await saveGift({ to, from, items });
      navigate(`/share/${id}`);
    } catch (err) {
      console.error("Couldn't save gift", err);
      setError("Couldn't save your gift. Please try again.");
      setSaving(false);
    }
  };

  return (
    <>
      <div className="in-box-1">
        <SenderSteps
          step={3}
          title="Preview your gift"
          subtitle={`This is what ${to || 'they'} will see. Opening things here won't spoil it.`}
        />
      </div>

      <Unboxing
        gift={{ to, from, items }}
        opened={opened}
        onOpen={() => setOpened(true)}
        seen={seen}
        onSee={(id) => setSeen((prev) => new Set(prev).add(id))}
        actions={
          <>
            {error && <p className="panel-error">{error}</p>}
            <button className="panel-button" onClick={share} disabled={saving || items.length === 0}>
              {saving ? 'Wrapping it up…' : 'Share this gift →'}
            </button>
            <button className="panel-button is-secondary" onClick={() => navigate('/fill-the-box')}>
              ← Keep editing
            </button>
          </>
        }
      />
    </>
  );
}
