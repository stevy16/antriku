import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Galeri', path: '/gallery' },
    { name: 'Tentang', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-10">
        <div className="flex justify-between h-24 items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold tracking-tight uppercase text-brand-dark">
              Antri<span className="text-brand-blue">Ku</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:text-brand-blue pb-1 ${
                  location.pathname === link.path ? 'text-brand-dark border-b-2 border-brand-blue' : 'text-zinc-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/get-started"
              className="px-6 py-2 border border-brand-blue text-brand-blue text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-brand-blue hover:text-white transition-all shadow-sm"
            >
              Masuk Klien
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-650 hover:text-brand-blue"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-24 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-zinc-100 shadow-xl p-6"
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-bold ${
                  location.pathname === link.path ? 'text-brand-blue' : 'text-zinc-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/get-started"
              onClick={() => setIsOpen(false)}
              className="w-full py-4 bg-brand-blue text-white text-center font-bold rounded-xl shadow-lg shadow-brand-blue/20"
            >
              Mulai Sekarang
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
