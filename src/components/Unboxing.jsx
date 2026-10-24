import { useState } from 'react';
import BoxDisplay from './BoxDisplay.jsx';
import Modal from './Modal.jsx';
import { getFeature } from '../features';
import './Unboxing.css';

// The closed box → open box → open each item experience.
// Used by the maker's preview and by the recipient's gift page; the page decides
// whether opening is remembered (opened/seen + callbacks) and what buttons show (actions).
export default function Unboxing({ gift, opened, onOpen, seen, onSee, actions }) {
  const { to, from, items } = gift;
  const [viewing, setViewing] = useState(null);

  const isEmpty = items.length === 0;
  const Viewer = viewing && getFeature(viewing.id).Viewer;

  const view = (item) => {
    setViewing(item);
    onSee(item.id);
  };

  let hint;
  if (isEmpty) hint = 'This box is empty.';
  else if (!opened) hint = 'Tap the box to open it';
  else if (seen.size < items.length) hint = `${items.length - seen.size} left to open`;
  else hint = "You've opened everything 💌";

  return (
    <>
      <div className="in-box-2 arrival-stage">
        {opened ? (
          <div className="arrival-box is-open">
            <BoxDisplay state="open" label={{ to, from }} />
          </div>
        ) : (
          <button
            className="arrival-box is-closed"
            onClick={onOpen}
            disabled={isEmpty}
            aria-label="Open the box"
          >
            <BoxDisplay state="closed" label={{ to, from }} />
          </button>
        )}
        <p className="arrival-hint">{hint}</p>
      </div>

      <div className="in-box-3">
        {opened && (
          <div className="item-list">
            {items.map((item, index) => (
              <button
                key={item.id}
                className={`item-card arrival-item${seen.has(item.id) ? ' is-seen' : ''}`}
                style={{ animationDelay: `${index * 90}ms` }}
                onClick={() => view(item)}
              >
                <div className="item-thumb">
                  <img src={item.image} alt="" />
                </div>
                <span className="item-name">{item.name}</span>
              </button>
            ))}
          </div>
        )}
        {actions && <div className="unboxing-actions">{actions}</div>}
      </div>

      {viewing && (
        <Modal title={viewing.name} icon={viewing.image} onClose={() => setViewing(null)}>
          <Viewer value={viewing.data} />
        </Modal>
      )}
    </>
  );
}
