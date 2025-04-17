import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function GreenCampaign({ id, onComplete, isActive, currentImageIndex, setCurrentImageIndex }) {
  const sectionRef = useRef(null);
  const [images, setImages] = useState([]);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
  const [destinationGroups, setDestinationGroups] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px adalah breakpoint untuk mobile
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch dan group images berdasarkan destination id
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://greenhaven.aisma.co.id/api/destinations-images/');
        const data = await response.json();

        // Group images by destination ID
        const groups = data.reduce((acc, item) => {
          const destId = item.destinations;
          if (!acc[destId]) {
            acc[destId] = [];
          }
          acc[destId].push(item.image);
          return acc;
        }, {});

        // Convert to array of image groups
        const groupArray = Object.values(groups)
          .filter((group) => group.length >= 3) // Only include groups with 3 or more images
          .map((group) => group.slice(0, 3)); // Take only first 3 images from each group

        setDestinationGroups(groupArray);

        // Set initial images
        if (groupArray.length > 0) {
          setImages(groupArray[0]);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  // Handle image change
  useEffect(() => {
    if (currentImageIndex === 3) {
      const nextDestIndex = (currentDestinationIndex + 1) % destinationGroups.length;
      setCurrentDestinationIndex(nextDestIndex);
      setImages(destinationGroups[nextDestIndex]);
      setCurrentImageIndex(0);
    }
  }, [currentImageIndex, currentDestinationIndex, destinationGroups]);

  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // State untuk blokir scroll ke next section
  const [canScrollNext, setCanScrollNext] = useState(false);

  // State untuk mendeteksi apakah sedang di tengah animasi pergantian gambar
  const [isScrolling, setIsScrolling] = useState(false);

  // Menyimpan arah scroll (down / up)
  const [scrollDirection, setScrollDirection] = useState(null);

  // Tahap animasi overlay: 'enter' | 'exit' | null
  const [overlayPhase, setOverlayPhase] = useState(null);

  // Tambahkan state untuk mengontrol transisi akhir
  const [isReadyToTransition, setIsReadyToTransition] = useState(false);

  // Tambahkan state untuk tracking arah scroll global
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  const scrollTimeout = useRef(null);
  const scrollThreshold = 50;
  const accumulatedDelta = useRef(0);

  // --------------------------------------------------
  // Parallax Logic (opsional, sama seperti contoh sebelumnya)
  // --------------------------------------------------
  const { scrollY } = useScroll();
  const leftCircleY = useTransform(scrollY, [0, 600], [0, 100], { clamp: false });
  const rightCircleY = useTransform(scrollY, [0, 600], [0, -100], { clamp: false });

  // --------------------------------------------------
  // Handle Scroll
  // --------------------------------------------------
  useEffect(() => {
    let touchStartY = 0;
    let touchStartTime = 0;
    let lastScrollY = window.scrollY;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      lastScrollY = window.scrollY;
    };

    const handleTouchMove = (e) => {
      if (isScrolling) return;

      const touchY = e.touches[0].clientY;
      const touchDiff = touchStartY - touchY;
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;

      // Jika section dalam viewport
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect && rect.top <= 0 && rect.bottom >= window.innerHeight) {
        // Izinkan scroll normal jika di gambar terakhir dan scroll ke bawah
        if (currentImageIndex === images.length - 1 && touchDiff > 0) {
          return;
        }

        // Prevent default untuk kasus lainnya
        e.preventDefault();

        // Update parallax effect
        if (touchDiff > 0) {
          // Scrolling down
          leftCircleY.set(leftCircleY.get() + touchDiff * 0.1);
          rightCircleY.set(rightCircleY.get() - touchDiff * 0.1);
        } else {
          // Scrolling up
          leftCircleY.set(leftCircleY.get() + touchDiff * 0.1);
          rightCircleY.set(rightCircleY.get() - touchDiff * 0.1);
        }
      }
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;
      const touchDiff = touchStartY - touchEndY;

      // Minimal swipe distance dan maximum duration
      const minSwipeDistance = 50;
      const maxSwipeDuration = 300;

      if (Math.abs(touchDiff) > minSwipeDistance && touchDuration < maxSwipeDuration) {
        if (touchDiff > 0 && currentImageIndex < images.length - 1) {
          // Swipe Up
          setScrollDirection('down');
          setIsScrolling(true);
          setOverlayPhase('enter');
          setCurrentImageIndex((prev) => prev + 1);
        } else if (touchDiff < 0 && currentImageIndex > 0) {
          // Swipe Down
          setScrollDirection('up');
          setIsScrolling(true);
          setOverlayPhase('enter');
          setCurrentImageIndex((prev) => prev - 1);
        }
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('touchstart', handleTouchStart, { passive: false });
      section.addEventListener('touchmove', handleTouchMove, { passive: false });
      section.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      if (section) {
        section.removeEventListener('touchstart', handleTouchStart);
        section.removeEventListener('touchmove', handleTouchMove);
        section.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [currentImageIndex, images.length, isScrolling, leftCircleY, rightCircleY]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (!sectionRef.current || isScrolling) return;

      const isLastImage = currentImageIndex === images.length - 1;
      const isFirstImage = currentImageIndex === 0;

      // Untuk mobile, biarkan scroll normal
      if (isMobile) {
        if (isLastImage && e.deltaY > 0) {
          onComplete();
        }
        return;
      }

      // Jika di gambar terakhir dan scroll ke bawah
      if (isLastImage && e.deltaY > 0) {
        onComplete();
        return;
      }

      // Jika di gambar pertama dan scroll ke atas
      if (isFirstImage && e.deltaY < 0) {
        return;
      }

      // Prevent default untuk kasus lainnya
      e.preventDefault();

      const canScrollUp = currentImageIndex > 0;
      const canScrollDown = currentImageIndex < images.length - 1;

      // Akumulasi delta scroll
      accumulatedDelta.current += e.deltaY;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        accumulatedDelta.current = 0;
      }, 200);

      if (Math.abs(accumulatedDelta.current) >= scrollThreshold) {
        if (accumulatedDelta.current > 0 && canScrollDown) {
          setScrollDirection('down');
          setIsScrolling(true);
          setOverlayPhase('enter');
        } else if (accumulatedDelta.current < 0 && canScrollUp) {
          setScrollDirection('up');
          setIsScrolling(true);
          setOverlayPhase('enter');
        }
        accumulatedDelta.current = 0;
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (section) {
        section.removeEventListener('wheel', handleWheel);
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [currentImageIndex, images.length, isScrolling, onComplete, isMobile]);

  // --------------------------------------------------
  // Overlay Variants
  // --------------------------------------------------
  const overlayVariants = {
    // Slide dari bawah ke atas (untuk scroll down)
    downEnter: {
      y: '100%',
      borderRadius: '9999px',
    },
    downCenter: {
      y: 0,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    downExit: {
      y: '-100%',
      transition: { duration: 0.5, ease: 'easeInOut' },
    },

    // Slide dari atas ke bawah (untuk scroll up)
    upEnter: {
      y: '-100%',
      borderRadius: '9999px',
    },
    upCenter: {
      y: 0,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    upExit: {
      y: '100%',
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  };

  // --------------------------------------------------
  // Proses overlay animation
  // --------------------------------------------------
  const handleOverlayAnimationComplete = (definition) => {
    if (definition === 'downCenter' || definition === 'upCenter') {
      setCurrentImageIndex((prev) => {
        const newIndex = scrollDirection === 'down' ? prev + 1 : prev - 1;
        // Jika mencapai foto terakhir, tunda sebentar sebelum mengizinkan transisi
        if (newIndex === images.length - 1) {
          setTimeout(() => {
            setIsReadyToTransition(true);
          }, 500);
        }
        return newIndex;
      });
      setOverlayPhase('exit');
    } else if (definition === 'downExit' || definition === 'upExit') {
      setIsScrolling(false);
      setOverlayPhase(null);
    }
  };

  // --------------------------------------------------
  // Variants untuk container, text, & image
  // --------------------------------------------------
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Tambahkan useEffect untuk mendeteksi completion
  useEffect(() => {
    if (currentImageIndex === images.length - 1) {
      // Tunggu animasi selesai baru set ready
      setTimeout(() => {
        setIsReadyToTransition(true);
      }, 500);
    } else {
      setIsReadyToTransition(false);
    }
  }, [currentImageIndex, images.length]);

  // Update indikator scroll
  const renderScrollIndicator = () => {
    if (currentImageIndex === images.length - 1) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-[-3rem] left-1/2 -translate-x-1/2 text-emerald-600 text-sm flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xl"
          >
            ↓
          </motion.div>
        </motion.div>
      );
    }
    return null;
  };

  // Reset states when section is not in view
  useEffect(() => {
    if (!isInView) {
      setCurrentImageIndex(0);
      setIsReadyToTransition(false);
      setIsScrolling(false);
      setOverlayPhase(null);
      setScrollDirection(null);
    }
  }, [isInView]);

  useEffect(() => {
    const handleReset = () => {
      setCurrentImageIndex(0);
      setIsReadyToTransition(false);
      setIsScrolling(false);
      setOverlayPhase(null);
      setScrollDirection(null);
    };

    window.addEventListener('resetStates', handleReset);
    return () => window.removeEventListener('resetStates', handleReset);
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative min-h-screen bg-white overflow-hidden flex items-center py-20 ${
        isMobile ? 'touch-pan-y' : ''
      }`}
    >
      {/* Parallax circles */}
      <motion.div
        style={{ y: leftCircleY }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.1 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-emerald-300 rounded-full blur-3xl -z-10"
      />
      <motion.div
        style={{ y: rightCircleY }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.1 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.7 }}
        className="absolute right-0 top-1/4 w-[30rem] h-[30rem] bg-emerald-200 rounded-full blur-3xl -z-10"
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className={`flex ${
            isMobile ? 'flex-col' : 'flex-row'
          } justify-center items-center gap-8 md:gap-16 lg:gap-20`}
        >
          {/* Left Text - Stack on mobile */}
          <motion.div
            variants={textVariants}
            className={`text-center ${isMobile ? 'w-full' : 'w-[25%]'}`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-none text-emerald-950/90 tracking-tighter">
              AYO!
            </h2>
            <p className="mt-2 text-emerald-700/80 text-sm md:text-base">
              Petualangan di Kota Hujan
            </p>
          </motion.div>

          {/* Center Image - Larger on mobile */}
          <motion.div
            variants={imageVariants}
            className={`relative ${
              isMobile
                ? 'w-[80vw] max-w-[300px]'
                : 'w-[35vw] xs:w-[32vw] sm:w-[30vw] md:w-[26vw] lg:w-[22vw] xl:w-[20vw]'
            } aspect-square mx-auto`}
          >
            {/* Background circles */}
            <div className="absolute inset-0 rounded-full bg-emerald-50/80 -m-4 backdrop-blur-sm" />
            <div className="absolute inset-0 rounded-full bg-emerald-100/60 -m-2" />

            {/* Container utama yang membungkus img & overlay */}
            <div className="relative w-full h-full rounded-full overflow-hidden group">
              {/* Main image */}
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={`Destination ${currentDestinationIndex + 1} - Image ${currentImageIndex + 1}`}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7 }}
                className="w-full h-full object-cover transform scale-110 group-hover:scale-125 transition-transform duration-700"
              />
              {/* Gradasi di atas gambar */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />

              {/* Overlay animasi:
                  Letakkan di dalam container .rounded-full.overflow-hidden */}
              <AnimatePresence>
                {isScrolling && overlayPhase && (
                  <motion.div
                    className="absolute inset-0 bg-emerald-500 z-10"
                    variants={overlayVariants}
                    initial={scrollDirection === 'down' ? 'downEnter' : 'upEnter'}
                    animate={
                      overlayPhase === 'enter'
                        ? scrollDirection === 'down'
                          ? 'downCenter'
                          : 'upCenter'
                        : scrollDirection === 'down'
                          ? 'downExit'
                          : 'upExit'
                    }
                    exit={{ opacity: 0 }} // jika mau ada efek fadeout di akhir
                    onAnimationComplete={handleOverlayAnimationComplete}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Image indicators - Reposition for mobile */}
            <div
              className={`absolute ${
                isMobile
                  ? 'bottom-[-2rem] left-1/2 -translate-x-1/2 flex-row gap-4'
                  : '-right-12 top-1/2 -translate-y-1/2 flex-col gap-2'
              }flex`}
            >
              {[0, 1, 2].map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-emerald-600 w-4' : 'bg-emerald-200'
                  }`}
                />
              ))}
            </div>

            {/* Mobile swipe indicator */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-emerald-600/80"
              >
                <div className="text-sm">Swipe Up/Down</div>
                <motion.div
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-lg"
                >
                  ↕️
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Text - Stack on mobile */}
          <motion.div
            variants={textVariants}
            className={`text-center ${isMobile ? 'w-full' : 'w-[25%]'}`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-none text-emerald-950/90 tracking-tighter">
              JELAJAHI
            </h2>
            <p className="mt-2 text-emerald-700/80 text-sm md:text-base">
              Keindahan alam Indonesia
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

GreenCampaign.propTypes = {
  id: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  currentImageIndex: PropTypes.number.isRequired,
  setCurrentImageIndex: PropTypes.func.isRequired,
};

export default GreenCampaign;
