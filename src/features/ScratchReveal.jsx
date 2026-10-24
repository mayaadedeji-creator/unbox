import { useEffect, useRef, useState } from 'react';

const WIDTH = 480;
const HEIGHT = 360;
const BRUSH = 24;
const REVEAL_AT = 0.55; // fraction scratched before the rest clears itself

// The receiver's side: a silver coating over `children` that scratches away under the pointer.
export default function ScratchReveal({ children }) {
  const canvasRef = useRef(null);
  const scratching = useRef(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    gradient.addColorStop(0, '#c9c9d1');
    gradient.addColorStop(0.5, '#eeeef2');
    gradient.addColorStop(1, '#b4b4bf');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#6b6375';
    ctx.font = '600 28px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch to reveal ✦', WIDTH / 2, HEIGHT / 2);
  }, []);

  const scratch = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * WIDTH) / rect.width;
    const y = ((e.clientY - rect.top) * HEIGHT) / rect.height;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, BRUSH, 0, Math.PI * 2);
    ctx.fill();
  };

  const checkProgress = () => {
    scratching.current = false;
    const { data } = canvasRef.current.getContext('2d').getImageData(0, 0, WIDTH, HEIGHT);
    let cleared = 0;
    // Sample every 16th pixel's alpha — plenty accurate and cheap.
    for (let i = 3; i < data.length; i += 64) {
      if (data[i] === 0) cleared++;
    }
    if (cleared / (data.length / 64) > REVEAL_AT) setRevealed(true);
  };

  return (
    <div className="scratch-card">
      <div className="scratch-content">{children}</div>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className={`scratch-coating${revealed ? ' is-revealed' : ''}`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          scratching.current = true;
          scratch(e);
        }}
        onPointerMove={(e) => scratching.current && scratch(e)}
        onPointerUp={checkProgress}
        onPointerCancel={checkProgress}
      />
    </div>
  );
}
