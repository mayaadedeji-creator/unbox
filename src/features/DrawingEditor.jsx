import DrawingCanvas from './DrawingCanvas.jsx';
import { crayonColors } from './helpers.js';

export default function DrawingEditor({ value, onChange }) {
  return (
    <DrawingCanvas
      value={value.image}
      onChange={(image) => onChange({ image })}
      colors={crayonColors()}
    />
  );
}
