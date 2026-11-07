import { useState } from 'react';
import BoxDisplay from './BoxDisplay.jsx';
import GiftRing from './GiftRing.jsx';
import RoomOverlay from './RoomOverlay.jsx';
import { getFeature } from '../features';
import './Unboxing.css';

// The closed box → open box → open each gift experience, in the room.
// Used by the maker's preview and by the recipient's gift page; the page decides
// whether opening is remembered (opened/seen + callbacks) and what buttons show (actions).
export default function Unboxing({ gift, opened, onOpen, seen, onSee, actions }) {
  const { to, from, items } = gift;
  const [viewing, setViewing] = useState(null);
  // Only fly the gifts out when the box is opened right now, not when coming back to it.
  const [justOpened, setJustOpened] = useState(false);

  const isEmpty = items.length === 0;
  const Viewer = viewing && getFeature(viewing.id).Viewer;

  const open = () => {
    setJustOpened(true);
    onOpen();
  };

  const view = (item) => {
    setViewing(item);
    onSee(item.id);
  };

  let hint;
  if (isEmpty) hint = 'This box is empty.';
  else if (!opened) hint = 'Tap the box to open it';
  else if (seen.size < items.length) hint = `${items.length - seen.size} left to open`;
  else hint = "You've opened everything 💌";

  return (
    <>
      <GiftRing
        gifts={opened ? items : []}
        onPick={view}
        badge={(item) => (seen.has(item.id) ? null : 'dot')}
        burst={justOpened}
        label="Gifts in the box"
      >
        {opened ? (
          <div className="unbox-box is-open">
            <BoxDisplay state="open" label={{ to, from }} />
          </div>
        ) : (
          <button
            className="unbox-box is-closed"
            onClick={open}
            disabled={isEmpty}
            aria-label="Open the box"
          >
            <BoxDisplay state="closed" label={{ to, from }} />
          </button>
        )}
      </GiftRing>

      <div className="room-actions">
        <p className="room-hint">{hint}</p>
        {actions}
      </div>

      {viewing && (
        <RoomOverlay
          label={viewing.name}
          onClose={() => setViewing(null)}
          heading={
            <h2 className="activity-heading">
              <img src={viewing.image} alt="" />
              {viewing.name}
            </h2>
          }
          actions={
            <button className="room-button" onClick={() => setViewing(null)}>
              Back to the box
            </button>
          }
        >
          <div className="activity">
            <Viewer value={viewing.data} />
          </div>
        </RoomOverlay>
      )}
    </>
  );
}
