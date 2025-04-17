import { motion } from 'framer-motion';
import { FaTree } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RollingText from './RollingText';

function AboutSection() {
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Refs for scroll animations
  const textRef = useRef(null);
  const headingRef = useRef(null);
  const projectsRef = useRef(null);
  const highlightRef = useRef(null);
  const projectButtonRef = useRef(null);

  // Check if elements are in view
  const isTextInView = useInView(textRef, { once: true, margin: '-100px' });
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-100px' });
  const isProjectsInView = useInView(projectsRef, { once: true, margin: '-100px' });
  const isHighlightInView = useInView(highlightRef, { once: true, margin: '-100px' });
  const isProjectButtonInView = useInView(projectButtonRef, { once: true, margin: '-100px' });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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

  // Add new animation variants for cards
  const carouselVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      x: -100,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const navigate = useNavigate();

  return (
    <section id="about-section" className="min-h-screen bg-white">
      {/* Marquee Container */}
      <div className="w-full overflow-hidden bg-emerald-100 border-y border-emerald-300">
        <div className="relative flex overflow-x-hidden">
          <div className="py-3 flex animate-marquee whitespace-nowrap">
            {[...Array(25)].map((_, idx) => (
              <div
                key={idx}
                className="flex items-center mx-4 text-emerald-800 text-lg font-medium"
              >
                <FaTree className="w-5 h-5 mr-3" />
                <span>Welcome to GreenHaven</span>
              </div>
            ))}
          </div>
          <div className="py-3 flex animate-marquee2 whitespace-nowrap absolute top-0">
            {[...Array(25)].map((_, idx) => (
              <div
                key={idx}
                className="flex items-center mx-4 text-emerald-800 text-lg font-medium"
              >
                <FaTree className="w-5 h-5 mr-3" />
                <span>Welcome to GreenHaven</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 lg:px-24 py-24">
        <motion.div
          className="grid lg:grid-cols-2 gap-16 mb-32"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column */}
          <motion.div
            ref={textRef}
            style={{
              transform: isTextInView ? 'none' : 'translateX(-200px)',
              opacity: isTextInView ? 1 : 0,
              transition: 'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
            }}
          >
            <p className="text-gray-600 text-xl leading-relaxed mb-6">
              Bogor, kota yang dikenal dengan Kebun Raya nya yang megah, menawarkan berbagai
              destinasi wisata alam yang memukau dan pengalaman kuliner yang tak terlupakan.
            </p>
            <img
              src="/img/trip.svg"
              alt="Trip Illustration"
              className="w-full max-w-[300px] h-auto hover:scale-125 transition-all duration-1000 ease-in-out"
            />
          </motion.div>

          {/* Right Column */}
          <motion.div
            ref={headingRef}
            style={{
              transform: isHeadingInView ? 'none' : 'translateX(200px)',
              opacity: isHeadingInView ? 1 : 0,
              transition: 'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
            }}
          >
            <h2 className="text-[4rem] leading-tight font-normal mb-12">
              Temukan keindahan alam, kuliner, dan petualangan di Kota Hujan.
            </h2>
            {/* Buttons with hover animation */}
            <div className="flex gap-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-emerald-200 rounded-full px-8 py-3 relative overflow-hidden"
                onClick={() => navigate('/destinations')}
              >
                <div className="relative z-20">
                  <span className="text-emerald-800 group-hover:text-white transition-colors duration-500">
                    <RollingText text="Ayo Petualangan" isButton />
                  </span>
                </div>
                <div className="absolute inset-0 w-full bg-emerald-800 rounded-full z-10 transform translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0" />
              </motion.button>
              <motion.button
                whileHover={{ x: 10 }}
                className="flex items-center gap-2 text-emerald-800 hover:text-emerald-950 transition-colors duration-700"
                onClick={() => navigate('/destinations')}
              >
                Lihat Destinasi <HiArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Our Projects Button */}
        <motion.div
          ref={projectButtonRef}
          initial={{ x: -100, opacity: 0 }}
          animate={isProjectButtonInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="group border border-emerald-300 rounded-full px-8 py-3 text-emerald-800 relative overflow-hidden w-fit mb-16"
            onClick={() => navigate('/destinations')}
          >
            <div className="relative z-20">
              <RollingText text="Destinations" isButton />
            </div>
            <motion.div className="absolute inset-0 w-full bg-emerald-100 transform -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-0 rounded-full z-10" />
            <motion.div
              initial={{ x: '-100%' }}
              animate={isProjectButtonInView ? { x: '100%' } : { x: '-100%' }}
              transition={{
                duration: 1.5,
                ease: 'easeOut',
                delay: 0.5,
              }}
              className="absolute inset-0 w-full bg-emerald-200 rounded-full z-10"
            />
          </motion.button>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          ref={projectsRef}
          variants={containerVariants}
          initial="hidden"
          animate={isProjectsInView ? 'visible' : 'hidden'}
        >
          <motion.h3
            variants={itemVariants}
            className="text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] 
                       leading-tight font-normal 
                       mb-8 sm:mb-12 lg:mb-16 
                       max-w-full lg:max-w-[90%]
                       px-2 sm:px-0"
          >
            Jelajahi keindahan alam Kota Hujan, dari{' '}
            <motion.span
              ref={highlightRef}
              className="inline-block relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className="relative z-10 px-2 sm:px-4 lg:px-6 py-0.5 sm:py-1">
                taman botani hingga wisata pegunungan
              </span>
              <motion.div
                className="absolute inset-0 bg-emerald-200 rounded-full -z-0"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isHighlightInView ? 1 : 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  originX: 0.5,
                  transformOrigin: 'center',
                }}
              />
            </motion.span>{' '}
            yang menawarkan pengalaman wisata alam tak terlupakan.
          </motion.h3>

          {/* Projects Carousel with enhanced animations */}
          <motion.div
            className="carousel w-full gap-8 flex-col lg:flex-row"
            variants={carouselVariants}
            initial="hidden"
            animate={isProjectsInView ? 'visible' : 'hidden'}
          >
            {/* Project Card 1 */}
            <motion.div
              variants={cardVariants}
              className={`carousel-item w-full lg:w-[25%] transition-all duration-1000 ease-out mb-8 lg:mb-0 ${
                isCardHovered ? 'lg:w-[25%]' : 'lg:w-[50%]'
              }`}
              onClick={() => navigate('/destinations')}
              style={{ cursor: 'pointer' }}
            >
              <div className="bg-gray-50 rounded-[2rem] p-8 w-full relative">
                <div className="flex flex-col lg:flex-row gap-8 lg:h-[300px]">
                  {/* Left Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-emerald-800 text-lg font-medium">01</span>
                      </div>
                      <h4 className="text-2xl font-normal mb-4">Hutan Kota Bogor</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Tim kami aktif melakukan perawatan dan pengembangan Hutan Kota sebagai
                        paru-paru kota dan destinasi edukasi lingkungan.
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4 lg:mt-0">
                      <span className="text-gray-800 hover:text-gray-600 transition-colors">
                        Read More
                      </span>
                      <div className="bg-emerald-100 p-2 rounded-full">
                        <HiArrowRight className="w-5 h-5 text-emerald-800" />
                      </div>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div
                    className={`hidden lg:block flex-1 overflow-hidden rounded-xl h-[300px] transition-all duration-1000 ${
                      isCardHovered ? 'lg:hidden' : ''
                    }`}
                  >
                    <img
                      src="https://asset.kompas.com/crops/ZSmQN5oXj1lAct3PRIU_fH3-cFg=/0x0:780x390/780x390/data/photo/2014/11/30/0921186tenda3780x390.jpg"
                      alt="Danube River Cleanup"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Project Card 2 */}
            <motion.div
              variants={cardVariants}
              className="carousel-item w-full lg:w-[25%] hover:lg:w-[50%] transition-all duration-1000 ease-out mb-8 lg:mb-0"
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={() => setIsCardHovered(false)}
              onClick={() => navigate('/destinations')}
              style={{ cursor: 'pointer' }}
            >
              <div className="bg-emerald-100 rounded-[2rem] p-8 flex flex-col justify-between min-h-[250px] lg:h-[400px] w-full relative">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-emerald-800 text-lg font-medium">02</span>
                  </div>
                  <h4 className="text-2xl font-normal mb-4">Kebun Raya Bogor</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Kebun Raya Bogor adalah landmark ikonik dengan koleksi tanaman tropis terlengkap
                    dan sejarah panjang sejak era kolonial Belanda.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 hover:text-gray-600 transition-colors">
                    Read More
                  </span>
                  <div className="bg-emerald-200 p-2 rounded-full">
                    <HiArrowRight className="w-5 h-5 text-emerald-800" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Project Card 3 */}
            <motion.div
              variants={cardVariants}
              className="carousel-item w-full lg:w-[25%] hover:lg:w-[50%] transition-all duration-1000 ease-out"
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={() => setIsCardHovered(false)}
              onClick={() => navigate('/kuliner')}
              style={{ cursor: 'pointer' }}
            >
              <div className="bg-emerald-100 rounded-[2rem] p-8 flex flex-col justify-between min-h-[250px] lg:h-[400px] w-full relative">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-emerald-800 text-lg font-medium">03</span>
                  </div>
                  <h4 className="text-2xl font-normal mb-4">Kuliner Khas</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Nikmati beragam kuliner khas Bogor, dari Toge Goreng hingga Asinan Bogor.
                    Temukan kelezatan makanan tradisional yang menjadi ciri khas Kota Hujan.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 hover:text-gray-600 transition-colors">
                    Read More
                  </span>
                  <div className="bg-emerald-200 p-2 rounded-full">
                    <HiArrowRight className="w-5 h-5 text-emerald-800" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;
