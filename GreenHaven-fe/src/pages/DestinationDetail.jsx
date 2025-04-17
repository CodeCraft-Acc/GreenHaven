// pages/DestinationDetail.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaLeaf, FaArrowLeft, FaTree, FaPaw } from 'react-icons/fa';
import PropTypes from 'prop-types';

import Navbar from '../components/Navbar';
import MenuOverlay from '../components/MenuOverlay';
import ChatBot from '../components/ChatBot';

// Komponen baru yang kita pecah
import GalleryOverlay from '../pages/GalleryOverlay';
import ModalDetail from '../pages/ModalDetail';
import Footer from '../pages/Footer';
import LocationInfoMap from '../pages/LocationMap'; // Import komponen baru
import RouteMap from './RouteMap';

// Variants animasi page
const pageTransitionVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

function DestinationDetail() {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Gallery (untuk foto-foto destinasi)
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // State untuk modal fauna/flora
  const [showDetail, setShowDetail] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [detailItems, setDetailItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // -- STATE BARU UNTUK SLIDER GAMBAR DI FLORA/FAUNA --
  const [currentDetailImageIndex, setCurrentDetailImageIndex] = useState(0);

  const [showRouteModal, setShowRouteModal] = useState(false);

  const menuItems = [
    { number: '01', label: 'Home' },
    { number: '02', label: 'Destinations' },
    { number: '03', label: 'Experiences' },
    { number: '04', label: 'Sustainability' },
    { number: '05', label: 'Reviews' },
    { number: '06', label: 'Contact' },
  ];

  // Untuk navigasi gambar di gallery destinasi
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? destination.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === destination.images.length - 1 ? 0 : prev + 1));
  };

  // Fetch detail destinasi dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://greenhaven.aisma.co.id/api/destinations/');
        const data = await response.json();
        const found = data.find((d) => d.slug === slug);
        setDestination(found);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Keydown utk navigasi galeri destinasi
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

  // Tombol "Prev" dan "Next" di modal fauna/flora (untuk berpindah antar fauna/flora)
  const handlePrevDetail = () => {
    if (!detailItems || detailItems.length === 0) return;
    const newIndex = (selectedIndex - 1 + detailItems.length) % detailItems.length;
    setSelectedIndex(newIndex);
    setSelectedItem(detailItems[newIndex]);
    // Reset gambar fauna/flora ke index 0 setiap kali ganti fauna/flora
    setCurrentDetailImageIndex(0);
  };

  const handleNextDetail = () => {
    if (!detailItems || detailItems.length === 0) return;
    const newIndex = (selectedIndex + 1) % detailItems.length;
    setSelectedIndex(newIndex);
    setSelectedItem(detailItems[newIndex]);
    // Reset gambar fauna/flora ke index 0 setiap kali ganti fauna/flora
    setCurrentDetailImageIndex(0);
  };

  // Setel ulang index gambar fauna/flora ke 0 setiap kali selectedItem berubah
  useEffect(() => {
    setCurrentDetailImageIndex(0);
  }, [selectedItem]);

  // Navigasi gambar flora/fauna
  const handlePrevDetailImage = (e) => {
    e.stopPropagation(); // Mencegah event bubbling ke parent
    if (!selectedItem?.images) return;
    setCurrentDetailImageIndex((prev) => (prev === 0 ? selectedItem.images.length - 1 : prev - 1));
  };

  const handleNextDetailImage = (e) => {
    e.stopPropagation(); // Mencegah event bubbling ke parent
    if (!selectedItem?.images) return;
    setCurrentDetailImageIndex((prev) => (prev === selectedItem.images.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <button className="btn">
          <span className="loading loading-spinner"></span>
          loading
        </button>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Destinasi tidak ditemukan</h2>
          <Link to="/destinations" className="text-emerald-600 hover:text-emerald-700">
            Kembali ke daftar destinasi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-white"
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <AnimatePresence>
        {isMenuOpen && <MenuOverlay menuItems={menuItems} setIsMenuOpen={setIsMenuOpen} />}
      </AnimatePresence>

      {/* Hero Section with Main Image */}
      <div className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img
          src={destination.images?.[0]?.image}
          alt={destination.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Back Button */}
        <Link
          to="/destinations"
          className="absolute top-10 left-8 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white hover:bg-white/20 transition-all duration-300"
        >
          <FaArrowLeft /> Kembali
        </Link>

        {/* Title Section */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/80 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm mb-4">
              <FaLeaf className="w-4 h-4" />
              <span>Wisata Alam</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {destination.title}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl line-clamp-3">
              {destination.description?.replace(/<[^>]+>/g, '').split('\r\n')[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Detail Deskripsi */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">Tentang</h2>
              <div
                className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: destination.description }}
              />
            </div>

            {/* Galeri Foto untuk Mobile */}
            <div className="lg:hidden bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Galeri Foto</h3>
              <div className="grid grid-cols-2 gap-3">
                {destination.images?.map((image, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl overflow-hidden aspect-square cursor-pointer"
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setShowGallery(true);
                    }}
                  >
                    <img
                      src={image.image}
                      alt={`${destination.title} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Flora & Fauna - Hanya tampil di mobile */}
            <div className="lg:hidden bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Flora & Fauna</h3>
              <div className="space-y-3">
                {/* Flora */}
                <button
                  onClick={() => {
                    setDetailItems(destination.flora || []);
                    setSelectedIndex(0);
                    setSelectedItem((destination.flora || [])[0]);
                    setShowDetail(true);
                  }}
                  className="w-full group bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 p-4 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                      <FaTree className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Flora</span>
                        <span className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-sm">
                          {destination.flora?.length || 0} Spesies
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Lihat daftar flora yang ada di sini
                      </p>
                    </div>
                  </div>
                </button>

                {/* Fauna */}
                <button
                  onClick={() => {
                    setDetailItems(destination.fauna || []);
                    setSelectedIndex(0);
                    setSelectedItem((destination.fauna || [])[0]);
                    setShowDetail(true);
                  }}
                  className="w-full group bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 p-4 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                      <FaPaw className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Fauna</span>
                        <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm">
                          {destination.fauna?.length || 0} Spesies
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Lihat daftar fauna yang ada di sini
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Guides Section */}
            {destination.guides && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Guides</h3>
                <div
                  className="prose prose-lg max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: destination.guides }}
                />
              </div>
            )}

            {/* Location Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div
                className="cursor-pointer rounded-xl overflow-hidden"
                onClick={() => setShowRouteModal(true)}
              >
                <LocationInfoMap destination={destination} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Galeri Foto untuk Desktop */}
            <div className="hidden lg:block bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Galeri Foto</h3>
              <div className="grid grid-cols-2 gap-3">
                {destination.images?.map((image, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl overflow-hidden aspect-square cursor-pointer"
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setShowGallery(true);
                    }}
                  >
                    <img
                      src={image.image}
                      alt={`${destination.title} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Flora & Fauna - Hanya tampil di desktop */}
            <div className="hidden lg:block bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Flora & Fauna</h3>
              <div className="space-y-3">
                {/* Flora */}
                <button
                  onClick={() => {
                    setDetailItems(destination.flora || []);
                    setSelectedIndex(0);
                    setSelectedItem((destination.flora || [])[0]);
                    setShowDetail(true);
                  }}
                  className="w-full group bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 p-4 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                      <FaTree className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Flora</span>
                        <span className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-sm">
                          {destination.flora?.length || 0} Spesies
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Lihat daftar flora yang ada di sini
                      </p>
                    </div>
                  </div>
                </button>

                {/* Fauna */}
                <button
                  onClick={() => {
                    setDetailItems(destination.fauna || []);
                    setSelectedIndex(0);
                    setSelectedItem((destination.fauna || [])[0]);
                    setShowDetail(true);
                  }}
                  className="w-full group bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 p-4 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                      <FaPaw className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Fauna</span>
                        <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm">
                          {destination.fauna?.length || 0} Spesies
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Lihat daftar fauna yang ada di sini
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Informasi</h3>
              <div className="space-y-4">
                {destination.location && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Lokasi</div>
                    <div className="text-gray-900">{destination.location}</div>
                  </div>
                )}
                {destination.open_hours && destination.close_hours && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Jam Operasional</div>
                    <div className="text-gray-900">
                      {destination.open_hours.slice(0, 5)} - {destination.close_hours.slice(0, 5)}
                      WIB
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Overlay (foto destinasi) */}
      <GalleryOverlay
        showGallery={showGallery}
        destination={destination}
        currentImageIndex={currentImageIndex}
        handlePrevImage={handlePrevImage}
        handleNextImage={handleNextImage}
        setShowGallery={setShowGallery}
        setCurrentImageIndex={setCurrentImageIndex}
      />

      {/* Detail Modal (Fauna/Flora) */}
      <ModalDetail
        showDetail={showDetail}
        selectedItem={selectedItem}
        detailItems={detailItems}
        currentDetailImageIndex={currentDetailImageIndex}
        setShowDetail={setShowDetail}
        handlePrevDetail={handlePrevDetail}
        handleNextDetail={handleNextDetail}
        handlePrevDetailImage={handlePrevDetailImage}
        handleNextDetailImage={handleNextDetailImage}
        setCurrentDetailImageIndex={setCurrentDetailImageIndex}
      />

      {/* Hide ChatBot when gallery is showing */}
      <div
        className={`transition-opacity duration-300 ${
          showGallery ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <ChatBot isMenuOpen={isMenuOpen} />
      </div>

      {/* Footer */}
      <Footer />

      {/* Route Modal */}
      <AnimatePresence>
        {showRouteModal && (
          <RouteMap destination={destination} setShowRouteModal={setShowRouteModal} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

DestinationDetail.propTypes = {
  destination: PropTypes.shape({
    is_vegetarian: PropTypes.bool,
    is_vegan: PropTypes.bool,
    is_halal: PropTypes.bool,
    is_gluten_free: PropTypes.bool,
    accepts_cards: PropTypes.bool,
    serves_lunch: PropTypes.bool,
    serves_dinner: PropTypes.bool,
    serves_brunch: PropTypes.bool,
    has_parking: PropTypes.bool,
  }).isRequired,
};

export default DestinationDetail;
