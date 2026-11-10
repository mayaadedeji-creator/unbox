import { useEffect, useRef, useState } from 'react';
import { cssVar } from './helpers.js';

// Internal resolution; the canvas is scaled to fit the modal with CSS.
const WIDTH = 480;
const HEIGHT = 360;
const SIZES = { Thin: 3, Thick: 10 };
// The eraser is wider than the pen at the same size, so it's easier to clean up with.
const ERASER_SCALE = 2.5;

// Shared by the Drawing and Scratch Off features.
// value is a PNG data URL (or null when blank).
// colors is a list of { name, value }.
export default function DrawingCanvas({ value, onChange, colors }) {
  const canvasRef = useRef(null);
  const lastPoint = useRef(null);
  const [color, setColor] = useState(colors[0].value);
  const [erasing, setErasing] = useState(false);
  const [size, setSize] = useState(SIZES.Thin);

  const paintBlank = (ctx) => {
    ctx.fillStyle = cssVar('--color-paper');
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  };

  // Restore a saved drawing when the modal is reopened.
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    paintBlank(ctx);
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toCanvasPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * WIDTH) / rect.width,
      y: ((e.clientY - rect.top) * HEIGHT) / rect.height,
    };
  };

  const strokeTo = (point) => {
    const ctx = canvasRef.current.getContext('2d');
    const from = lastPoint.current ?? point;
    // Erasing paints the paper color back on, so the saved picture stays a plain PNG.
    ctx.strokeStyle = erasing ? cssVar('--color-paper') : color;
    ctx.lineWidth = erasing ? size * ERASER_SCALE : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint.current = point;
  };

  const handleDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    lastPoint.current = null;
    strokeTo(toCanvasPoint(e));
  };

  const handleMove = (e) => {
    if (lastPoint.current) strokeTo(toCanvasPoint(e));
  };

  const handleUp = () => {
    if (!lastPoint.current) return;
    lastPoint.current = null;
    onChange(canvasRef.current.toDataURL('image/png'));
  };

  const clear = () => {
    paintBlank(canvasRef.current.getContext('2d'));
    onChange(null);
  };

  return (
    <div className="feature-stack">
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className={`drawing-canvas${erasing ? ' is-erasing' : ''}`}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      />
      <div className="drawing-colors">
        {colors.map((c) => (
          <button
            key={c.value}
            type="button"
            className={`drawing-swatch${!erasing && c.value === color ? ' is-active' : ''}`}
            style={{ backgroundColor: c.value }}
            onClick={() => {
              setColor(c.value);
              setErasing(false);
            }}
            aria-label={c.name}
            aria-pressed={!erasing && c.value === color}
          />
        ))}
      </div>
      <div className="drawing-tools">
        {Object.entries(SIZES).map(([label, px]) => (
          <button
            key={label}
            type="button"
            className={`drawing-size${px === size ? ' is-active' : ''}`}
            onClick={() => setSize(px)}
          >
            {label}
          </button>
        ))}
        <span className="drawing-divider" />
        <button
          type="button"
          className={`drawing-size drawing-eraser${erasing ? ' is-active' : ''}`}
          onClick={() => setErasing(true)}
          aria-pressed={erasing}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15.5 3.5 21 9l-9.5 9.5H6L3 15.5z" />
            <path d="M9.5 9.5 15 15M6 18.5h14" />
          </svg>
          Eraser
        </button>
        <button type="button" className="drawing-clear" onClick={clear}>
          Clear
        </button>
      </div>
    </div>
  );
}
