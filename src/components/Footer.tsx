import { Link } from 'react-router-dom';

export default function Footer() {
  const footerFeatures = [
    { num: '01', title: 'Penomoran Digital', desc: 'Notifikasi SMS & Aplikasi untuk setiap pelanggan.' },
    { num: '02', title: 'Sinkronisasi Real-time', desc: 'Sinkronisasi berbasis cloud dengan latensi nol.' },
    { num: '03', title: 'Analisis Cerdas', desc: 'Identifikasi jam sibuk dan kinerja staf Anda.' },
    { num: '04', title: 'Hosting Global', desc: 'SLA uptime 99.9% demi kontinuitas bisnis.' },
  ];

  return (
    <footer className="px-10 py-16 border-t border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {footerFeatures.map((f) => (
            <div key={f.num} className="flex flex-col gap-2 group">
              <span className="text-brand-blue text-3xl font-bold italic group-hover:translate-x-1 transition-transform inline-block">{f.num}</span>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-dark underline decoration-brand-blue/30 decoration-2 underline-offset-4">{f.title}</h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed max-w-[200px]">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-100 space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-brand-blue rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="text-sm font-extrabold tracking-tight uppercase text-brand-dark">
              Antri<span className="text-brand-blue">Ku</span>
            </span>
          </div>

          <div className="flex space-x-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <Link to="/" className="hover:text-brand-blue transition-colors">Beranda</Link>
            <Link to="/gallery" className="hover:text-brand-blue transition-colors">Galeri</Link>
            <Link to="/about" className="hover:text-brand-blue transition-colors">Tentang</Link>
            <span className="text-zinc-500 font-bold">©{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
