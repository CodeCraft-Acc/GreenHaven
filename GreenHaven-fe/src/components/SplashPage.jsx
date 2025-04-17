import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaLeaf } from 'react-icons/fa';
import PropTypes from 'prop-types';

function SplashPage({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isSplitting, setIsSplitting] = useState(false);
  const [showGreenOverlay, setShowGreenOverlay] = useState(false);
  const [reverseGreenOverlay, setReverseGreenOverlay] = useState(false);

  useEffect(() => {
    const timeline = {
      showGreen: 2000,
      hideGreen: 2700,
      startSplit: 5200,
      hideAll: 6200,
    };

    const showGreenTimer = setTimeout(() => setShowGreenOverlay(true), timeline.showGreen);
    const reverseGreenTimer = setTimeout(() => setReverseGreenOverlay(true), timeline.hideGreen);
    const splitTimer = setTimeout(() => setIsSplitting(true), timeline.startSplit);
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, timeline.hideAll);

    return () => {
      [showGreenTimer, reverseGreenTimer, splitTimer, hideTimer].forEach(clearTimeout);
    };
  }, [onComplete]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] w-screen h-screen overflow-hidden touch-none">
          {/* Split Backgrounds */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: isSplitting ? '-100%' : 0 }}
            transition={{
              duration: 1.2,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="absolute top-0 left-0 right-0 h-1/2 bg-emerald-50 overflow-hidden"
          >
            {/* Top Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#065f46_1px,transparent_1px)] bg-[length:24px_24px]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 0 }}
            animate={{ y: isSplitting ? '100%' : 0 }}
            transition={{
              duration: 1.2,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-emerald-50 overflow-hidden"
          >
            {/* Bottom Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#065f46_1px,transparent_1px)] bg-[length:24px_24px]" />
            </div>
          </motion.div>

          {/* Green Overlay */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{
              y: showGreenOverlay ? 0 : '100%',
              y: reverseGreenOverlay ? '100%' : 0,
            }}
            transition={{
              duration: 1.4,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="absolute inset-0 bg-gradient-to-b from-emerald-600 to-emerald-700 z-20"
          />

          {/* Split Containers */}
          <div className="absolute inset-0 z-30">
            {/* Top Content */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: isSplitting ? '-100%' : 0 }}
              transition={{
                duration: 1.2,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
              className="absolute top-0 left-0 right-0 h-1/2 flex items-end justify-center pb-2"
            >
              <div className="text-center mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 1,
                    ease: [0.43, 0.13, 0.23, 0.96],
                  }}
                  className="flex items-center justify-center gap-3 mb-2"
                >
                  <FaLeaf
                    className={`w-8 h-8 transition-colors duration-1000 ${
                      reverseGreenOverlay ? 'text-emerald-600' : 'text-white'
                    }`}
                  />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.4,
                    duration: 1,
                    ease: [0.43, 0.13, 0.23, 0.96],
                  }}
                  className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight transition-colors duration-1000 ${
                    reverseGreenOverlay ? 'text-emerald-800' : 'text-white'
                  }`}
                >
                  Welcome to Green Haven
                </motion.h1>
              </div>
            </motion.div>

            {/* Bottom Content */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: isSplitting ? '100%' : 0 }}
              transition={{
                duration: 1.2,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
              className="absolute bottom-0 left-0 right-0 h-1/2 flex items-start justify-center pt-2"
            >
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5,
                  duration: 1,
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
                className={`text-lg md:text-xl lg:text-2xl font-medium tracking-wide transition-colors duration-1000 ${
                  reverseGreenOverlay ? 'text-emerald-600' : 'text-white'
                }`}
              >
                Mari Jelajahi Keindahan Kota Hujan
              </motion.p>
            </motion.div>
          </div>

          {/* Decorative Circles */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: isSplitting || showGreenOverlay ? 0 : 0.3,
            }}
            transition={{
              scale: { delay: 0.2, duration: 1.4, ease: [0.43, 0.13, 0.23, 0.96] },
              opacity: { duration: 0.8 },
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101]"
          >
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[300px] md:h-[300px] border border-emerald-300/30 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[350px] md:h-[350px] border border-emerald-300/20 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] border border-emerald-300/10 rounded-full animate-[spin_30s_linear_infinite]" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

SplashPage.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default SplashPage;
