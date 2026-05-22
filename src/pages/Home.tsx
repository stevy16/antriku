import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, GalleryHorizontal as Gallery, CheckCircle2, Clock, Bell, LayoutDashboard, BarChart3, HelpCircle, Check, Building, ArrowUpRight, Zap, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  // ... existing features
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps = [
    { num: '01', title: 'Daftar Bisnis', desc: 'Daftarkan bisnis atau klinik Anda melalui dashboard AntriKu dalam 1 menit.', icon: <Building className="w-5 h-5 text-brand-blue" /> },
    { num: '02', title: 'Pasang Poster QR', desc: 'Cetak poster QR Code otomatis dari sistem dan tempel di area layanan fisik.', icon: <ArrowUpRight className="w-5 h-5 text-brand-blue" /> },
    { num: '03', title: 'Pelanggan Scan QR', desc: 'Pelanggan memindai QR Code untuk mendaftar antrean mandiri lewat handphone.', icon: <Zap className="w-5 h-5 text-brand-blue" /> },
    { num: '04', title: 'Panggil & Monitor', desc: 'Panggil nomor antrean berikutnya dari dasbor admin dan pantau secara live.', icon: <Play className="w-5 h-5 text-brand-blue" /> }
  ];

  const pricingPlans = [
    { name: 'Trial Sandbox', price: 'Gratis', period: '14 Hari penuh', desc: 'Sempurna untuk uji coba kelayakan sistem antrean digital.', features: ['3 Loket Layanan', 'QR Code Otomatis', 'Simulasi Notifikasi Browser', 'TTS Voice Calls', 'Analitik Hari Ini'] },
    { name: 'Starter Local', price: 'Rp 149.000', period: 'per bulan', desc: 'Cocok untuk pangkas rambut, salon, kafe & toko kecil.', features: ['5 Loket Layanan', 'QR Code Custom', 'WhatsApp API Sandbox', 'Analitik Mingguan', 'Dukungan Chat Online'] },
    { name: 'Professional Bisnis', price: 'Rp 299.000', period: 'per bulan', desc: 'Ideal untuk Klinik medis, Bank daerah, and kantor pelayanan sipil.', features: ['Loket Tanpa Batas', 'Kustom Banner Poster', 'Integrasi WhatsApp API Resmi', 'Ekspor Laporan Analitik harian', 'Priority Support 24/7'] }
  ];

  const faqs = [
    { q: 'Apakah pelanggan wajib mengisntal aplikasi AntriKu?', a: 'Tidak. Pembeli atau pasien cukup memindai QR code menggunakan kamera bawaan ponsel untuk langsung mendapatkan nomor antrean digital di browser.' },
    { q: 'Bagaimana cara kerja notifikasi WhatsApp?', a: 'Sistem cloud kami otomatis membroadcast pesan notifikasi ketika antrean pelanggan bersiap dipanggil, meminimalkan nomor yang terlewat.' },
    { q: 'Berapa banyak loket layanan yang bisa saya daftarkan?', a: 'Sistem kami modular dan mendukung pembuatan loket layanan (Counter) tanpa batasan jumlah loket pada paket profesional.' },
    { q: 'Apakah ada masa percobaan gratis?', a: 'Ya! Anda mendapatkan akses penuh uji coba gratis (Free Trial) selama 14 hari tanpa diperlukan informasi kartu kredit.' }
  ];

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

      {/* Cara Kerja Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-50 border-t border-zinc-150 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 rounded-full px-4 py-1.5 inline-block mb-3">Onboarding Alur</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-dark">Cara Kerja Aplikasi</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto mt-2 text-xs">
              Mulai atur sistem antrean digital Anda dalam 4 langkah sederhana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white p-7 rounded-3xl border border-zinc-150 shadow-sm relative flex flex-col justify-between group hover:border-brand-blue/40 transition-all">
                <span className="absolute top-6 right-6 font-mono font-black text-3xl text-zinc-100 group-hover:text-brand-blue/10 transition-colors">{step.num}</span>
                <div>
                  <div className="w-12 h-12 bg-brand-blue/5 rounded-2xl flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-base font-black text-brand-dark mb-2">{step.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-zinc-150">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 rounded-full px-4 py-1.5 inline-block mb-3">Paket Layanan</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-dark">Harga Transparan untuk Layanan Hebat</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto mt-2 text-xs">
              Maksimal nilai kenyamanan dengan investasi ekonomis yang sangat terjangkau.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan, idx) => (
              <div key={idx} className={`p-8 rounded-[2.2rem] border flex flex-col justify-between relative bg-white shadow-md ${
                idx === 2 ? 'border-brand-blue ring-1 ring-brand-blue/50' : 'border-zinc-200'
              }`}>
                {idx === 2 && (
                  <span className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-brand-blue text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-sm">Terpopuler</span>
                )}
                <div>
                  <h3 className="text-lg font-black text-brand-dark">{plan.name}</h3>
                  <p className="text-xs text-zinc-450 mt-1 leading-relaxed">{plan.desc}</p>
                  
                  <div className="my-6">
                    <span className="text-4xl font-black text-brand-dark tracking-tight">{plan.price}</span>
                    <span className="text-zinc-400 text-xs font-bold block mt-1">{plan.period}</span>
                  </div>

                  <ul className="space-y-3.5 border-t border-zinc-100 pt-6">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex gap-2.5 items-center text-xs font-semibold text-zinc-650">
                        <Check className="w-4 h-4 text-brand-blue shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    to="/auth?tab=register"
                    className={`w-full py-3.5 text-center block font-bold text-xs uppercase tracking-widest rounded-xl transition-all ${
                      idx === 2 
                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-brand-blue/95' 
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    Mulai Uji Coba Gratis
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-50 border-t border-zinc-150">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 rounded-full px-4 py-1.5 inline-block mb-3">Pusat Bantuan FAQ</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark">Tanya Jawab Seputar AntriKu</h2>
            <p className="text-zinc-550 max-w-2xl mx-auto mt-2 text-xs">
              Berikut adalah jawaban atas pertanyaan-pertanyaan yang paling sering diajukan mengenai sistem integrasi antrean digital kami.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-zinc-150 p-5 shadow-sm transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center text-left font-black text-xs uppercase tracking-wider text-brand-dark cursor-pointer py-1.5"
                >
                  <span>{faq.q}</span>
                  <span className="text-brand-blue text-sm">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <p className="text-xs text-zinc-500 mt-4 leading-relaxed pt-3 border-t border-zinc-100">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Call-To-Action Banner */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-zinc-150">
        <div className="max-w-5xl mx-auto bg-brand-blue rounded-[3rem] p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-brand-blue/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full"></div>
          
          <span className="text-[9px] uppercase tracking-[0.2em] font-black text-blue-200 bg-white/10 px-4 py-1.5 rounded-full inline-block mb-4">Uji Coba 14 Hari Tanpa Risiko</span>
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Kalahkan Kerumunan Fisik & Atur Antrean Cerdas Bersama AntriKu</h2>
          <p className="text-blue-100 max-w-xl mx-auto mb-10 text-xs leading-relaxed">
            Mulailah mendigitalisasi ruang tunggu toko atau klinik kesehatan Anda hari ini dan rasakan peningkatan performa pelayanan hingga 60%.
          </p>

          <Link
            to="/auth?tab=register"
            className="px-10 py-5 bg-white hover:bg-zinc-50 text-brand-blue font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-xl shrink-0"
          >
            <span>Coba AntriKu Gratis Sekarang</span>
            <ArrowRight className="w-4 h-4 text-brand-blue" />
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
