import { Link, Outlet } from 'react-router-dom';
import './RoomLayout.css';

// The open layout: one full-screen "room" with no panels or step bar. The "unbox"
// wordmark in the corner goes to the homepage.
export default function RoomLayout() {
  return (
    <div className="room">
      <Link to="/home" className="room-wordmark" aria-label="unbox home">
        unbox
      </Link>
      <Outlet />
    </div>
  );
}
