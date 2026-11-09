import { useState } from 'react';
import './BoxContents.css';

// Where each gift sits in the open box, in the order they're added: x is the middle of
// the gift and y is its base, both as a share of the box's square; r is a little tilt.
// Each base is a little below the box's front rim there, so the bottom of the gift is
// hidden inside the box. Later gifts sit further back, showing a bit more of themselves.
const SPOTS = [
  { x: 48, y: 69, r: -6 },
  { x: 31, y: 64, r: 9 },
  { x: 64, y: 61, r: -10 },
  { x: 40, y: 60, r: 5 },
  { x: 56, y: 57, r: -7 },
  { x: 24, y: 57, r: 12 },
  { x: 71, y: 54, r: -12 },
  { x: 47, y: 53, r: 4 },
  { x: 35, y: 52, r: -9 },
  { x: 61, y: 50, r: 8 },
];

// The gifts that are in the open box, sticking up out of it. Goes inside BoxDisplay's
// square frame.
//   gifts   — [{ id, name, image }] in the order they were added
//   onPick  — optional; makes each gift a button you can tap (for unboxing)
//   isNew   — optional (gift) => true for gifts not opened yet; they get a pink dot
//   popUp   — the gifts rise up out of the box one after another (when it's just opened)
//   sink    — the gifts sink down into the box one after another (when it's being closed)
// Without popUp, gifts added after the box first appears drop in from above.
export default function BoxContents({ gifts, onPick, isNew, popUp = false, sink = false }) {
  // Gifts that were already in the box when it first showed up don't drop in
  const [startingIds] = useState(() => new Set(gifts.map((g) => g.id)));

  return (
    <div
      className={`box-contents${popUp ? ' is-popping' : ''}${sink ? ' is-sinking' : ''}`}
      aria-hidden={onPick ? undefined : true}
    >
      {gifts.slice(0, SPOTS.length).map((gift, i) => {
        const spot = SPOTS[i];
        const unopened = isNew?.(gift);
        const style = {
          '--x': `${spot.x}%`,
          '--y': `${spot.y}%`,
          '--r': `${spot.r}deg`,
          '--order': i,
          // Front gifts (lower base) cover the ones behind them
          zIndex: Math.round(spot.y),
        };
        const dropping = !popUp && !startingIds.has(gift.id);
        const className = `box-content${dropping ? ' is-new' : ''}${unopened ? ' is-unopened' : ''}`;

        if (!onPick) {
          return (
            <span key={gift.id} className={className} style={style}>
              <img src={gift.image} alt="" />
            </span>
          );
        }
        return (
          <button
            key={gift.id}
            className={`${className} is-pickable`}
            style={style}
            onClick={() => onPick(gift)}
            aria-label={unopened ? `${gift.name} (not opened yet)` : gift.name}
          >
            <img src={gift.image} alt="" />
            {unopened && <span className="box-content-dot" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
