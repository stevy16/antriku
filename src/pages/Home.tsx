import { motion } from 'motion/react';
import { ArrowRight, GalleryHorizontal as Gallery, CheckCircle2, Clock, Bell, LayoutDashboard, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  // ... existing features
];

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-10 relative z-10 w-full pt-20 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 rounded-full">
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-tighter font-bold text-brand-blue">Kini melayani 500+ bisnis</span>
              </div>
              <h1 className="text-6xl md:text-[5.5rem] font-extrabold leading-[0.95] tracking-tighter mb-8 text-brand-dark">
                Manajemen Antrean <br/>Lebih Cerdas untuk <br/><span className="text-brand-blue italic font-medium">Bisnis Modern.</span>
              </h1>
              <p className="text-lg text-zinc-650 mb-10 max-w-md leading-relaxed">
                Kurangi waktu tunggu, hilangkan penumpukan kerumunan, dan tingkatkan kepuasan pelanggan dengan ekosistem antrean digital berbasis cloud dari AntriKu.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/about"
                  className="px-8 py-4 bg-brand-blue text-white font-bold rounded-xl text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-brand-blue/25"
                >
                  Mulai Gratis
                </Link>
                <Link
                  to="/gallery"
                  className="px-8 py-4 glass text-brand-dark hover:bg-zinc-100 font-bold rounded-xl text-sm uppercase tracking-widest hover:scale-105 transition-all text-center"
                >
                  Lihat Galeri
                </Link>
              </div>

              {/* Target User Badges */}
              <div className="mt-16">
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-4 font-extrabold">Didesain untuk Profesional</p>
                <div className="flex flex-wrap gap-3">
                  {['Klinik', 'Pangkas Rambut', 'Restoran', 'Bank', 'Bengkel'].map((badge) => (
                    <span key={badge} className="px-4 py-1.5 bg-white border border-zinc-100 rounded-lg text-[11px] text-zinc-700 font-bold shadow-sm">{badge}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Visual Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative hidden lg:flex items-center justify-center pt-10"
            >
              <div className="w-full max-w-md aspect-[4/5] bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-zinc-200 border border-zinc-100/80 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Status Langsung</p>
                    <h3 className="text-xl font-bold text-brand-dark">Dasbor Digital</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>
                </div>

                {/* Big Number */}
                <div className="bg-brand-blue/5 rounded-3xl p-10 text-center border border-brand-blue/10 mb-8 flex flex-col justify-center flex-1">
                  <p className="text-brand-blue uppercase tracking-widest text-xs font-extrabold mb-4">Sedang Dilayani</p>
                  <div className="text-8xl font-black tracking-tighter text-brand-dark">A-24</div>
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Clock className="w-4 h-4 text-brand-blue" />
                    <p className="text-zinc-600 text-xs font-semibold uppercase tracking-widest">
                      Estimasi: <span className="text-brand-blue font-mono font-bold">12 MENIT</span>
                    </p>
                  </div>
                </div>

                {/* Queue List */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-xl bg-brand-blue text-white font-bold shadow-sm">
                    <span className="text-sm">B-12</span>
                    <span className="text-[10px] uppercase tracking-widest text-blue-100">Siap dilayani</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                    <span className="text-sm text-zinc-700 font-bold">C-08</span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Berikutnya</span>
                  </div>
                </div>

                {/* Tech Stack Floating Label */}
                <div className="absolute -bottom-1 -right-1 pt-6 pl-6 pb-4 pr-4 bg-zinc-50 rounded-tl-3xl border-l border-t border-zinc-100">
                  <p className="text-[8px] uppercase tracking-widest text-zinc-400 mb-2 font-bold">Sistem</p>
                  <div className="flex gap-3 items-center opacity-80 text-zinc-500 font-bold text-[9px]">
                    <span className="text-zinc-650">React</span>
                    <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
                    <span className="text-zinc-650">Node</span>
                    <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
                    <span className="text-zinc-650">DB</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-zinc-100 relative">
        <div className="blue-gradient absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-50"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-brand-dark">Fitur Unggulan</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengubah pengalaman menunggu pelanggan Anda menjadi lebih modern dan efisien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Nomor Antrean Digital',
                description: 'Terbitkan tiket antrean digital secara instan ke pelanggan langsung lewat smartphone mereka.',
                icon: <CheckCircle2 className="w-6 h-6 text-brand-blue" />,
              },
              {
                title: 'Estimasi Waktu Tunggu',
                description: 'Algoritma presisi tinggi menghitung waktu tunggu akurat guna meminimalkan kecemasan pelanggan.',
                icon: <Clock className="w-6 h-6 text-brand-blue" />,
              },
              {
                title: 'Notifikasi Antrean',
                description: 'Pemberitahuan otomatis via SMS atau push notification ketika nomor giliran hampir tiba.',
                icon: <Bell className="w-6 h-6 text-brand-blue" />,
              },
              {
                title: 'Dasbor Real-time',
                description: 'Tampilan langsung kinerja layanan, jumlah antrean aktif, dan arus lalu lintas harian usaha Anda.',
                icon: <LayoutDashboard className="w-6 h-6 text-brand-blue" />,
              },
              {
                title: 'Analitik Layanan',
                description: 'Wawasan berbasis data untuk optimasi alokasi staf dan penyelesaian botol leher operasional.',
                icon: <BarChart3 className="w-6 h-6 text-brand-blue" />,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-8 bg-brand-bg rounded-3xl border border-zinc-100 hover:border-brand-blue/30 transition-colors group shadow-sm"
              >
                <div className="w-14 h-14 bg-brand-blue/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-brand-dark">{feature.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-zinc-100/60 bg-brand-bg">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 bg-brand-blue/10 border border-brand-blue/20 rounded-full mb-8">
            <span className="text-brand-blue text-xs font-bold uppercase tracking-widest">Mengapa AntriKu?</span>
          </div>
          <h2 className="text-3xl md:text-6xl font-extrabold mb-12 max-w-4xl mx-auto leading-tight text-brand-dark">
            Menghemat Waktu adalah <span className="text-brand-blue italic font-medium">Nilai Ekonomi</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-brand-dark">Membuka Efisiensi</h3>
              <p className="text-zinc-600 leading-relaxed text-sm">
                Antrean fisik menguras waktu dan sumber daya Anda. AntriKu memungkinkan staf Anda fokus pada pelayanan, bukan mengatur barisan fisik. Dengan mendigitalkan antrean, Anda memperoleh visibilitas lengkap mengenai periode puncak bisnis dan hambatan layanan pelanggan.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-brand-dark">Loyalitas Pelanggan</h3>
              <p className="text-zinc-600 leading-relaxed text-sm">
                Tidak ada seorang pun yang menyukai menunggu lama. Dengan mengembalikan kendali ke tangan pelanggan—memungkinkan mereka memesan tiket antrean dari rumah atau sekadar menikmati kopi saat menunggu—Anda membangun kepercayaan instan dan loyalitas kokoh yang menghasilkan kunjungan berulang bagi usaha Anda.
              </p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
