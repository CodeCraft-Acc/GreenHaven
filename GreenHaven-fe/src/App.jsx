import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuOverlay from './components/MenuOverlay';
import AboutSection from './components/AboutSection';
import GreenCampaign from './components/GreenCampaign';
import GallerySection from './components/GallerySection';
import NewsGallery from './components/NewsGallery';
import LastPage from './components/LastPage';
import ChatBot from './components/ChatBot';
import SplashPage from './components/SplashPage';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Kuliner from './pages/Kuliner';
import Health from './pages/Health';
import KulinerDetail from './pages/KulinerDetail';
import HealthDetail from './pages/HealthDetail';
import 'leaflet/dist/leaflet.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGreenCampaignComplete, setIsGreenCampaignComplete] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  const menuItems = [
    { number: '01', label: 'Home' },
    { number: '02', label: 'Destinations' },
    { number: '03', label: 'Experiences' },
    { number: '04', label: 'Sustainability' },
    { number: '05', label: 'Reviews' },
    { number: '06', label: 'Contact' },
  ];

  // Kontrol scroll
  useEffect(() => {
    const handleScroll = (e) => {
      const greenCampaignSection = document.getElementById('green-campaign-section');
      if (!greenCampaignSection) return;

      const rect = greenCampaignSection.getBoundingClientRect();
      const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;

      if (isInView) {
        // Jika scroll ke atas dan di foto pertama, biarkan scroll terjadi
        if (e.deltaY < 0 && currentImageIndex === 0) {
          return;
        }

        // Jika section dalam view dan belum complete, prevent scroll
        if (!isGreenCampaignComplete) {
          e.preventDefault();
          greenCampaignSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => window.removeEventListener('wheel', handleScroll);
  }, [isGreenCampaignComplete, currentImageIndex]);

  // Tambahkan intersection observer untuk reset state
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Reset state ketika section keluar dari viewport
          if (!entry.isIntersecting) {
            setIsGreenCampaignComplete(false);
          }
        });
      },
      { threshold: 0.1 } // Trigger ketika 10% section terlihat
    );

    const greenCampaignSection = document.getElementById('green-campaign-section');
    if (greenCampaignSection) {
      observer.observe(greenCampaignSection);
    }

    return () => {
      if (greenCampaignSection) {
        observer.unobserve(greenCampaignSection);
      }
    };
  }, []);

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('about-section');
    nextSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SplashPage
                  onComplete={() => setIsSplashComplete(true)}
                  className="overflow-hidden"
                />
                <div
                  className={`overflow-hidden transition-opacity duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                >
                  <Navbar
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    className="overflow-hidden"
                  />
                  <div className="overflow-hidden">
                    <Hero
                      scrollToNextSection={scrollToNextSection}
                      isSplashComplete={isSplashComplete}
                    />
                  </div>
                </div>
                <AnimatePresence>
                  {isMenuOpen && (
                    <MenuOverlay menuItems={menuItems} setIsMenuOpen={setIsMenuOpen} />
                  )}
                </AnimatePresence>
                <AboutSection />
                <GreenCampaign
                  id="green-campaign-section"
                  onComplete={() => setIsGreenCampaignComplete(true)}
                  isActive={activeSection === 'green-campaign'}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                />
                <GallerySection />
                <NewsGallery className="overflow-hidden" />
                <LastPage />
                <ChatBot isMenuOpen={isMenuOpen} />
              </>
            }
          />
          <Route
            path="/destinations"
            element={<Destinations isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}
          />
          <Route
            path="/destinations/:slug"
            element={<DestinationDetail isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}
          />
          <Route
            path="/kuliner"
            element={<Kuliner isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}
          />
          <Route
            path="/health"
            element={<Health isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}
          />
          <Route path="/kuliner/:slug" element={<KulinerDetail />} />
          <Route path="/health/:slug" element={<HealthDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
