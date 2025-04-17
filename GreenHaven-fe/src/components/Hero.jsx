import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { HiArrowDown } from 'react-icons/hi';
import { useState, useEffect, useRef } from 'react';
import TypewriterText from './TypewriterText';
import RollingText from './RollingText';
import { FaLeaf } from 'react-icons/fa';
import PropTypes from 'prop-types';

const navItems = [
  { href: '#home', label: 'Home', action: () => window.location.reload() },
  {
    href: '#about-section',
    label: 'About',
    action: () => {
      const aboutSection = document.getElementById('about-section');
      aboutSection?.scrollIntoView({ behavior: 'smooth' });
    },
  },
  {
    href: '#destination',
    label: 'Destination',
    action: () => {
      const greenCampaignSection = document.getElementById('green-campaign-section');
      greenCampaignSection?.scrollIntoView({ behavior: 'smooth' });
    },
  },
  {
    href: '#contact',
    label: 'Contact',
    action: () => {
      const lastPageSection = document.getElementById('last-page-section');
      lastPageSection?.scrollIntoView({ behavior: 'smooth' });
    },
  },
];

function Hero({ scrollToNextSection, isSplashComplete }) {
  const ecoTitles = ['WISATA', 'KULINER', 'PETUALANGAN', 'KESEHATAN'];
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  // Tambahkan config untuk efek 3D yang lebih kuat
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const containerRef = useRef(null);

  // Transform dengan range yang lebih besar untuk efek 3D
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Rotasi yang lebih ekstrim untuk efek 3D
  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);
  const scale = useTransform(mouseX, [-0.5, 0, 0.5], [0.95, 1, 0.95]);

  // Update mouse handler untuk efek 3D yang lebih smooth
  const handleMouseMove = (event) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.x + rect.width / 2;
      const centerY = rect.y + rect.height / 2;

      mouseX.set((event.clientX - centerX) / rect.width);
      mouseY.set((event.clientY - centerY) / rect.height);
    }
  };

  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % ecoTitles.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [ecoTitles.length]);

  // Add scroll handler
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero-section"
      className="relative min-h-screen h-screen w-full flex items-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      <div className="absolute inset-4 bg-emerald-800 rounded-3xl flex items-center pointer-events-none">
        {/* Logo */}
        <div className="absolute top-10 left-10 z-[55] pointer-events-auto">
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            <FaLeaf className="w-6 h-6" />
            <span className="hidden lg:inline">GreenHaven</span>
          </div>
        </div>

        {/* Navigation - Hidden until large screens */}
        <div className="absolute top-9 left-1/2 -translate-x-1/2 hidden lg:block z-[65] pointer-events-auto">
          <div className="navbar-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-12 py-3">
              <div className="flex gap-6 relative">
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

        {/* Hero Content Container dengan Grid */}
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen">
          {/* Left Side - Hero Content */}
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isSplashComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <h1 className="text-[4rem] md:text-[6rem] font-light leading-none text-white">
                {/* DISCOVER Text */}
                <div className="mb-4 overflow-hidden">
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={isSplashComplete ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.8,
                    }}
                  >
                    DISCOVER
                  </motion.div>
                </div>

                {/* BOGOR'S Text with background */}
                <div className="flex md:items-center gap-4 flex-col md:flex-row">
                  <div className="relative">
                    <motion.button
                      onClick={scrollToAbout}
                      whileTap={{ scale: 0.95 }}
                      className="hidden md:flex w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-700 border border-white items-center justify-center transition-colors duration-300 relative cursor-pointer"
                    >
                      <HiArrowDown className="w-10 h-10 text-white animate-arrow-updown" />
                      {/* Shockwave Rings */}
                      <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-shockwave-1" />
                      <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-shockwave-2" />
                      <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-shockwave-3" />
                    </motion.button>
                  </div>
                  <div className="relative overflow-hidden ml-auto md:ml-0">
                    {/* Text */}
                    <motion.span
                      className="text-[5rem] md:text-[7rem] font-bold block px-4 relative z-10"
                      initial={{ x: 100, opacity: 0 }}
                      animate={isSplashComplete ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 1.4,
                      }}
                    >
                      <i>B</i>OGOR
                    </motion.span>
                    {/* Static Background */}
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 1.2,
                      }}
                    />
                    {/* Sweeping Background */}
                    <motion.div
                      className="absolute inset-0 bg-white z-20"
                      initial={{
                        x: '100%',
                      }}
                      animate={{
                        x: '-100%',
                      }}
                      transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 1,
                      }}
                    />
                  </div>
                </div>

                {/* Typewriter Text */}
                <div className="relative">
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={isSplashComplete ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 2.0,
                    }}
                  >
                    <TypewriterText text={ecoTitles[currentTitleIndex]} />
                  </motion.div>
                  <div className="flex flex-col md:hidden">
                    <div className="flex items-center gap-4 mt-6">
                      <motion.button
                        onClick={scrollToAbout}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 border border-white flex items-center justify-center transition-colors duration-300 relative cursor-pointer"
                      >
                        <HiArrowDown className="w-8 h-8 text-white animate-arrow-updown" />
                        {/* Mobile Shockwave Rings */}
                        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-shockwave-1" />
                        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-shockwave-2" />
                        <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-shockwave-3" />
                      </motion.button>
                      <div className="flex-1 relative">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-1 bg-white/30 w-full"
                        />
                        <div className="absolute right-0 -top-8 text-white/50 text-sm uppercase">
                          Scroll
                        </div>
                        <div className="absolute right-0 -bottom-8 text-white/50 text-sm uppercase">
                          Down
                        </div>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute -bottom-4 left-0 w-3/4 h-1 bg-white/30 hidden md:block"
                  />
                </div>
              </h1>

              {/* Rating Section */}
              <div className="flex items-center gap-4 text-white/90 mt-8 flex-wrap">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-emerald-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xl font-medium">4.9</span>
                <span className="px-2 py-1 bg-emerald-700/50 rounded text-sm">ECO CERTIFIED</span>
                <span className="text-sm md:text-base">
                  Dipercaya oleh 1000+ Wisatawan Pecinta Alam
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Tree SVG */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isSplashComplete ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 2.4 }}
            style={{
              rotateX: rotateX,
              rotateY: rotateY,
              scale: scale,
              perspective: 1500,
              transformStyle: 'preserve-3d',
            }}
            className="hidden lg:flex justify-center items-center relative"
          >
            {/* Tree Image dengan efek 3D */}
            <motion.img
              src="/img/tree.svg"
              alt="Decorative Tree"
              className="w-[80%] max-w-[500px] h-auto relative"
              style={{
                translateZ: 100,
                translateX: useTransform(x, [-0.5, 0.5], [-30, 30]),
                translateY: useTransform(y, [-0.5, 0.5], [-30, 30]),
              }}
            />

            {/* Tambahkan shadow yang lebih dinamis */}
            <motion.div
              className="absolute bottom-0 w-[60%] h-[20px] bg-black/20 blur-xl rounded-full"
              style={{
                scale: useTransform(y, [-0.5, 0.5], [0.8, 1.2]),
                translateX: useTransform(x, [-0.5, 0.5], [30, -30]),
                translateY: useTransform(y, [-0.5, 0.5], [30, -30]),
              }}
            />

            {/* Optional: Tambahkan particle effects */}
            <motion.div className="absolute inset-0 overflow-hidden" style={{ perspective: 1000 }}>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-emerald-200/30 rounded-full"
                  style={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    translateZ: Math.random() * 200,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

Hero.propTypes = {
  scrollToNextSection: PropTypes.func.isRequired,
  isSplashComplete: PropTypes.bool.isRequired,
};

export default Hero;
