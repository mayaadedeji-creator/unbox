import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePackage } from '../context/PackageContext';
import BoxDisplay from '../components/BoxDisplay.jsx';
import BoxContents from '../components/BoxContents.jsx';
import ActivityEditor from '../components/ActivityEditor.jsx';
import GiftShelf from '../components/GiftShelf.jsx';
import { catalog } from '../features/catalog.js';
import './FillTheBoxPage.css';

// "Close it up": when the box shuts and when the preview opens (ms), matching the
// animations in FillTheBoxPage.css and BoxContents.css
const CLOSE_TIMING = { shut: 550, leave: 1210 };

// The order the gifts sit on the shelves (5 per shelf). Letter and Map Pin are on the
// second shelf so each shelf has an easter egg.
const SHELF_ORDER = [
  'scratch-off', 'song', 'photo', 'voice-memo', 'affirmation',
  'letter', 'why', 'drawing', 'map-pin', 'recommendation',
];
const shelfGifts = SHELF_ORDER.map((id) => catalog.find((g) => g.id === id)).filter(Boolean);

// Easter eggs: click the shelf board right under one of these gifts.
// (Map Pin and Letter are both on the second shelf for now, to pick one.)
const EGGS = { photo: 'fall', 'map-pin': 'pin-drop', letter: 'airplane' };

// Step 2: the open box low in the room, with the gifts waiting on shelves on the wall.
// Tap a gift to bring it forward and make it; "Add to box" drops it in.
export default function FillTheBoxPage() {
  const navigate = useNavigate();
  const { items, saveItem, removeItem, to, from } = usePackage();
  const [activeItem, setActiveItem] = useState(null);
  // Closing up on the way to the preview: 'sinking' (gifts go down into the box and the
  // room fades), then 'closed' (the box shuts with a bounce), then the preview opens.
  const [closing, setClosing] = useState(null);
  const leaving = closing ? ' is-leaving' : '';

  const closeItUp = () => {
    if (closing) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      navigate('/preview');
      return;
    }
    setClosing('sinking');
    setTimeout(() => setClosing('closed'), CLOSE_TIMING.shut);
    setTimeout(() => navigate('/preview'), CLOSE_TIMING.leave);
  };

  const existing = activeItem && items.find((i) => i.id === activeItem.id);
  const closeActivity = () => setActiveItem(null);
  // The gifts already added, with their icons, in the order they went in
  const inTheBox = items.map((it) => catalog.find((g) => g.id === it.id)).filter(Boolean);

  return (
    <>
      <h1 className="sr-only">Step 2 of 4: Fill your box</h1>

      <button className={`room-back${leaving}`} onClick={() => navigate('/')}>
        ← Label
      </button>

      <GiftShelf
        className={leaving.trim()}
        gifts={shelfGifts}
        eggs={EGGS}
        onPick={setActiveItem}
        isInBox={(gift) => items.some((it) => it.id === gift.id)}
        label="Gifts you can add"
      />

      <div className={`fill-stage${closing === 'closed' ? ' is-shut' : ''}`}>
        {/* When it shuts, the closed box fades in underneath while the open one fades
            out on top, so the flaps melt shut instead of snapping */}
        {closing === 'closed' && (
          <div key="closed" className="fill-box-layer is-fading-in">
            <BoxDisplay state="closed" label={{ to, from }} />
          </div>
        )}
        <div key="open" className={`fill-box-layer${closing === 'closed' ? ' is-fading-out' : ''}`}>
          <BoxDisplay state="open" label={{ to, from }}>
            <BoxContents gifts={inTheBox} sink={closing !== null} />
          </BoxDisplay>
        </div>
      </div>

      {/* A handwritten note on the wall, in the corner */}
      <p className={`fill-note${leaving}`}>Tap a gift to add it to your box</p>

      <div className={`room-actions fill-actions${leaving}`}>
        {items.length > 0 && (
          <button className="room-button" onClick={closeItUp}>
            Close it up →
          </button>
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
