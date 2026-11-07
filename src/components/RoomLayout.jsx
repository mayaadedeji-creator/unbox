import { Outlet } from 'react-router-dom';
import './RoomLayout.css';

// The new open layout: one full-screen "room" with no panels or step bar.
// Pages moved over so far: the address step. The rest still use Layout.
export default function RoomLayout() {
  return (
    <div className="room">
      <span className="room-wordmark">unbox</span>
      <Outlet />
    </div>
  );
}
