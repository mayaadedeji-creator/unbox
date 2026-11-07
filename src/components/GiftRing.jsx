import './GiftRing.css';

// A square stage with something in the middle (the box) and gifts on a slowly
// turning ring around it. Used to fill the box and to unbox it.
//   gifts    — [{ id, name, image }]
//   onPick   — called with the gift that was tapped
//   badge    — optional (gift) => 'check' | 'dot' | null, for a marker on a gift
//   burst    — gifts fly out from the middle when the ring first appears
export default function GiftRing({ gifts, onPick, badge, burst = false, label, children }) {
  return (
    <div className={`ring-stage${gifts.length > 0 ? ' has-ring' : ''}`}>
      <div className="ring-center">{children}</div>

      {gifts.length > 0 && (
        <ul className={`orbit${burst ? ' is-burst' : ''}`} aria-label={label}>
          {gifts.map((gift, i) => {
            const mark = badge?.(gift);
            return (
              <li
                key={gift.id}
                className="orbit-slot"
                style={{
                  '--angle': `${(360 / gifts.length) * i}deg`,
                  '--delay': `${i * 90}ms`,
                }}
              >
                <div className="orbit-upright">
                  <button
                    className={`orbit-gift${mark ? ` has-${mark}` : ''}`}
                    onClick={() => onPick(gift)}
                    aria-label={
                      mark === 'check' ? `${gift.name} (in your box)` :
                      mark === 'dot' ? `${gift.name} (not opened yet)` : gift.name
                    }
                  >
                    <img src={gift.image} alt="" />
                    {mark && (
                      <span className={`orbit-badge is-${mark}`} aria-hidden="true">
                        {mark === 'check' ? '✓' : ''}
                      </span>
                    )}
                  </button>
                  <span className="orbit-name" aria-hidden="true">
                    {gift.name}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
