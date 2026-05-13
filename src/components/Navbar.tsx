import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-none">
      <div className="max-w-7xl mx-auto px-10">
        <div className="flex justify-between h-24 items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-brand-pink rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <span className="text-black font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold tracking-tight uppercase">
              Antri<span className="text-brand-pink">Ku</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:text-brand-pink pb-1 ${
                  location.pathname === link.path ? 'text-white border-b border-brand-pink' : 'text-zinc-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/get-started"
              className="px-6 py-2 border border-brand-pink text-brand-pink text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-brand-pink hover:text-black transition-all"
            >
              Client Login
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-400 hover:text-white"
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
          className="md:hidden absolute top-20 left-0 right-0 bg-brand-black border-b border-white/10 p-4"
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium ${
                  location.pathname === link.path ? 'text-brand-pink' : 'text-zinc-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/get-started"
              onClick={() => setIsOpen(false)}
              className="w-full py-4 bg-brand-pink text-black text-center font-bold rounded-xl"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
