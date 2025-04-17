import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaUtensils } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import MenuOverlay from '../components/MenuOverlay';
import ChatBot from '../components/ChatBot';
import Footer from '../pages/Footer';
import LocationInfoMap from '../pages/LocationMap';
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

function KulinerDetail() {
  const { slug } = useParams();
  const [kuliner, setKuliner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        const response = await fetch('https://greenhaven.aisma.co.id/api/kuliner/');
        const data = await response.json();
        const found = data.find((k) => k.slug === slug);
        setKuliner(found);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Fungsi untuk memformat harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price * 1000); // Kalikan 1000 karena harga dalam ribuan
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? kuliner.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === kuliner.images.length - 1 ? 0 : prev + 1));
  };

  if (loading || !kuliner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
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
          src={kuliner.images?.[0]?.image}
          alt={kuliner.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Back Button */}
        <Link
          to="/kuliner"
          className="absolute top-10 left-8 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white hover:bg-white/20 transition-all duration-300"
        >
          <FaArrowLeft /> Kembali
        </Link>

        {/* Title Section */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-orange-500/80 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm mb-4">
              <FaUtensils className="w-4 h-4" />
              <span>Kuliner</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {kuliner.title}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl line-clamp-3">
              {kuliner.description?.replace(/<[^>]+>/g, '').split('\r\n')[0]}
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
                dangerouslySetInnerHTML={{ __html: kuliner.description }}
              />
            </div>

            {/* Galeri Foto untuk Mobile */}
            <div className="lg:hidden bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Galeri Foto</h3>
              <div className="grid grid-cols-2 gap-3">
                {kuliner.images?.map((image, index) => (
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
                      alt={`${kuliner.title} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Section */}
            {kuliner.list_menu && kuliner.list_menu.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">Menu</h2>
                <div
                  className={`space-y-4 ${
                    kuliner.list_menu.length > 6
                      ? 'max-h-[400px] overflow-y-auto pr-4 custom-scrollbar'
                      : ''
                  }`}
                >
                  {kuliner.list_menu.map((menu, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-gray-800 font-medium">{menu.list_menu}</span>
                      <span className="text-emerald-600 font-semibold">
                        {formatPrice(menu.harga)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guides Section */}
            {kuliner.guides && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Guides</h3>
                <div
                  className="prose prose-lg max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: kuliner.guides }}
                />
              </div>
            )}

            {/* Location Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="cursor-pointer rounded-xl overflow-hidden">
                <LocationInfoMap destination={kuliner} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Galeri Foto untuk Desktop */}
            <div className="hidden lg:block bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Galeri Foto</h3>
              <div className="grid grid-cols-2 gap-3">
                {kuliner.images?.map((image, index) => (
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
                      alt={`${kuliner.title} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Informasi</h3>
              <div className="space-y-4">
                {kuliner.location && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Lokasi</div>
                    <div className="text-gray-900">{kuliner.location}</div>
                  </div>
                )}
                {kuliner.open_hours && kuliner.close_hours && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Jam Operasional</div>
                    <div className="text-gray-900">
                      {kuliner.open_hours.slice(0, 5)} - {kuliner.close_hours.slice(0, 5)} WIB
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

      <GalleryOverlay
        showGallery={showGallery}
        destination={kuliner}
        currentImageIndex={currentImageIndex}
        handlePrevImage={handlePrevImage}
        handleNextImage={handleNextImage}
        setShowGallery={setShowGallery}
        setCurrentImageIndex={setCurrentImageIndex}
      />
    </motion.div>
  );
}

export default KulinerDetail;
