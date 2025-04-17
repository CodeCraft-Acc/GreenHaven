import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';
import RollingText from '../components/RollingText';

function Footer() {
  const containerVariants = {
    initial: { opacity: 0, y: 50 },
    animate: {
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
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.footer
      initial="initial"
      animate="animate"
      variants={containerVariants}
      className="bg-emerald-900 px-8 py-16 mt-16 overflow-x-hidden"
    >
      <div className="container mx-auto">
        <motion.Link
          variants={childVariants}
          to="/"
          className="flex items-center gap-2 mb-8"
          whileHover={{ scale: 1.05 }}
        >
          <FaLeaf className="w-6 h-6 text-white" />
          <span className="font-bold text-white">GreenHaven</span>
        </motion.Link>

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
        </motion.div>
      </div>
    </motion.footer>
  );
}

export default Footer;
