import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Swiper from 'swiper';
import { Autoplay, Navigation } from 'swiper/modules';
import RollingText from './RollingText';
import 'swiper/css';
import 'swiper/css/navigation';
import { FaLeaf } from 'react-icons/fa';

// Tambahkan style untuk menghilangkan default button Swiper
const swiperStyles = `
  .swiper-button-next::after,
  .swiper-button-prev::after {
    display: none;
  }
`;

const LastPage = () => {
  const sectionRef = useRef(null);
  const footerRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const isFooterInView = useInView(footerRef, {
    once: true,
    margin: '0px 0px -200px 0px',
    threshold: 0.3,
  });

  useEffect(() => {
    const swiper = new Swiper('.testimonial-swiper', {
      modules: [Autoplay, Navigation],
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      loop: true,
      allowTouchMove: false,
    });

    return () => {
      swiper.destroy();
    };
  }, []);

  const testimonials = [
    {
      quote:
        'GreenHaven memberikan pengalaman yang luar biasa dengan keindahan alam dan masyarakat yang ramah.',
      author: 'Sarah Johnson',
      role: 'Nature Enthusiast',
      category: 'Green Tourism',
    },
    {
      quote: 'Program konservasi dan pemberdayaan masyarakat GreenHaven sangat menginspirasi.',
      author: 'David Park',
      role: 'Environmental Activist',
      category: 'Eco Tourism',
    },
  ];

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const scrollToTop = () => {
    // Scroll ke atas dengan smooth
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Reload halaman setelah scroll selesai
    const scrollDuration = 1000;
    setTimeout(() => {
      window.location.reload();
    }, scrollDuration);
  };

  return (
    <div className="relative z-[1]">
      <style>{swiperStyles}</style>
      <motion.section
        ref={sectionRef}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="relative z-[2] bg-white rounded-b-[40px] min-h-[80vh] px-8 py-24 overflow-x-hidden"
      >
        <div className="container mx-auto flex flex-col md:flex-row gap-[5%]">
          <motion.div
            className="w-full md:w-1/5"
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.8, delay: 0.2 },
              },
            }}
          >
            <p className="text-zinc-400 mb-8 md:mb-24">06 — Testimonials</p>
            <p className="hidden md:block text-zinc-400">
              Apa kata mereka tentang pengalaman wisata alam di GreenHaven
            </p>
          </motion.div>

          <div className="w-full md:w-4/5 relative">
            <motion.i
              className="ri-double-quotes-r text-6xl absolute top-0 left-[-20px] hidden md:block"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            <div className="testimonial-swiper overflow-hidden pl-0 md:pl-8">
              <div className="swiper-wrapper">
                {testimonials.map((item, index) => (
                  <div
                    key={index}
                    className="swiper-slide flex flex-col justify-between min-h-[400px]"
                  >
                    <h2 className="text-3xl md:text-[2.8vw] mb-16 font-semibold pl-12 leading-[1.3] max-w-[1100px]">
                      {item.quote}
                    </h2>
                    <div className="flex items-center justify-between pt-8 border-t border-zinc-200 max-w-[1000px]">
                      <div className="flex items-center gap-4 md:gap-8">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg"
                          alt="avatar"
                          className="w-12 h-12 md:w-20 md:h-20 rounded-full"
                        />
                        <div>
                          <p className="text-lg md:text-2xl font-bold">{item.author}</p>
                          <p className="text-sm md:text-base text-zinc-400">{item.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 md:gap-12">
                        <p className="text-sm md:text-base text-zinc-400">{item.category}</p>
                        <div className="flex gap-4">
                          <button className="swiper-button-prev !static !w-10 !h-10 !m-0 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors">
                            <i className="ri-arrow-left-s-line text-xl" />
                          </button>
                          <button className="swiper-button-next !static !w-10 !h-10 !m-0 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors">
                            <i className="ri-arrow-right-s-line text-xl" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.footer
        id="last-page-section"
        ref={footerRef}
        initial="hidden"
        animate={isFooterInView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="sticky bottom-0 -z-[1] min-h-[70vh] px-8 py-16 bg-emerald-900 overflow-x-hidden"
      >
        <div className="container mx-auto">
          <motion.a
            variants={childVariants}
            href="/"
            className="flex items-center gap-2 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <FaLeaf className="w-6 h-6 text-white" />
            <span className="font-bold text-white">GreenHaven</span>
          </motion.a>

          <div className="flex flex-col md:flex-row justify-between">
            <motion.div variants={childVariants} className="w-full md:w-[40%] mb-12 md:mb-0">
              <h2 className="text-4xl font-bold mb-6 text-white">
                Mari Jelajahi Keindahan Alam Bersama GreenHaven
              </h2>
              <p className="text-emerald-200/80 mb-8 hidden md:block">
                Feel free to reach our if you want to collaborate with us, or simply have a chat
              </p>
              <div className="relative w-full md:w-auto group">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full md:w-auto bg-white text-emerald-950 px-8 py-3 rounded-full mb-8 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-full w-full h-full bg-emerald-400 group-hover:-translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] rounded-full" />
                  <span className="relative z-10">
                    <RollingText text="Hubungi Kami" isButton />
                  </span>
                </motion.button>
              </div>
              <p className="text-emerald-200/80 mb-2 hidden md:block">
                Don't like the forms? Drop us a line via email.
              </p>
              <a href="mailto:contact@greenhaven.com" className="text-white hover:text-emerald-200">
                contact@greenhaven.com
              </a>
            </motion.div>

            <motion.div variants={childVariants} className="w-full md:w-[50%]">
              <nav className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-6 text-white">Kontak Kami</h3>
                  <ul className="space-y-4">
                    <li>
                      <p className="text-emerald-200/80">Email</p>
                      <a
                        href="mailto:contact@greenhaven.com"
                        className="text-white hover:text-emerald-200"
                      >
                        contact@greenhaven.com
                      </a>
                    </li>
                    <li>
                      <p className="text-emerald-200/80">Telepon</p>
                      <p className="text-white">(0251) 8321075</p>
                    </li>
                    <li className="text-emerald-200/80">
                      Balaikota Bogor, Jl. Ir. H. Juanda No.10, Kota Bogor
                    </li>
                  </ul>
                </div>

                <div className="hidden md:block">
                  <h3 className="text-xl font-bold mb-6 text-white">Ikuti Kami</h3>
                  <ul className="space-y-4">
                    {['instagram', 'facebook', 'twitter', 'youtube'].map((social) => (
                      <li key={social}>
                        <a
                          href={`#${social}`}
                          className="flex items-center justify-between text-emerald-200/80 hover:text-white"
                        >
                          <span>{social}</span>
                          <i className="ri-arrow-right-up-line" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-6 text-white">Menu</h3>
                  <ul className="space-y-4">
                    {['Destinasi', 'Tentang', 'Galeri', 'Berita', 'Kontak'].map((item) => (
                      <li key={item}>
                        <a href={`#${item}`} className="text-emerald-200/80 hover:text-white">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            </motion.div>
          </div>

          <motion.div
            variants={childVariants}
            className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-emerald-800 mt-8"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 mb-4 md:mb-0">
              <p className="text-emerald-200/80 text-center md:text-left">
                © 2024 GreenHaven Nature Tourism. All rights reserved
              </p>
              <span className="hidden md:inline text-emerald-200/80">•</span>
              <a href="#privacy" className="text-emerald-200/80 hover:text-white hidden md:block">
                Kebijakan Privasi
              </a>
            </div>
            <motion.button
              variants={childVariants}
              whileHover={{ y: -3 }}
              onClick={scrollToTop}
              className="hidden md:flex items-center gap-2 text-emerald-200/80 hover:text-white transition-colors duration-300"
            >
              Kembali ke Atas
              <i className="ri-arrow-up-line" />
            </motion.button>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LastPage;
