import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePackage } from '../context/PackageContext';

import BoxDisplay from '../components/BoxDisplay.jsx';
import FeatureModal from '../components/FeatureModal.jsx';
import SenderSteps from '../components/SenderSteps.jsx';
import { catalog } from '../features/catalog.js';



export default function FillTheBoxPage() {
  const navigate = useNavigate();
  const { items, saveItem, removeItem, to, from } = usePackage();
  const [activeItem, setActiveItem] = useState(null);

  const existing = activeItem && items.find((i) => i.id === activeItem.id);
  const closeModal = () => setActiveItem(null);

  return (
    <>
      <div className="in-box-1">
        <SenderSteps step={2} title="Fill your box" subtitle="Pick anything from the shelf to add it." />
      </div>

      <div className="in-box-2">
      <BoxDisplay state="open" label={{ to, from }} />
    <button className="page-button" disabled={items.length === 0} onClick={() => navigate('/preview')}>
      Preview your gift →
  </button>
</div>


      <div className="in-box-3">
        <div className="item-list">
          {catalog.map((item) => {
            const inBox = items.some((i) => i.id === item.id);
            return (
            <button
              key={item.id}
              className={`item-card${inBox ? ' is-in-box' : ''}`}
              onClick={() => setActiveItem(item)}
              aria-label={inBox ? `${item.name} (in your box)` : item.name}
            >
              {inBox && <span className="item-check" aria-hidden="true">✓</span>}
              <div className="item-thumb">
                <img src={item.image} alt="" />
              </div>
              <span className="item-name">{item.name}</span>
            </button>
            );
          })}
        </div>
      </div>

      {activeItem && (
        <FeatureModal
          key={activeItem.id}
          item={activeItem}
          existing={existing}
          onSave={(data) => {
            saveItem({ ...activeItem, data });
            closeModal();
          }}
          onRemove={() => {
            removeItem(activeItem.id);
            closeModal();
          }}
          onClose={closeModal}
        />
      )}
    </>
  );
}
