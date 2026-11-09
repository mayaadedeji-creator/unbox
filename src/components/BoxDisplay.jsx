import './BoxDisplay.css';
import openBox from '../assets/box/open-box.svg';
import closedBox from '../assets/box/closed-box.svg';
import MailLabel from './MailLabel.jsx';
import GiftWrap from './GiftWrap.jsx';

// label: optional { to, from } — shows the shipping label stuck on the side of the box.
// wrapped: draws wrapping paper, ribbon and a bow over the closed box.
// wrapMode: how the wrapping behaves: 'wrap' (wraps itself up), 'still' or 'unwrap'.
// onLabelClick: optional; makes the label a button (e.g. to edit it).
// children: optional; drawn inside the box's square, e.g. <BoxContents> for the gifts in it.
export default function BoxDisplay({
  state = 'open',
  label,
  wrapped = false,
  wrapMode = 'wrap',
  onLabelClick,
  children,
}) {
  const image = state === 'open' ? openBox : closedBox;

  return (
    <div className="box-display">
      <div className={`box-frame is-${state}${wrapped ? ' is-wrapped' : ''}`}>
        <img src={image} alt={state === 'open' ? 'Open box' : wrapped ? 'Wrapped gift' : 'Closed box'} />
        {wrapped && state === 'closed' && <GiftWrap mode={wrapMode} />}
        {children}
        {label && (
          <div className="box-label">
            {onLabelClick ? (
              <button className="box-label-button" onClick={onLabelClick} aria-label="Edit the label">
                <MailLabel to={label.to} from={label.from} />              </button>
            ) : (
              <MailLabel to={label.to} from={label.from} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
