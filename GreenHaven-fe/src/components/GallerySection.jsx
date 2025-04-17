import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import RollingText from './RollingText';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';

function GallerySection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
  });

  const [images, setImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://greenhaven.aisma.co.id/api/destinations-images/');
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showGallery) return;
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape') {
        setShowGallery(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGallery]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative min-h-screen bg-white overflow-hidden flex items-center"
      >
        {/* Background Oval: muncul dari bawah ke atas */}
        <motion.div
          initial={{ y: 200, scale: 0.95, opacity: 0 }}
          animate={isInView ? { y: 0, scale: 1, opacity: 1 } : { y: 200, scale: 0.95, opacity: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-0 w-full h-screen bg-[#E6F4EA] rounded-t-full"
        />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          {/* Header with "Our Gallery" button */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <button
              className="
                relative overflow-hidden group
                px-6 py-2 rounded-full border border-emerald-800/20 text-emerald-800
                transition-colors
              "
            >
              {/* Teks Rolling di atas button */}
              <span className="relative z-10 flex items-center justify-center">
                <RollingText text="Our Gallery" isButton />
              </span>

              {/* 
                'span' background di belakang teks, 
                dimulai di atas (-translate-y-full) lalu turun ke 0 saat hover.
              */}
              <span
                className="
                  absolute inset-0 bg-emerald-50
                  -translate-y-full group-hover:translate-y-0
                  transition-transform
                  duration-700
                  ease-[cubic-bezier(0.7,0,0.3,1)]
                  pointer-events-none
                "
              />
            </button>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal text-emerald-950 mb-4">
              Jelajahi Keindahan Bogor
            </h2>
            <p className="text-xl md:text-2xl text-emerald-800/80">melalui galeri foto kami</p>
          </motion.div>

          {/* Main Image Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative w-full max-w-4xl mx-auto"
          >
            <div className="group relative rounded-full overflow-hidden aspect-[2/1]">
              <img
                src={
                  images[0]?.image || 'https://www.masuksini.com/image/large/20240827013052_1.jpg'
                }
                alt="Gallery"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 -translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.7,0,0.3,1)]">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden group px-6 py-3 bg-white text-emerald-800 rounded-full font-medium transition-colors shadow-xl"
                  onClick={() => setShowGallery(true)}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <RollingText text="SEE ALL" isButton />
                  </span>
                  <span className="absolute inset-0 bg-emerald-50 -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] pointer-events-none" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Small decorative squares */}
          <div className="absolute top-[10%] left-[10%] w-8 h-8 bg-white/30 rotate-45" />
          <div className="absolute top-[20%] right-[15%] w-6 h-6 bg-white/30 rotate-12" />
          <div className="absolute bottom-[30%] left-[20%] w-10 h-10 bg-white/30 -rotate-12" />
          <div className="absolute bottom-[20%] right-[10%] w-8 h-8 bg-white/30 rotate-45" />
        </div>
      </section>

      {/* Gallery Popup */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center backdrop-blur-sm p-4"
            onClick={() => setShowGallery(false)}
          >
            <motion.div
              className="relative w-full max-w-7xl p-6 md:p-8 bg-white/5 backdrop-blur rounded-3xl my-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm text-white transition-all duration-300 z-50"
                onClick={() => setShowGallery(false)}
              >
                <FaTimes className="w-6 h-6" />
              </button>

              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <img
                  src={images[currentImageIndex]?.image}
                  alt="Gallery"
                  className="w-full h-full object-contain"
                />

                {/* Navigation Buttons */}
                <button
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 md:p-3 rounded-full backdrop-blur-sm text-white transition-all duration-300 group"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                >
                  <FaChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
                <button
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 md:p-3 rounded-full backdrop-blur-sm text-white transition-all duration-300 group"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                >
                  <FaChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm text-white text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex justify-center mt-4 gap-2 md:gap-4 px-4 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative w-16 md:w-20 h-16 md:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
                      currentImageIndex === index
                        ? 'ring-2 ring-white ring-offset-4 ring-offset-black'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  >
                    <img
                      src={image.image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default GallerySection;
