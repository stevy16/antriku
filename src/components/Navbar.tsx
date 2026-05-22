import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useQueue } from '../context/QueueContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { authState } = useQueue();
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Ambil Antrean', path: '/queue' },
    { name: 'Monitor TV', path: '/display' },
    { name: 'Langkah Setup', path: '/get-started' },
  ];

  const adminTarget = authState.isAuthenticated ? '/admin' : '/auth';
  const adminLabel = authState.isAuthenticated ? 'Dasbor Admin' : 'Masuk Admin';

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
                className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-all hover:text-brand-blue pb-1 ${
                  location.pathname === link.path ? 'text-brand-dark border-b-2 border-brand-blue' : 'text-zinc-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to={adminTarget}
              className="px-6 py-2 border border-brand-blue bg-brand-blue/5 text-brand-blue text-[10px] font-bold uppercase tracking-[0.15em] rounded-full hover:bg-brand-blue hover:text-white transition-all shadow-sm"
            >
              {adminLabel}
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
              to={adminTarget}
              onClick={() => setIsOpen(false)}
              className="w-full py-4 bg-brand-blue text-white text-center font-bold rounded-xl shadow-lg shadow-brand-blue/20"
            >
              {adminLabel}
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
