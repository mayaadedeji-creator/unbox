import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PackageProvider } from './context/PackageContext';
import RoomLayout from './components/RoomLayout';
import OpeningPage from './pages/OpeningPage';
import FillTheBoxPage from './pages/FillTheBoxPage';
import PreviewPage from './pages/PreviewPage';
import SharePage from './pages/SharePage';
import GiftPage from './pages/GiftPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <PackageProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RoomLayout />}>
            {/* The maker's steps */}
            <Route path="/" element={<OpeningPage />} />
            <Route path="/fill-the-box" element={<FillTheBoxPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/share/:id" element={<SharePage />} />

            {/* The homepage, reached from the unbox wordmark (the main address still
                goes straight to making a gift) */}
            <Route path="/home" element={<HomePage />} />

            {/* What the recipient opens from the link */}
            <Route path="/gift/:id" element={<GiftPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PackageProvider>
  );
}

export default App;
