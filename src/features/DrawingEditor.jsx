import DrawingCanvas from './DrawingCanvas.jsx';
import { drawingColors } from './helpers.js';

export default function DrawingEditor({ value, onChange }) {
  return (
    <DrawingCanvas
      value={value.image}
      onChange={(image) => onChange({ image })}
      colors={drawingColors()}
    />
  );
}
