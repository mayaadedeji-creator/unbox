import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePackage } from '../context/PackageContext';
import BoxDisplay from '../components/BoxDisplay.jsx';
import ActivityEditor from '../components/ActivityEditor.jsx';
import GiftRing from '../components/GiftRing.jsx';
import { catalog } from '../features/catalog.js';

// Step 2: the open box in the middle of the room with every gift circling it.
// Tap a gift to bring it forward and make it; "Add to box" drops it in.
export default function FillTheBoxPage() {
  const navigate = useNavigate();
  const { items, saveItem, removeItem, to, from } = usePackage();
  const [activeItem, setActiveItem] = useState(null);

  const existing = activeItem && items.find((i) => i.id === activeItem.id);
  const closeActivity = () => setActiveItem(null);
  const count = items.length;

  return (
    <>
      <h1 className="sr-only">Step 2 of 4: Fill your box</h1>

      <button className="room-back" onClick={() => navigate('/')}>
        ← Label
      </button>

      <GiftRing
        gifts={catalog}
        onPick={setActiveItem}
        badge={(gift) => (items.some((it) => it.id === gift.id) ? 'check' : null)}
        label="Gifts you can add"
      >
        <BoxDisplay state="open" label={{ to, from }} />
      </GiftRing>

      <div className="room-actions">
        {count > 0 ? (
          <>
            <p className="room-hint">
              {count} {count === 1 ? 'thing' : 'things'} in your box
            </p>
            <button className="room-button" onClick={() => navigate('/preview')}>
              Close it up →
            </button>
          </>
        ) : (
          <p className="room-hint">Tap a gift to add it to your box</p>
        )}
      </div>

      {activeItem && (
        <ActivityEditor
          key={activeItem.id}
          item={activeItem}
          existing={existing}
          onSave={(data) => {
            saveItem({ ...activeItem, data });
            closeActivity();
          }}
          onRemove={() => {
            removeItem(activeItem.id);
            closeActivity();
          }}
          onClose={closeActivity}
        />
      )}
    </>
  );
}
