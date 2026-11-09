import './GiftWrap.css';

// Wrapping paper, ribbon and a bow drawn over closed-box.svg.
// Points are in the box image's own 1500×1500 space, measured from the drawing:
//   top face T(669,252) R(1209,556) N(669,862) L(129,556); the sides drop 425 to the floor.
// The ribbon crosses the middle of each side and meets in the middle of the lid.
const pts = (list) => list.map((p) => p.join(',')).join(' ');

const FACES = {
  top: [[669, 252], [1209, 556], [669, 862], [129, 556]],
  left: [[129, 556], [669, 862], [669, 1287], [129, 981]],
  right: [[669, 862], [1209, 556], [1209, 981], [669, 1287]],
};

// Each band: a strip down one side, then across the lid to the far edge.
const RIBBON = [
  { side: [[360, 687], [438, 731], [438, 1156], [360, 1112]], lid: [[360, 687], [438, 731], [978, 426], [900, 382]] },
  { side: [[900, 731], [978, 687], [978, 1112], [900, 1156]], lid: [[900, 731], [978, 687], [438, 382], [360, 426]] },
];

// mode:
//   'wrap'   — wraps itself up in front of you (the share page)
//   'still'  — already wrapped, no animation (the recipient's box, waiting to be opened)
//   'unwrap' — comes off: the bow flies away, the ribbon rolls back, the paper falls away
export default function GiftWrap({ mode = 'wrap' }) {
  return (
    <svg className={`gift-wrap is-${mode}`} viewBox="0 0 1500 1500" aria-hidden="true">
      {/* Paper: plain, shaded per side. Lid first, then the two sides */}
      {Object.entries(FACES).map(([face, points], i) => (
        <g key={face} className="wrap-piece wrap-paper" style={{ '--step': i }}>
          <polygon points={pts(points)} className={`wrap-face is-${face}`} />
        </g>
      ))}

      {/* Ribbon: down each side, then across the lid */}
      {RIBBON.map((band, i) => (
        <g key={i}>
          <polygon points={pts(band.side)} className="wrap-piece wrap-ribbon is-side" style={{ '--step': 3 + i * 2 }} />
          <polygon points={pts(band.lid)} className="wrap-piece wrap-ribbon" style={{ '--step': 4 + i * 2 }} />
        </g>
      ))}

      {/* Bow, sitting on the middle of the lid */}
      <g className="wrap-bow">
        <path d="M640 560 L560 700 L610 690 L630 740 Z" className="wrap-ribbon" />
        <path d="M698 560 L790 690 L740 688 L728 740 Z" className="wrap-ribbon" />
        <ellipse cx="560" cy="500" rx="125" ry="72" transform="rotate(-24 560 500)" className="wrap-loop" />
        <ellipse cx="778" cy="500" rx="125" ry="72" transform="rotate(24 778 500)" className="wrap-loop" />
        <circle cx="669" cy="540" r="44" className="wrap-knot" />
      </g>
    </svg>
  );
}
