import './BoxDisplay.css';
import openBox from '../assets/box/open-box.svg';
import closedBox from '../assets/box/closed-box.svg';
import MailLabel from './MailLabel.jsx';

// label: optional { to, from } — shows the shipping label stuck on the side of the box.
export default function BoxDisplay({ state = 'open', label }) {
  const image = state === 'open' ? openBox : closedBox;

  return (
    <div className="box-display">
      <div className={`box-frame is-${state}`}>
        <img src={image} alt={state === 'open' ? 'Open box' : 'Closed box'} />
        {label && (
          <div className="box-label">
            <MailLabel to={label.to} from={label.from} />
          </div>
        )}
      </div>
    </div>
  );
}
