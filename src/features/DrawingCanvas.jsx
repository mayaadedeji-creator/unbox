import { useEffect, useRef, useState } from 'react';

// Internal resolution; the canvas is scaled to fit the modal with CSS.
const WIDTH = 480;
const HEIGHT = 360;
const SIZES = { Thin: 3, Thick: 10 };

// Shared by the Drawing and Scratch Off features.
// value is a PNG data URL (or null when blank).
export default function DrawingCanvas({ value, onChange, colors }) {
  const canvasRef = useRef(null);
  const lastPoint = useRef(null);
  const [color, setColor] = useState(colors[0]);
  const [size, setSize] = useState(SIZES.Thin);

  const paintBlank = (ctx) => {
    ctx.fillStyle = '#fff';
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
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
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
        className="drawing-canvas"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      />
      <div className="drawing-tools">
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            className={`drawing-swatch${c === color ? ' is-active' : ''}`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
            aria-label={`Color ${c}`}
          />
        ))}
        <span className="drawing-divider" />
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
        <button type="button" className="drawing-clear" onClick={clear}>
          Clear
        </button>
      </div>
    </div>
  );
}
