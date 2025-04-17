import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';
import RollingText from './RollingText';
import 'swiper/css';

const NewsGallery = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [newsItems, setNewsItems] = useState([]);
  const swiperRef = useRef(null);

  const handleCardClick = useCallback(
    (item) => {
      if (item.category.toLowerCase() === 'destination') {
        navigate(`/destination/${item.id}`);
      } else {
        navigate('/destinations');
      }
    },
    [navigate]
  );

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://greenhaven.aisma.co.id/api/latest-content/');
        const data = await response.json();

        // Transform API data to match our needs
        const transformedData = data.results.map((item, index) => ({
          id: item.data.slug,
          image: `https://greenhaven.aisma.co.id${item.data.images[0].image}`, // Get first image
          title: item.data.title,
          description: item.data.description,
          category: item.type.charAt(0).toUpperCase() + item.type.slice(1), // Capitalize type
        }));

        setNewsItems(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [hoveredCard, setHoveredCard] = useState(null);

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      x: 100,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  useEffect(() => {
    const swiper = new Swiper('.news-swiper', {
      modules: [Autoplay],
      slidesPerView: 1.2,
      spaceBetween: 20,
      centeredSlides: true,
      grabCursor: true,
      loop: true,
      speed: 5000,
      allowTouchMove: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        reverseDirection: false,
      },
      breakpoints: {
        768: {
          enabled: true,
          slidesPerView: 3,
          spaceBetween: 32,
          centeredSlides: false,
        },
      },
      on: {
        touchEnd: function () {
          setTimeout(() => {
            if (this && this.autoplay && this.autoplay.running === false && !this.destroyed) {
              this.autoplay.start();
            }
            if (this && !this.destroyed) {
              this.params.autoplay.reverseDirection = false;
              this.slideNext(1000);
            }
          }, 100);
        },
        slidePrevTransitionStart: function () {
          if (this && this.autoplay && this.autoplay.running === false && !this.destroyed) {
            this.slideNext(1000);
          }
        },
      },
    });

    swiperRef.current = swiper;

    const swiperContainer = document.querySelector('.news-swiper');
    const handleMouseEnter = () => {
      if (swiperRef.current && swiperRef.current.autoplay && !swiperRef.current.destroyed) {
        swiperRef.current.autoplay.stop();
      }
    };

    const handleMouseLeave = () => {
      if (swiperRef.current && swiperRef.current.autoplay && !swiperRef.current.destroyed) {
        swiperRef.current.params.autoplay.reverseDirection = false;
        swiperRef.current.autoplay.start();
      }
    };

    if (swiperContainer) {
      swiperContainer.addEventListener('mouseenter', handleMouseEnter);
      swiperContainer.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (swiperRef.current && swiperRef.current.autoplay) {
        swiperRef.current.autoplay.stop();
      }
      if (swiperRef.current && typeof swiperRef.current.destroy === 'function') {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
      if (swiperContainer) {
        swiperContainer.removeEventListener('mouseenter', handleMouseEnter);
        swiperContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [newsItems]);

  return (
    <section ref={sectionRef} className="relative bg-[#E6F4EA] py-32 overflow-hidden">
      <div className="relative container mx-auto px-4">
        {/* Header with Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8"
        >
          <motion.div variants={itemVariants}>
            <p className="text-emerald-800 text-sm mb-4">05 — GreenHaven Tourism</p>
            <h2 className="text-emerald-950 text-4xl md:text-5xl font-medium">
              Update tentang
              <br className="hidden md:block" />
              Bogor
            </h2>
          </motion.div>

          <motion.div variants={itemVariants} className="relative w-full md:w-auto">
            <div className="group relative">
              <input
                type="text"
                placeholder="Discover GreenHaven..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-[300px] bg-transparent border-b border-emerald-800/30 text-emerald-950 px-4 py-2 pr-10 focus:outline-none focus:border-emerald-800/60 placeholder:text-emerald-800/50 transition-colors"
              />
              <motion.div
                whileHover={{ x: 5 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-800 group-hover:text-emerald-950 transition-colors"
              >
                <i className="ri-arrow-right-up-line" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* News Grid/Slider with Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="news-swiper overflow-visible mb-16 cursor-grab active:cursor-grabbing"
        >
          <div className="swiper-wrapper">
            {newsItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="swiper-slide h-full"
                style={{ userSelect: 'none' }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                  onClick={() => handleCardClick(item)}
                >
                  <div className="bg-gray-50 hover:bg-white rounded-[2rem] p-8 w-full h-full flex flex-col group transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.1)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-emerald-800 text-lg font-medium">0{index + 1}</span>
                        <span className="text-emerald-400 text-sm">{item.category}</span>
                      </div>

                      <div className="overflow-hidden rounded-xl mb-6 aspect-video">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        />
                      </div>

                      <h4 className="text-2xl font-normal mb-4 group-hover:text-emerald-800 transition-colors">
                        {item.title}
                      </h4>

                      <div
                        className="text-gray-600 leading-relaxed mb-6 flex-grow line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />

                      <div className="flex items-center justify-between">
                        <span className="text-gray-800 group-hover:text-emerald-800 transition-colors">
                          Read More
                        </span>
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                          <i className="ri-arrow-right-up-line text-xl text-emerald-800" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* View More Button with Animation */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: 0.8 }}
          className="text-center md:text-right"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/destinations')}
            className="group relative overflow-hidden bg-emerald-400 text-emerald-950 px-8 py-3 rounded-full w-full md:w-auto"
          >
            <span className="relative z-10 group-hover:text-emerald-950">
              <RollingText text="Lihat Semua Destinasi" isButton />
            </span>
            <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] rounded-full" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsGallery;
