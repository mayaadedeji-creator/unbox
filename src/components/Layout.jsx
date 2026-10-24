import { Outlet } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  return (
    <div className="app-layout">
      <header></header>

      <main>
        <div className="box box-1"></div>
        <div className="box box-2"></div>
        <div className="box box-3"></div>

        <div className="content">
            <Outlet />

        </div>
       
      </main>

      <footer></footer>
    </div>
  );
}