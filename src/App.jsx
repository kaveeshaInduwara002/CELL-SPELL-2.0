import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import Particles from './components/Particles';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Workshop1Page from './pages/Workshop1Page';
import Workshop2Page from './pages/Workshop2Page';
import ComingSoonPage from './pages/ComingSoonPage';
import SuccessPage from './pages/SuccessPage';

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <LoadingScreen loading={loading} />
      <Particles />
      <div className="mist-overlay" />
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register/workshop-1" element={<Workshop1Page />} />
            <Route path="/register/workshop-2" element={<Workshop2Page />} />
            <Route path="/register/industry-visit" element={<ComingSoonPage />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
