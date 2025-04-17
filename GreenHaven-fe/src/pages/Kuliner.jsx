import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiSearch } from 'react-icons/fi';
import { FaLeaf, FaTimes, FaUtensils } from 'react-icons/fa';
import RollingText from '../components/RollingText';
import MenuOverlay from '../components/MenuOverlay';
import ChatBot from '../components/ChatBot';
import 'remixicon/fonts/remixicon.css';
import './FloraFauna.css';
import Footer from '../pages/Footer';

const navItems = [
  { href: '#home', label: 'Home', action: () => (window.location.href = '/') },
  {
    href: '#destination',
    label: 'Destination',
    action: () => {
      window.location.href = '/destinations';
    },
  },
  {
    href: '#kuliner',
    label: 'Kuliner',
    action: () => {
      window.location.href = '/kuliner';
    },
  },
  {
    href: '#health',
    label: 'Health',
    action: () => {
      window.location.href = '/health';
    },
  },
];

const pageTransitionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.5,
    },
  },
};

function Kuliner() {
  const [kuliner, setKuliner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

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
        setKuliner(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = kuliner.filter((item) => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0, 1],
      },
    },
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

      {/* Hero Section */}
      <div className="relative h-[60vh] bg-emerald-900 overflow-hidden">
        {/* Logo */}
        <div
          className={`absolute top-10 left-10 z-[55] transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            <FaLeaf className="w-6 h-6" />
            <span className="hidden lg:inline">GreenHaven</span>
          </div>
        </div>

        {/* Navigation */}
        <div
          className={`absolute top-9 left-1/2 -translate-x-1/2 hidden lg:block z-[65] transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="navbar-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-8 py-3">
              <div className="flex gap-4 relative">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.action) {
                        item.action();
                      }
                    }}
                    className="group text-gray-700 hover:text-emerald-800 transition-colors duration-300 relative z-[70]"
                    aria-label={item.label}
                  >
                    <RollingText text={item.label} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-10" />

        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">Kuliner</h1>
            <p className="text-xl md:text-2xl text-white/90">Jelajahi Cita Rasa Khas Kota Bogor</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <motion.div
        className="bg-white shadow-lg rounded-3xl -mt-10 mx-4 lg:mx-auto max-w-7xl relative z-30 p-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari kuliner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.slug}
              variants={itemVariants}
              className="bg-gray-50 hover:bg-white shadow-lg rounded-[2rem] p-8 w-full h-full flex flex-col group transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.1)] relative overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => {
                window.location.href = `/kuliner/${item.slug}`;
              }}
            >
              <div className="absolute inset-0 bg-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-emerald-800 text-lg font-medium">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-emerald-400 text-sm flex items-center gap-2">
                    <FaUtensils className="w-4 h-4" /> Kuliner
                  </span>
                </div>
                <div className="overflow-hidden rounded-xl mb-6 aspect-video">
                  <img
                    src={item.images[0]?.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                {/* Deskripsi Singkat (HTML) */}
                <p
                  className="text-gray-600 leading-relaxed mb-6 flex-grow line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-800 group-hover:text-emerald-800 transition-colors">
                  Read More
                </span>
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <i className="ri-arrow-right-up-line text-xl text-emerald-800" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl text-gray-600 mb-4">Tidak ada data yang ditemukan</h3>
            <p className="text-gray-500">Coba ubah kata kunci pencarian</p>
          </div>
        )}
      </motion.div>

      <ChatBot isMenuOpen={isMenuOpen} />
      <Footer />
    </motion.div>
  );
}

export default Kuliner;
