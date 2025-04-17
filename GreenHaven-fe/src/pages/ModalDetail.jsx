import React from 'react';
import PropTypes from 'prop-types'; // Import prop-types
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

function ModalDetail({
  showDetail,
  selectedItem,
  detailItems,
  currentDetailImageIndex,
  setShowDetail,
  handlePrevDetail,
  handleNextDetail,
  handlePrevDetailImage,
  handleNextDetailImage,
  setCurrentDetailImageIndex,
}) {
  if (!showDetail || !selectedItem) return null;

  return (
    <AnimatePresence>
      {showDetail && selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm p-4"
          onClick={() => setShowDetail(false)} // Klik background -> tutup modal
        >
          <motion.div
            className="relative w-full max-w-5xl p-6 md:p-8 bg-white rounded-3xl my-auto overflow-auto"
            onClick={(e) => e.stopPropagation()} // Supaya klik dalam modal tidak menutup
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tombol Close */}
            <button
              className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 p-2 rounded-full backdrop-blur-sm text-gray-800 transition-all duration-300 z-50"
              onClick={() => setShowDetail(false)}
            >
              <FaTimes className="w-6 h-6" />
            </button>

            {/* Tombol Prev/Next (untuk berpindah antar flora/fauna) */}
            <button
              onClick={handlePrevDetail}
              className="absolute top-1/2 -translate-y-1/2 left-2 md:left-6 bg-black/10 hover:bg-black/20 p-2 rounded-full text-gray-800 transition-all duration-300 z-[100]"
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextDetail}
              className="absolute top-1/2 -translate-y-1/2 right-2 md:right-6 bg-black/10 hover:bg-black/20 p-2 rounded-full text-gray-800 transition-all duration-300 z-[100]"
            >
              <FaChevronRight className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Bagian kiri: slider gambar fauna/flora */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                {/* Tombol prev/next untuk foto fauna/flora */}
                {selectedItem.images && selectedItem.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevDetailImage}
                      className="absolute top-1/2 -translate-y-1/2 left-2 bg-black/30 hover:bg-black/50 p-2 md:p-3 rounded-full text-white transition-all duration-300 z-50"
                    >
                      <FaChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextDetailImage}
                      className="absolute top-1/2 -translate-y-1/2 right-2 bg-black/30 hover:bg-black/50 p-2 md:p-3 rounded-full text-white transition-all duration-300 z-50"
                    >
                      <FaChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Gambar utama (flora/fauna) */}
                {selectedItem.images && selectedItem.images.length > 0 && (
                  <img
                    src={selectedItem.images[currentDetailImageIndex]?.image}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover object-center"
                  />
                )}

                {/* Counter foto */}
                {selectedItem.images && selectedItem.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 text-sm rounded">
                    {currentDetailImageIndex + 1} / {selectedItem.images.length}
                  </div>
                )}
              </div>

              {/* Bagian kanan: konten teks */}
              <div className="flex flex-col h-full">
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">{selectedItem.title}</h2>

                {/* Deskripsi lengkap (HTML) */}
                <div
                  className="prose prose-lg overflow-y-auto custom-scrollbar max-h-[300px]"
                  dangerouslySetInnerHTML={{ __html: selectedItem.description }}
                />

                {/* Thumbnail kecil-kecil (opsional) */}
                {selectedItem.images && selectedItem.images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto">
                    {selectedItem.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentDetailImageIndex(idx);
                        }}
                        className={`relative w-16 h-16 rounded overflow-hidden border-2 ${
                          currentDetailImageIndex === idx
                            ? 'border-emerald-500'
                            : 'border-transparent'
                        }`}
                      >
                        <img
                          src={img.image}
                          alt={`Thumb ${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * 1. showDetail: bool
 * 2. selectedItem: shape({ title, description, images: arrayOf(...) })
 * 3. detailItems: arrayOf(...) jika perlu
 * 4. currentDetailImageIndex: number
 * 5. setShowDetail, handlePrevDetail, handleNextDetail, handlePrevDetailImage, handleNextDetailImage, setCurrentDetailImageIndex: func
 */
ModalDetail.propTypes = {
  showDetail: PropTypes.bool.isRequired,
  selectedItem: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        image: PropTypes.string,
      })
    ),
  }),
  detailItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          image: PropTypes.string,
        })
      ),
    })
  ),
  currentDetailImageIndex: PropTypes.number.isRequired,
  setShowDetail: PropTypes.func.isRequired,
  handlePrevDetail: PropTypes.func.isRequired,
  handleNextDetail: PropTypes.func.isRequired,
  handlePrevDetailImage: PropTypes.func.isRequired,
  handleNextDetailImage: PropTypes.func.isRequired,
  setCurrentDetailImageIndex: PropTypes.func.isRequired,
};

ModalDetail.defaultProps = {
  showDetail: false,
  selectedItem: {
    title: '',
    description: '',
    images: [],
  },
  detailItems: [],
  currentDetailImageIndex: 0,
};

export default ModalDetail;
