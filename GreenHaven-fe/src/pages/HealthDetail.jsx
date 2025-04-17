import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaHospital } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import MenuOverlay from '../components/MenuOverlay';
import ChatBot from '../components/ChatBot';
import Footer from '../pages/Footer';
import LocationInfoMap from '../pages/LocationMap';
import RouteMap from './RouteMap';
import GalleryOverlay from '../pages/GalleryOverlay';

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

function HealthDetail() {
  const { slug } = useParams();
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const menuItems = [
    { number: '01', label: 'Home' },
    { number: '02', label: 'Destinations' },
    { number: '03', label: 'Kuliner' },
    { number: '04', label: 'Health' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://greenhaven.aisma.co.id/api/health/');
        const data = await response.json();
        const found = data.find((h) => h.slug === slug);
        setHealth(found);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? health.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === health.images.length - 1 ? 0 : prev + 1));
  };

  if (loading || !health) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
          src={health.images?.[0]?.image}
          alt={health.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Back Button */}
        <Link
          to="/health"
          className="absolute top-10 left-8 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white hover:bg-white/20 transition-all duration-300"
        >
          <FaArrowLeft /> Kembali
        </Link>

        {/* Title Section */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/80 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm mb-4">
              <FaHospital className="w-4 h-4" />
              <span>Fasilitas Kesehatan</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {health.title}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl line-clamp-3">
              {health.description?.replace(/<[^>]+>/g, '').split('\r\n')[0]}
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
                dangerouslySetInnerHTML={{ __html: health.description }}
              />
            </div>

            {/* Galeri Foto untuk Mobile */}
            <div className="lg:hidden bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Galeri Foto</h3>
              <div className="grid grid-cols-2 gap-3">
                {health.images?.map((image, index) => (
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
                      alt={`${health.title} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Fasilitas Section */}
            {health.fasilitas && health.fasilitas.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">Fasilitas</h2>
                <div
                  className={`space-y-2 ${health.fasilitas.length > 4 ? 'max-h-[320px] overflow-y-auto pr-4 custom-scrollbar' : ''}`}
                >
                  {health.fasilitas.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">{item.fasilitas}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guides Section - Hanya tampil di mobile */}
            {health.guides && (
              <div className="lg:hidden bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Guides</h3>
                <div
                  className="prose prose-lg max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: health.guides }}
                />
              </div>
            )}

            {/* Location Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div
                className="cursor-pointer rounded-xl overflow-hidden"
                onClick={() => setShowRouteModal(true)}
              >
                <LocationInfoMap destination={health} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Galeri Foto untuk Desktop */}
            <div className="hidden lg:block bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Galeri Foto</h3>
              <div className="grid grid-cols-2 gap-3">
                {health.images?.map((image, index) => (
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
                      alt={`${health.title} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Guides Section - Hanya tampil di desktop */}
            {health.guides && (
              <div className="hidden lg:block bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Guides</h3>
                <div
                  className="prose prose-lg max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: health.guides }}
                />
              </div>
            )}

            {/* Info Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Informasi</h3>
              <div className="space-y-4">
                {health.location && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Lokasi</div>
                    <div className="text-gray-900">{health.location}</div>
                  </div>
                )}
                {health.open_hours && health.close_hours && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Jam Operasional</div>
                    <div className="text-gray-900">
                      {health.open_hours.slice(0, 5)} - {health.close_hours.slice(0, 5)} WIB
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChatBot isMenuOpen={isMenuOpen} />
      <Footer />

      {/* Route Modal */}
      <AnimatePresence>
        {showRouteModal && <RouteMap destination={health} setShowRouteModal={setShowRouteModal} />}
      </AnimatePresence>

      {/* Tambahkan GalleryOverlay */}
      <GalleryOverlay
        showGallery={showGallery}
        destination={health}
        currentImageIndex={currentImageIndex}
        handlePrevImage={handlePrevImage}
        handleNextImage={handleNextImage}
        setShowGallery={setShowGallery}
        setCurrentImageIndex={setCurrentImageIndex}
      />
    </motion.div>
  );
}

export default HealthDetail;
