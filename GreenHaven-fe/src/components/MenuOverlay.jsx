import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { FaLeaf } from 'react-icons/fa';
import RollingText from './RollingText';
import { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaMapMarkedAlt } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';

function MenuOverlay({ setIsMenuOpen, isSidebarOpen }) {
  const [showGuide, setShowGuide] = useState(false);
  const [guideData, setGuideData] = useState(null);

  const fetchGuideData = useCallback(async () => {
    try {
      const response = await fetch('https://greenhaven.aisma.co.id/api/guides/');
      const data = await response.json();
      setGuideData(data[0]);
    } catch (error) {
      console.error('Error fetching guide data:', error);
    }
  }, []);

  useEffect(() => {
    if (showGuide && !guideData) {
      fetchGuideData();
    }
  }, [showGuide, guideData, fetchGuideData]);

  // Menu items sesuai dengan Hero navigation
  const menuItems = [
    {
      number: '01',
      label: 'Home',
      action: () => {
        setIsMenuOpen(false);
        window.location.href = '/';
      },
    },
    {
      number: '02',
      label: 'About Us',
      action: () => {
        setIsMenuOpen(false);
        const aboutSection = document.getElementById('about-section');
        aboutSection?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      number: '03',
      label: 'Destinations',
      action: () => {
        setIsMenuOpen(false);
        window.location.href = '/destinations';
      },
    },
    {
      number: '04',
      label: 'Kuliner',
      action: () => {
        setIsMenuOpen(false);
        window.location.href = '/kuliner';
      },
    },
    {
      number: '05',
      label: 'Health & Contact',
      action: () => {
        setIsMenuOpen(false);
        window.location.href = '/health';
      },
    },
  ];

  // Add useEffect to handle body class
  useEffect(() => {
    // Add class when component mounts
    document.body.classList.add('no-scrollbar');
    document.body.style.overflow = 'hidden';

    // Remove class when component unmounts
    return () => {
      document.body.classList.remove('no-scrollbar');
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex no-scrollbar">
      {/* Header - Improved spacing */}
      <nav className="fixed top-4 left-4 right-4 z-50 px-4 py-6">
        <div className="navbar px-4 sm:px-6">
          <div className="navbar-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl text-white flex items-center"
            >
              <FaLeaf className="w-6 h-6 sm:w-8 sm:h-8" />
            </motion.div>
          </div>

          {/* Buttons container - Keep existing button styles */}
          <div className="navbar-end flex items-center gap-2 sm:gap-3">
            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                whileHover="hover"
                onClick={() => setShowGuide(true)}
                className="group btn bg-white hover:bg-emerald-50 text-emerald-800 rounded-full pr-6 pl-4 flex items-center gap-2 relative overflow-hidden whitespace-nowrap border border-emerald-200 hover:border-emerald-300"
              >
                <div className="flex items-center gap-2 relative z-20">
                  <FiPlus className="w-5 h-5" />
                  <RollingText text="Mulai Petualangan" isButton />
                </div>

                <div className="absolute inset-0 w-full bg-emerald-800 transform -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0 rounded-full z-10" />

                <div className="flex items-center gap-2 absolute inset-0 justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 z-20">
                  <FiPlus className="w-5 h-5" />
                  <RollingText text="Mulai Petualangan" isButton />
                </div>
              </motion.button>
            </motion.div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(false)}
              className="p-3 bg-white rounded-full flex items-center justify-center text-emerald-800 hover:bg-emerald-50"
            >
              <IoClose className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Content Container - Improved layout */}
      <div className="flex w-full h-full">
        {/* Left Sidebar - Improved responsiveness */}
        <motion.div
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{
            duration: 0.8,
            ease: [0.87, 0, 0.13, 1],
          }}
          className="hidden lg:block w-[25vw] max-w-[320px] min-w-[280px] bg-emerald-900 h-full"
        >
          <div className="h-full p-6 sm:p-8 flex flex-col justify-between">
            <div /> {/* Spacer */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="flex flex-col gap-3">
                <ContactLinks />
              </div>
              <div className="flex flex-col gap-2">
                <LegalLinks />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content - Improved spacing and responsiveness */}
        <motion.div
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0 0 0 0)' }}
          exit={{ clipPath: 'inset(100% 0 0 0)' }}
          transition={{
            duration: 0.8,
            ease: [0.87, 0, 0.13, 1],
          }}
          className="flex-1 bg-emerald-800 h-full relative"
        >
          <div className="h-full">
            <div className="max-w-[1800px] mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-20 md:pt-24">
              <span className="text-white/70 text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider block mb-8 md:mb-12">
                Navigation
              </span>
              <div className="flex flex-col space-y-1 xs:space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5">
                {menuItems.map((item, index) => (
                  <NavigationItem key={item.number} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Contact info at bottom right */}
          <div className="absolute bottom-4 xs:bottom-6 sm:bottom-8 right-4 xs:right-6 sm:right-8 md:bottom-16 md:right-16 lg:bottom-20 lg:right-20 text-right">
            <div className="flex flex-col gap-1 xs:gap-2">
              <a href="#" className="text-xs xs:text-sm sm:text-base text-white hover:opacity-80">
                WhatsApp
              </a>
              <a href="#" className="text-xs xs:text-sm sm:text-base text-white hover:opacity-80">
                Telegram
              </a>
              <a
                href="mailto:info@greenhaven.id"
                className="text-xs xs:text-sm sm:text-base text-white/70 hover:opacity-80"
              >
                info@greenhaven.id
              </a>
              <div className="mt-4 xs:mt-6 sm:mt-8">
                <a
                  href="#"
                  className="text-[10px] xs:text-xs sm:text-sm text-white/70 hover:opacity-80 block"
                >
                  Privacy Policy & Cookies
                </a>
                <p className="text-[10px] xs:text-xs sm:text-sm text-white/70">
                  © GreenHaven 2024
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuide && guideData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center backdrop-blur-sm p-4"
            onClick={() => setShowGuide(false)}
          >
            <motion.div
              className="relative w-full max-w-5xl p-6 md:p-8 bg-white rounded-3xl my-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 p-2 rounded-full backdrop-blur-sm text-gray-800 transition-all duration-300 z-50"
                onClick={() => setShowGuide(false)}
              >
                <FaTimes className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src={guideData.images[0]?.image}
                    alt={guideData.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm flex items-center gap-2">
                      <FaMapMarkedAlt className="w-4 h-4" /> Panduan Perjalanan
                    </span>
                  </div>

                  <h2 className="text-3xl font-semibold text-gray-900 mb-4">{guideData.title}</h2>

                  <div className="prose prose-lg prose-emerald overflow-y-auto custom-scrollbar max-h-[150px]">
                    {guideData.description.split('\r\n\r\n').map((paragraph, idx) => (
                      <p key={idx} className="text-gray-600 mb-4 last:mb-0 text-justify">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Waktu Tempuh</h4>
                        <p className="text-emerald-800">1 - 1.5 jam</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Transportasi</h4>
                        <p className="text-emerald-800">KRL, Bus</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Navigation Item Component - Updated dengan onClick handler
function NavigationItem({ item, index }) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1 + 0.3,
      }}
      className="group cursor-pointer"
      onClick={item.action}
    >
      <div className="flex items-center">
        <div className="w-[40px] md:w-[60px] flex items-center">
          <div className="w-0 group-hover:w-full h-[1px] md:h-[2px] bg-white/30 transition-all duration-300" />
        </div>

        <div className="flex items-center transform translate-x-0 group-hover:translate-x-4 md:group-hover:translate-x-6 transition-transform duration-300">
          <span
            className="text-[1.5rem] xs:text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] xl:text-[4rem]
                     font-light text-white leading-none tracking-tight transition-colors
                     group-hover:text-emerald-100"
          >
            {item.label}
          </span>
          <span
            className="text-white/50 text-[8px] xs:text-[10px] sm:text-xs md:text-sm
                     self-start mt-1 xs:mt-1.5 sm:mt-2 md:mt-3 ml-2 md:ml-3"
          >
            {item.number}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Extracted Contact Links Component
function ContactLinks() {
  return (
    <>
      <a
        href="https://wa.me/your-number"
        className="text-sm sm:text-base text-white hover:opacity-80"
      >
        WhatsApp
      </a>
      <a
        href="https://t.me/your-username"
        className="text-sm sm:text-base text-white hover:opacity-80"
      >
        Telegram
      </a>
      <a
        href="mailto:info@greenhaven.id"
        className="text-sm sm:text-base text-white/70 hover:opacity-80"
      >
        info@greenhaven.id
      </a>
    </>
  );
}

// Extracted Legal Links Component
function LegalLinks() {
  return (
    <>
      <a href="/privacy-policy" className="text-sm sm:text-base text-white/70 hover:opacity-80">
        Privacy Policy & Cookies
      </a>
      <span className="text-sm sm:text-base text-white/70">© GreenHaven 2024</span>
    </>
  );
}

// PropTypes
NavigationItem.propTypes = {
  item: PropTypes.shape({
    number: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

MenuOverlay.propTypes = {
  setIsMenuOpen: PropTypes.func.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
};

export default MenuOverlay;
