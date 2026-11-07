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
// square frame. Gifts added after the box first appears drop in from above.
//   gifts — [{ id, image }] in the order they were added
export default function BoxContents({ gifts }) {
  // Gifts that were already in the box when it first showed up don't animate in
  const [startingIds] = useState(() => new Set(gifts.map((g) => g.id)));

  return (
    <div className="box-contents" aria-hidden="true">
      {gifts.slice(0, SPOTS.length).map((gift, i) => {
        const spot = SPOTS[i];
        return (
          <span
            key={gift.id}
            className={`box-content${startingIds.has(gift.id) ? '' : ' is-new'}`}
            style={{
              '--x': `${spot.x}%`,
              '--y': `${spot.y}%`,
              '--r': `${spot.r}deg`,
              // Front gifts (lower base) cover the ones behind them
              zIndex: Math.round(spot.y),
            }}
          >
            <img src={gift.image} alt="" />
          </span>
        );
      })}
    </div>
  );
}
