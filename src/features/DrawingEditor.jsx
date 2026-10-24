import DrawingCanvas from './DrawingCanvas.jsx';
import { DRAWING_COLORS } from './helpers.js';

export default function DrawingEditor({ value, onChange }) {
  return (
    <DrawingCanvas
      value={value.image}
      onChange={(image) => onChange({ image })}
      colors={DRAWING_COLORS}
    />
  );
}
