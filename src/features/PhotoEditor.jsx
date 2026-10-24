import { useState } from 'react';

const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const MAX_MB = 10;

export default function PhotoEditor({ value, onChange }) {
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG or PNG images, please.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`That image is too big — keep it under ${MAX_MB} MB.`);
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => onChange({ image: reader.result, name: file.name });
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="feature-stack">
      <label
        className={`photo-drop${dragging ? ' is-dragging' : ''}${value.image ? ' has-image' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {value.image ? (
          <img src={value.image} alt="Your uploaded photo" />
        ) : (
          <span>
            <strong>Click to choose a photo</strong>
            <br />
            or drag one here (JPG or PNG)
          </span>
        )}
      </label>
      {value.image && <span className="feature-hint">Click the photo to swap it for another.</span>}
      {error && <span className="feature-error">{error}</span>}
    </div>
  );
}
