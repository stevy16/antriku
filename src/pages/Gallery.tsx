import { motion } from 'motion/react';

const galleryItems = [
  {
    url: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071&auto=format&fit=crop',
    title: 'Masalah: Antrean Panjang',
    category: 'Kerumunan',
  },
  {
    url: 'https://images.unsplash.com/photo-1510511459019-5dee9954889c?q=80&w=2070&auto=format&fit=crop',
    title: 'Solusi: Pemesanan Seluler',
    category: 'Digital',
  },
  {
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop',
    title: 'Ruang Kerja Efisien',
    category: 'Bisnis',
  },
  {
    url: 'https://images.unsplash.com/photo-1600880212319-7524ded9c16a?q=80&w=2070&auto=format&fit=crop',
    title: 'Pembayaran Mulus',
    category: 'SaaS',
  },
  {
    url: 'https://images.unsplash.com/photo-1491975474562-1f1e30bc1ff1?q=80&w=2071&auto=format&fit=crop',
    title: 'Pemantauan Real-time',
    category: 'Analisis',
  },
  {
    url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069&auto=format&fit=crop',
    title: 'Layanan Kesehatan Modern',
    category: 'Industri',
  },
];

export default function GalleryPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-brand-dark">Galeri</h1>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Saksikan transformasi lingkungan layanan bisnis menjadi efisien melalui ekosistem antrean digital kami.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="relative group aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100 border border-zinc-150 shadow-md"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute flex flex-col justify-end p-8 inset-0 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-brand-blue text-xs font-extrabold uppercase tracking-widest mb-2 border-l-2 border-brand-blue pl-3">{item.category}</span>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
