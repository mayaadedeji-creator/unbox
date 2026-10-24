import { useEffect, useState } from 'react';
import { fetchAffirmation } from './affirmations.js';
import { AffirmationCard, AffirmationCredit } from './AffirmationCard.jsx';

export default function AffirmationEditor({ value, onChange }) {
  const [loading, setLoading] = useState(!value.text);

  // Pull one in automatically the first time the modal opens. The short delay means
  // React's dev-mode double-run cancels the first call before it's sent, so we don't
  // waste any of the API's 50 free calls a day.
  useEffect(() => {
    if (value.text) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchAffirmation(controller.signal)
        .then((affirmation) => {
          onChange(affirmation);
          setLoading(false);
        })
        .catch(() => {});
    }, 50);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const another = async () => {
    setLoading(true);
    onChange(await fetchAffirmation());
    setLoading(false);
  };

  return (
    <div className="feature-stack">
      <span className="feature-hint">Shuffle until you find the one that feels like them.</span>
      <AffirmationCard value={value} loading={loading} />
      <button type="button" className="feature-button secondary" onClick={another} disabled={loading}>
        ↻ Shuffle
      </button>
      <AffirmationCredit source={value.source} />
    </div>
  );
}
