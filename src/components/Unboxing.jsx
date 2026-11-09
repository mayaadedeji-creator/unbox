import { useState } from 'react';
import BoxDisplay from './BoxDisplay.jsx';
import BoxContents from './BoxContents.jsx';
import RoomOverlay from './RoomOverlay.jsx';
import { getFeature } from '../features';
import './Unboxing.css';

// How long the unwrapping animation takes (see .gift-wrap.is-unwrap in GiftWrap.css)
const UNWRAP_MS = 1900;

// The closed box → open box → open each gift experience, in the room.
// Used by the maker's preview and by the recipient's gift page; the page decides
// whether opening is remembered (opened/seen + callbacks) and what buttons show (actions).
// The box is the same size and spot as on the fill page. One tap opens it, and the gifts
// stand up inside it to be tapped.
//   wrapped — the box starts gift-wrapped and the tap unwraps it first (the recipient's
//             page). The maker's preview leaves it as a plain closed box.
export default function Unboxing({ gift, opened, onOpen, seen, onSee, actions, wrapped = true }) {
  const { to, from, items } = gift;
  const [viewing, setViewing] = useState(null);
  // Only pop the gifts up when the box is opened right now, not when coming back to it.
  const [justOpened, setJustOpened] = useState(false);
  // True while the wrapping comes off, just before the box opens
  const [unwrapping, setUnwrapping] = useState(false);

  const isEmpty = items.length === 0;
  const Viewer = viewing && getFeature(viewing.id).Viewer;

  // Tapping the box opens it and the gifts pop up. If it's wrapped, it unwraps first.
  const open = () => {
    if (unwrapping) return;
    if (!wrapped) {
      setJustOpened(true);
      onOpen();
      return;
    }
    setUnwrapping(true);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      setUnwrapping(false);
      setJustOpened(true);
      onOpen();
    }, reduceMotion ? 200 : UNWRAP_MS);
  };

  const view = (item) => {
    setViewing(item);
    onSee(item.id);
  };

  let hint;
  if (isEmpty) hint = 'This box is empty.';
  else if (unwrapping) hint = 'Unwrapping…';
  else if (!opened) hint = wrapped ? 'Tap the gift to unwrap it' : 'Tap the box to open it';
  else if (seen.size < items.length) hint = `Tap a gift to open it (${items.length - seen.size} to go)`;
  else hint = "You've opened everything 💌";

  return (
    <>
      <div className="unbox-stage">
        {opened ? (
          <div className="unbox-box is-open">
            <BoxDisplay state="open" label={{ to, from }}>
              <BoxContents
                gifts={items}
                onPick={view}
                isNew={(item) => !seen.has(item.id)}
                popUp={justOpened}
              />
            </BoxDisplay>
          </div>
        ) : (
          <button
            className={`unbox-box is-closed${unwrapping ? ' is-unwrapping' : ''}`}
            onClick={open}
            disabled={isEmpty}
            aria-label={wrapped ? 'Unwrap the gift' : 'Open the box'}
          >
            <BoxDisplay
              state="closed"
              wrapped={wrapped}
              wrapMode={unwrapping ? 'unwrap' : 'still'}
              label={{ to, from }}
            />
          </button>
        )}
      </div>

      {/* A handwritten note on the wall, like on the fill page */}
      <p className="unbox-note" role="status">
        {hint}
      </p>

      {actions && <div className="unbox-actions">{actions}</div>}

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
