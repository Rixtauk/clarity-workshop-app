import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Hero from './components/Hero';
import LogoBanner from './components/LogoBanner';
import StorySelling from './components/StorySelling';
import IntroducingWorkshop from './components/IntroducingWorkshop';
import Testimonials from './components/Testimonials';
import WorkshopOutcomes from './components/WorkshopOutcomes';
import WorkshopIntro from './components/WorkshopIntro';
import Coach from './components/Coach';
import PressFeatures from './components/PressFeatures';
import Workshop from './components/Workshop';
import Reviews from './components/Reviews';
import Purchase from './components/Purchase';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import DirectWebhook from './pages/DirectWebhook';
import WebhookTest from './pages/WebhookTest';
import UserMenu from './components/UserMenu';
import ExitPopup from './components/ExitPopup';

// ScrollToTop component that scrolls the window to the top whenever the route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function HomePage() {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [popupShown, setPopupShown] = useState(false);

  // Set up timer to show popup after 8 seconds
  useEffect(() => {
    // Only show popup once per session
    if (popupShown) return;

    const timer = setTimeout(() => {
      setPopupShown(true);
      setShowExitPopup(true);
    }, 8000); // 8 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [popupShown]);

  // Add CSS for animation
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translate3d(0, 20px, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
      
      .animate-fade-in-up {
        animation: fadeInUp 0.4s ease-out;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute top-8 right-8 z-10">
        <UserMenu />
      </div>
      <Hero />
      <LogoBanner />
      <StorySelling />
      <IntroducingWorkshop />
      <WorkshopOutcomes />
      <Reviews />
      <WorkshopIntro />
      <Coach />
      <PressFeatures />
      <Workshop />
      <Purchase />
      <FAQ />
      <Footer />
      
      <ExitPopup isOpen={showExitPopup} onClose={() => setShowExitPopup(false)} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/webhook-tool" element={<DirectWebhook />} />
        <Route path="/webhook-test" element={<WebhookTest />} />
      </Routes>
    </Router>
  );
}

export default App;