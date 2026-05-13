import { Link } from 'react-router-dom';

export default function Footer() {
  const footerFeatures = [
    { num: '01', title: 'Digital Numbering', desc: 'SMS & App notifications for every customer.' },
    { num: '02', title: 'Real-time Sync', desc: 'Zero latency cloud-based synchronization.' },
    { num: '03', title: 'Smart Analytics', desc: 'Identify peak hours and staff performance.' },
    { num: '04', title: 'Global Hosting', desc: '99.9% uptime for business continuity.' },
  ];

  return (
    <footer className="px-10 py-16 border-t border-white/10 bg-brand-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {footerFeatures.map((f) => (
            <div key={f.num} className="flex flex-col gap-2 group">
              <span className="text-brand-pink text-3xl font-bold italic group-hover:translate-x-1 transition-transform inline-block">{f.num}</span>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white underline decoration-brand-pink/30 decoration-2 underline-offset-4">{f.title}</h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed max-w-[200px]">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-brand-pink rounded flex items-center justify-center">
              <span className="text-black font-bold text-xs">A</span>
            </div>
            <span className="text-sm font-bold tracking-tight uppercase">
              Antri<span className="text-brand-pink">Ku</span>
            </span>
          </div>

          <div className="flex space-x-8 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <Link to="/" className="hover:text-brand-pink transition-colors">Home</Link>
            <Link to="/gallery" className="hover:text-brand-pink transition-colors">Gallery</Link>
            <Link to="/about" className="hover:text-brand-pink transition-colors">About</Link>
            <span className="text-zinc-700">©{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
