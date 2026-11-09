import { useEffect, useRef, useState } from 'react';
import './GiftShelf.css';

// The icon drawings don't all reach the bottom of their square, so each one is nudged
// down by its empty space (as a share of the icon's height) to sit right on the shelf.
const EMPTY_BELOW = {
  letter: 0.26,
  song: 0.2,
  photo: 0.2,
  'map-pin': 0.15,
  affirmation: 0.16,
  'scratch-off': 0.16,
  'voice-memo': 0.2,
  drawing: 0.16,
  why: 0.19,
  recommendation: 0.15,
};

// How long each easter egg runs (ms), matching the animations in GiftShelf.css
const EGG_LENGTH = { fall: 3400, 'pin-drop': 1800, airplane: 4000 };

// How long the mouse has to rest on an easter egg gift before its scene plays (ms)
const LINGER_MS = 1500;

// Gifts sitting on wooden shelves on the wall, waiting to be picked.
//   gifts     — [{ id, name, image }]
//   onPick    — called with the gift that was tapped
//   isInBox   — optional (gift) => true if it's already in the box (it shows faded)
//   perShelf  — how many gifts fit on one shelf
//   eggs      — optional { [gift id]: 'fall' | 'pin-drop' | 'airplane' }. Easter eggs:
//               resting the mouse on that gift for a moment (or clicking the shelf board
//               right under it) plays a little scene.
export default function GiftShelf({ gifts, onPick, isInBox, label, perShelf = 5, eggs = {}, className = '' }) {
  const [playing, setPlaying] = useState(null); // id of the gift whose egg is running
  const hoverTimer = useRef(null);

  const play = (id) => setPlaying((current) => current ?? id);

  // Resting the mouse on an egg gift for a moment plays its scene (once per hover).
  // Phones and tablets don't hover, so this only happens with a mouse or trackpad.
  const startLinger = (e, id) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => play(id), LINGER_MS);
  };
  const stopLinger = () => clearTimeout(hoverTimer.current);
  useEffect(() => stopLinger, []);

  // Put the gift back to normal once its scene is over
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setPlaying(null), EGG_LENGTH[eggs[playing]] ?? 4000);
    return () => clearTimeout(timer);
  }, [playing, eggs]);

  const shelves = [];
  for (let i = 0; i < gifts.length; i += perShelf) shelves.push(gifts.slice(i, i + perShelf));

  return (
    <div className={`shelves ${className}`.trim()} role="group" aria-label={label}>
      {shelves.map((row, s) => (
        <ul key={s} className="shelf">
          {row.map((gift, i) => {
            const inBox = !!isInBox?.(gift);
            const n = s * perShelf + i;
            const egg = eggs[gift.id];
            const isPlaying = playing === gift.id;
            return (
              <li
                key={gift.id}
                className={`shelf-slot${isPlaying ? ` is-egg-${egg}` : ''}`}
                style={{
                  '--empty-below': EMPTY_BELOW[gift.id] ?? 0.18,
                  // Each gift sways on its own rhythm and starts at a different point,
                  // so they never rock together
                  '--sway-time': `${4 + (n % 3) * 0.7}s`,
                  '--sway-delay': `${-n * 1.3}s`,
                }}
              >
                <button
                  className={`shelf-gift${inBox ? ' is-in-box' : ''}`}
                  onClick={() => {
                    stopLinger();
                    onPick(gift);
                  }}
                  onPointerEnter={egg ? (e) => startLinger(e, gift.id) : undefined}
                  onPointerLeave={egg ? stopLinger : undefined}
                  aria-label={inBox ? `${gift.name} (in your box)` : gift.name}
                >
                  <img src={gift.image} alt="" />
                </button>
                <span className="shelf-name" aria-hidden="true">
                  {gift.name}
                </span>

                {egg && (
                  <>
                    {/* The hidden trigger: the strip of board under the gift. Left out of
                        the keyboard order and screen readers since it's just for fun. */}
                    <span
                      className="shelf-spot"
                      aria-hidden="true"
                      onClick={() => play(gift.id)}
                    />
                    {egg === 'fall' && (
                      <span className="egg-oops" aria-hidden="true">
                        oops!
                      </span>
                    )}
                    {egg === 'pin-drop' && <span className="egg-ripple" aria-hidden="true" />}
                    {egg === 'airplane' && (
                      <svg className="egg-plane" viewBox="0 0 48 32" aria-hidden="true">
                        <path d="M2 16 L46 2 L30 30 L22 19 Z" />
                        <path d="M46 2 L22 19" />
                        <path d="M22 19 L20 28 L26 22" />
                      </svg>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}
