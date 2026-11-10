import { useEffect, useRef, useState } from 'react';
import { cssVar } from './helpers.js';

const WIDTH = 480;
const HEIGHT = 360;
const BRUSH = 22; // radius of the scratch, in canvas units
const REVEAL_AT = 0.55; // fraction scratched before the rest clears itself
const FLAKE_CHANCE = 0.06; // how often a scratch movement drops a little foil flake

// Draws the foil: a silver base with a soft shimmer in the app's colors, a sheen,
// fine grain, an inset edge and "Scratch me" pressed into the middle.
function paintFoil(ctx) {
  const foil = cssVar('--color-foil');
  const foilLight = cssVar('--color-foil-light');
  const foilDark = cssVar('--color-foil-dark');

  // Silver base
  const base = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  base.addColorStop(0, foilDark);
  base.addColorStop(0.3, foilLight);
  base.addColorStop(0.55, foil);
  base.addColorStop(0.8, foilLight);
  base.addColorStop(1, foilDark);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Shimmer: periwinkle and pink washed over the silver, like holographic foil
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  const shimmer = ctx.createLinearGradient(0, HEIGHT, WIDTH, 0);
  shimmer.addColorStop(0, cssVar('--color-secondary'));
  shimmer.addColorStop(0.35, cssVar('--color-pop-soft'));
  shimmer.addColorStop(0.65, cssVar('--color-secondary'));
  shimmer.addColorStop(1, cssVar('--color-pop'));
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = shimmer;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();

  // Sheen: two soft diagonal light bands
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (const [start, width] of [[0.18, 0.12], [0.58, 0.06]]) {
    const band = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    band.addColorStop(Math.max(0, start - width), 'rgba(255,255,255,0)');
    band.addColorStop(start, 'rgba(255,255,255,0.55)');
    band.addColorStop(Math.min(1, start + width), 'rgba(255,255,255,0)');
    ctx.fillStyle = band;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
  ctx.restore();

  // Grain, so it reads as a material rather than a flat fill
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,0.35)' : 'rgba(40,30,60,0.08)';
    ctx.fillRect(Math.random() * WIDTH, Math.random() * HEIGHT, 1, 1);
  }

  // Inset edge, like a pressed foil panel
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.roundRect(14, 14, WIDTH - 28, HEIGHT - 28, 12);
  ctx.stroke();
  ctx.restore();

  // "Scratch me" pressed into the foil: a white highlight just below, the navy text on top
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `600 30px ${cssVar('--font-handwriting')}`;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText('Scratch me', WIDTH / 2, HEIGHT / 2 + 2);
  ctx.fillStyle = cssVar('--color-primary');
  ctx.fillText('Scratch me', WIDTH / 2, HEIGHT / 2);
}

// The receiver's side: a foil coating over `children` that scratches away under the pointer.
export default function ScratchReveal({ children }) {
  const canvasRef = useRef(null);
  const flakesRef = useRef(null);
  const lastPoint = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Draw at the screen's real resolution so the foil is crisp, not blurry.
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = WIDTH * scale;
    canvas.height = HEIGHT * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    paintFoil(ctx);
  }, []);

  const toCanvasPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * WIDTH) / rect.width,
      y: ((e.clientY - rect.top) * HEIGHT) / rect.height,
      clientX: e.clientX - rect.left,
      clientY: e.clientY - rect.top,
    };
  };

  // A little foil flake that falls from where you're scratching.
  const dropFlake = (point) => {
    if (Math.random() > FLAKE_CHANCE || !flakesRef.current) return;
    const flake = document.createElement('span');
    flake.className = 'scratch-flake';
    flake.style.left = `${point.clientX}px`;
    flake.style.top = `${point.clientY}px`;
    flake.style.setProperty('--drift', `${(Math.random() - 0.5) * 60}px`);
    flake.style.setProperty('--spin', `${(Math.random() - 0.5) * 540}deg`);
    flake.addEventListener('animationend', () => flake.remove());
    flakesRef.current.appendChild(flake);
  };

  const scratchTo = (point) => {
    const ctx = canvasRef.current.getContext('2d');
    const from = lastPoint.current ?? point;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    // A continuous stroke, so fast swipes don't leave a trail of dots
    ctx.lineWidth = BRUSH * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    // A few specks around the edge so it looks scratched, not cut out
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = BRUSH + Math.random() * 6;
      ctx.beginPath();
      ctx.arc(point.x + Math.cos(angle) * dist, point.y + Math.sin(angle) * dist, 1 + Math.random() * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    lastPoint.current = point;
    dropFlake(point);
  };

  const finishStroke = () => {
    if (!lastPoint.current) return;
    lastPoint.current = null;
    const canvas = canvasRef.current;
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    // Sample every 16th pixel's alpha — plenty accurate and cheap.
    for (let i = 3; i < data.length; i += 64) {
      if (data[i] === 0) cleared++;
    }
    if (cleared / (data.length / 64) > REVEAL_AT) setRevealed(true);
  };

  return (
    <div className={`scratch-card${revealed ? ' is-revealed' : ''}`}>
      <div className="scratch-window">
        <div className="scratch-content">{children}</div>
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="scratch-coating"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            lastPoint.current = null;
            scratchTo(toCanvasPoint(e));
          }}
          onPointerMove={(e) => lastPoint.current && scratchTo(toCanvasPoint(e))}
          onPointerUp={finishStroke}
          onPointerCancel={finishStroke}
        />
      </div>
      <div className="scratch-flakes" ref={flakesRef} aria-hidden="true" />
    </div>
  );
}
