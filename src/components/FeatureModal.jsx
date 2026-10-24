import { useState } from 'react';
import Modal from './Modal.jsx';
import { getFeature } from '../features';

// Opens when you click a feature in the inventory.
// It holds a draft of the feature's data; nothing goes in the box until "Add to box".
export default function FeatureModal({ item, existing, onSave, onRemove, onClose }) {
  const feature = getFeature(item.id);
  const Editor = feature.Editor;
  const [draft, setDraft] = useState(existing?.data ?? feature.initialData);

  return (
    <Modal
      title={item.name}
      icon={item.image}
      onClose={onClose}
      footer={
        <>
          {existing && (
            <button className="modal-text-button" onClick={onRemove}>
              Remove from box
            </button>
          )}
          <button
            className="modal-primary"
            disabled={!feature.isComplete(draft)}
            onClick={() => onSave(draft)}
          >
            {existing ? 'Save changes' : 'Add to box'}
          </button>
        </>
      }
    >
      <Editor value={draft} onChange={setDraft} />
    </Modal>
  );
}
