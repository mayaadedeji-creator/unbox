import { useNavigate } from 'react-router-dom';
import { usePackage } from '../context/PackageContext';
import './HomePage.css';

// The homepage, reached by clicking the "unbox" wordmark. Mostly blank for now (what
// goes here is still being decided); it just has the way into making a gift.
// The site's main address still goes straight to making a gift; this page is extra.
// If a gift is already in progress, it offers to carry on with it so nothing is lost.
export default function HomePage() {
  const navigate = useNavigate();
  const { to, from, items, reset } = usePackage();
  const inProgress = Boolean(to.trim() || from.trim() || items.length);

  const startNew = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="home">
      <h1 className="sr-only">unbox</h1>

      {inProgress ? (
        <>
          <button
            className="home-start"
            onClick={() => navigate(items.length ? '/fill-the-box' : '/')}
          >
            Continue your gift
            <Arrow />
          </button>
          <button className="home-new" onClick={startNew}>
            or start a new one
          </button>
        </>
      ) : (
        <button className="home-start" onClick={startNew}>
          Make a gift
          <Arrow />
        </button>
      )}
    </div>
  );
}

// The same hand-drawn arrow as "Now fill the box" and "Wrap it up"
function Arrow() {
  return (
    <svg viewBox="0 0 80 40" aria-hidden="true">
      <path d="M4 10 C 22 4, 40 30, 66 26" />
      <path d="M56 17 L 67 26 L 55 33" />
    </svg>
  );
}
