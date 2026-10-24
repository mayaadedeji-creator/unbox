import labelImage from '../assets/mail-label.svg';
import './MailLabel.css';

// Longer names get smaller handwriting so they still fit on the label's two lines.
const sizeClass = (text) => (text.length > 14 ? ' is-long' : '');

// The To/From shipping label, with the names written on its lines.
// Everything is sized relative to the label's width, so it works at any size.
export default function MailLabel({ to, from }) {
  return (
    <div
      className="mail-label"
      role="img"
      aria-label={`Shipping label. To: ${to || 'blank'}. From: ${from || 'blank'}.`}
    >
      <img src={labelImage} alt="" />
      <span className={`mail-label-text is-to${sizeClass(to)}`}>{to}</span>
      <span className={`mail-label-text is-from${sizeClass(from)}`}>{from}</span>
    </div>
  );
}
