import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import { HiMenuAlt4 } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { FaTimes, FaMapMarkedAlt } from 'react-icons/fa';
import RollingText from './RollingText';
import { useState, useEffect, useCallback } from 'react';

function Navbar({ isMenuOpen, setIsMenuOpen }) {
  const [isPassedHero, setIsPassedHero] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [guideData, setGuideData] = useState(null);

  const fetchGuideData = useCallback(async () => {
    try {
      const response = await fetch('https://greenhaven.aisma.co.id/api/guides/');
      const data = await response.json();
      setGuideData(data[0]); // Mengambil panduan pertama
    } catch (error) {
      console.error('Error fetching guide data:', error);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (!heroSection) return;

      const heroBottom = heroSection.getBoundingClientRect().bottom;
      setIsPassedHero(heroBottom < 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showGuide && !guideData) {
      fetchGuideData();
    }
  }, [showGuide, guideData, fetchGuideData]);

  return (
    <>
      <nav className="fixed top-4 left-4 right-4 z-[50] px-4 py-6 pointer-events-none">
        <div className="navbar px-6">
          <div className="navbar-start" />
          <div className="navbar-center" />
          <div className="navbar-end flex items-center gap-3 pointer-events-auto">
            <motion.div
              className="hidden md:block"
              animate={{
                opacity: isMenuOpen ? 0 : 1,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                whileHover="hover"
                animate={isPassedHero ? 'hover' : ''}
                onClick={() => setShowGuide(true)}
                className={`
                  group btn shadow-xl bg-white hover:bg-emerald-50 text-emerald-800 
                  rounded-full pr-6 pl-4 flex items-center gap-2 relative overflow-hidden whitespace-nowrap
                  border border-emerald-200 hover:border-emerald-300
                  ${isPassedHero ? 'bg-emerald-50 border-emerald-300' : ''}
                `}
              >
                <div className="flex items-center gap-2 relative z-20">
                  <FiPlus className="w-5 h-5" />
                  <RollingText text="Mulai Petualangan" isButton forceHover={isPassedHero} />
                </div>

                <div
                  className={`
                  absolute inset-0 w-full bg-emerald-800 transform transition-transform duration-500 ease-out rounded-full z-10
                  ${isPassedHero ? 'translate-x-0' : '-translate-x-full group-hover:translate-x-0'}
                `}
                />

                <div
                  className={`
                  flex items-center gap-2 absolute inset-0 justify-center text-white transition-opacity duration-500 delay-200 z-20
                  ${isPassedHero ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}
                >
                  <FiPlus className="w-5 h-5" />
                  <RollingText text="Mulai Petualangan" isButton forceHover={isPassedHero} />
                </div>
              </motion.button>
            </motion.div>

            <div className="w-12 h-12 shadow-xl rounded-full overflow-hidden bg-white">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isPassedHero ? { scale: 1.05, backgroundColor: 'rgb(236 253 245)' } : {}}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`
                  w-full h-full text-emerald-800 hover:bg-emerald-50 
                  flex items-center justify-center transition-colors
                  ${isPassedHero ? 'bg-emerald-50' : ''}
                `}
              >
                {isMenuOpen ? <IoClose className="w-6 h-6" /> : <HiMenuAlt4 className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

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
    </>
  );
}

Navbar.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  setIsMenuOpen: PropTypes.func.isRequired,
};

export default Navbar;
