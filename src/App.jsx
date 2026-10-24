import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PackageProvider } from './context/PackageContext';
import Layout from './components/Layout';
import OpeningPage from './pages/OpeningPage';
import FillTheBoxPage from './pages/FillTheBoxPage';
import PreviewPage from './pages/PreviewPage';
import SharePage from './pages/SharePage';
import GiftPage from './pages/GiftPage';
import './App.css';


function App() {
  return (
    <PackageProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* The maker's steps */}
            <Route path="/" element={<OpeningPage />} />
            <Route path="/fill-the-box" element={<FillTheBoxPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/share/:id" element={<SharePage />} />

            {/* What the recipient opens from the link */}
            <Route path="/gift/:id" element={<GiftPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PackageProvider>
  );
}

export default App;
