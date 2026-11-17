import { Link, Outlet } from 'react-router-dom';
import './RoomLayout.css';

// The open layout: one full-screen "room" with no panels or step bar. The "unbox"
// wordmark in the corner goes to the homepage.
// <header> and <main> are landmarks: screen reader users can jump straight to the
// page's content (main) or back to the site name and home link (header).
export default function RoomLayout() {
  return (
    <div className="room">
      <header className="room-header">
        <Link to="/home" className="room-wordmark" aria-label="unbox home">
          unbox
        </Link>
      </header>
      <main className="room-main">
        <Outlet />
      </main>
    </div>
  );
}
