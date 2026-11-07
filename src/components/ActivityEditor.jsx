import { useState } from 'react';
import RoomOverlay from './RoomOverlay.jsx';
import { getFeature } from '../features';

// One gift activity brought forward over the room. It holds a draft of the
// activity's data; nothing goes in the box until "Add to box".
export default function ActivityEditor({ item, existing, onSave, onRemove, onClose }) {
  const feature = getFeature(item.id);
  const Editor = feature.Editor;
  const [draft, setDraft] = useState(existing?.data ?? feature.initialData);
  const [error, setError] = useState('');

  const save = () => {
    if (!feature.isComplete(draft)) {
      setError('Add something before it goes in the box');
      return;
    }
    onSave(draft);
  };

  const change = (value) => {
    setError('');
    setDraft(value);
  };

  return (
    <RoomOverlay
      label={item.name}
      onClose={onClose}
      error={error}
      heading={
        <h2 className="activity-heading">
          <img src={item.image} alt="" />
          {item.name}
        </h2>
      }
      actions={
        <>
          <button className="room-button" onClick={save}>
            {existing ? 'Save changes' : 'Add to box'}
          </button>
          {existing && (
            <button className="room-text-button" onClick={onRemove}>
              Take it out of the box
            </button>
          )}
        </>
      }
    >
      <div className="activity">
        <Editor value={draft} onChange={change} />
      </div>
    </RoomOverlay>
  );
}
