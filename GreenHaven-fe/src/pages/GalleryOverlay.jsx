import React from 'react';
import PropTypes from 'prop-types'; // Tambahkan import prop-types
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

function GalleryOverlay({
  showGallery,
  destination,
  currentImageIndex,
  handlePrevImage,
  handleNextImage,
  setShowGallery,
  setCurrentImageIndex,
}) {
  if (!destination || !destination.images) return null;

  return (
    <AnimatePresence>
      {showGallery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowGallery(false);
            }
          }}
        >
          <div className="relative w-full h-full max-h-screen flex flex-col justify-center p-4 md:p-8">
            {/* Tombol Close */}
            <button
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm text-white transition-all duration-300 z-50"
              onClick={() => setShowGallery(false)}
            >
              <FaTimes className="w-6 h-6" />
            </button>

            {/* Image Display */}
            <div className="relative w-full h-full max-h-[70vh] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
              <img
                src={destination.images[currentImageIndex]?.image}
                alt={destination.title}
                className="w-full h-full object-contain object-center relative z-10"
              />

              {/* Navigation Buttons */}
              <button
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 md:p-3 rounded-full backdrop-blur-sm text-white transition-all duration-300 group"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                type="button"
              >
                <FaChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
              </button>
              <button
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 md:p-3 rounded-full backdrop-blur-sm text-white transition-all duration-300 group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                type="button"
              >
                <FaChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm text-white text-sm">
                {currentImageIndex + 1} / {destination.images.length}
              </div>

              {/* Image Title */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-white text-xl font-medium">
                  {destination.title} - Foto {currentImageIndex + 1}
                </h3>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex justify-center mt-4 gap-2 md:gap-4 px-4 overflow-x-auto pb-2">
              {destination.images.map((img, index) => (
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
                  type="button"
                >
                  <img
                    src={img.image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * 1. showGallery, currentImageIndex: Tipe boolean & number
 * 2. handlePrevImage, handleNextImage, setShowGallery, setCurrentImageIndex: Fungsi (func)
 * 3. destination: shape({
 *      title: string,
 *      images: arrayOf(shape({ image: string }))
 *    })
 */
GalleryOverlay.propTypes = {
  showGallery: PropTypes.bool.isRequired,
  destination: PropTypes.shape({
    title: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        image: PropTypes.string,
      })
    ),
  }),
  currentImageIndex: PropTypes.number.isRequired,
  handlePrevImage: PropTypes.func.isRequired,
  handleNextImage: PropTypes.func.isRequired,
  setShowGallery: PropTypes.func.isRequired,
  setCurrentImageIndex: PropTypes.func.isRequired,
};

GalleryOverlay.defaultProps = {
  showGallery: false,
  destination: {
    title: '',
    images: [],
  },
};

export default GalleryOverlay;
