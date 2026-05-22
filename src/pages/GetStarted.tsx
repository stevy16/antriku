import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, 
  QrCode, 
  Phone, 
  ArrowRight, 
  Printer, 
  Check, 
  Download, 
  Volume2, 
  Plus, 
  Users, 
  Play, 
  FileText, 
  AlertCircle,
  Clock,
  LayoutDashboard
} from 'lucide-react';

// Custom types for the onboarding state
interface BusinessData {
  name: string;
  category: string;
  phone: string;
  counters: number;
}

interface QueueTicket {
  number: string;
  time: string;
  status: 'waiting' | 'called' | 'finished';
  phone: string;
}

export default function GetStarted() {
  const [activeStep, setActiveStep] = useState<number>(0);
  
  // Business data state
  const [business, setBusiness] = useState<BusinessData>({
    name: 'Klinik Sehat Bersama',
    category: 'Klinik & Kesehatan',
    phone: '081234567890',
    counters: 2,
  });

  // Simulator state
  const [queue, setQueue] = useState<QueueTicket[]>([
    { number: 'A-01', time: '10:00 WIB', status: 'finished', phone: '0812****881' },
    { number: 'A-02', time: '10:15 WIB', status: 'finished', phone: '0857****123' },
    { number: 'A-03', time: '10:30 WIB', status: 'called', phone: '0899****900' },
    { number: 'B-01', time: '10:35 WIB', status: 'waiting', phone: '0813****111' },
    { number: 'A-04', time: '10:42 WIB', status: 'waiting', phone: '0822****334' },
  ]);

  const [currentServing, setCurrentServing] = useState<string>('A-03');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [newCustomerPhone, setNewCustomerPhone] = useState<string>('');
  const [isCalling, setIsCalling] = useState<boolean>(false);

  // Download flyer simulation
  const [flyerDownloaded, setFlyerDownloaded] = useState<boolean>(false);

  const steps = [
    { num: '01', title: 'Pendaftaran Cepat', desc: 'Isi profil identitas bisnis Anda' },
    { num: '02', title: 'Pasang Layat QR Code', desc: 'Cetak flyer & tempatkan di meja loket' },
    { num: '03', title: 'Ecosystem Simulator', desc: 'Uji langsung sistem antrean interaktif' },
  ];

  // Handler to register business
  const handleNextStep = () => {
    if (activeStep < 2) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  // Trigger simulate QR code scan & join queue
  const handleSimulateScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerPhone) {
      setAlertMessage('Harap masukkan nomor WhatsApp simulasi ponsel!');
      setTimeout(() => setAlertMessage(''), 3000);
      return;
    }

    const prefix = Math.random() > 0.4 ? 'A' : 'B';
    const lastNumOfPrefix = queue
      .filter((t) => t.number.startsWith(prefix))
      .map((t) => parseInt(t.number.split('-')[1]))
      .reduce((max, val) => (val > max ? val : max), 0);
    
    const nextNum = lastNumOfPrefix + 1;
    const ticketStr = `${prefix}-${nextNum < 10 ? '0' : ''}${nextNum}`;
    
    const formattedPhone = newCustomerPhone.length > 7
      ? `${newCustomerPhone.substring(0, 4)}****${newCustomerPhone.substring(newCustomerPhone.length - 3)}`
      : '0852****000';

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

    const newTicket: QueueTicket = {
      number: ticketStr,
      time: timeStr,
      status: 'waiting',
      phone: formattedPhone,
    };

    setQueue([...queue, newTicket]);
    setNewCustomerPhone('');
    setAlertMessage(`📱 Sukses! Tiket ${ticketStr} berhasil diambil dari pemindaian QR.`);
    setTimeout(() => setAlertMessage(''), 4000);
  };

  // Next calling simulation
  const handleCallNext = () => {
    const nextWaiting = queue.find((t) => t.status === 'waiting');
    if (!nextWaiting) {
      setAlertMessage('Tidak ada antrean dalam daftar tunggu saat ini!');
      setTimeout(() => setAlertMessage(''), 3000);
      return;
    }

    setIsCalling(true);
    // Simulate speech/beep calling audio
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
      
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.log('Audio Context not supported or allowed yet');
    }

    setTimeout(() => {
      setQueue(queue.map((t) => {
        if (t.number === nextWaiting.number) {
          return { ...t, status: 'called' };
        }
        if (t.number === currentServing) {
          return { ...t, status: 'finished' };
        }
        return t;
      }));
      setCurrentServing(nextWaiting.number);
      setIsCalling(false);
      setAlertMessage(`📢 Memanggil nomor antrean ${nextWaiting.number} ke Loket 1!`);
      setTimeout(() => setAlertMessage(''), 4000);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen hero-gradient"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-blue">Panduan Onboarding AntriKu</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-dark mb-4">
            Langkah Mudah Mendigitalisasi Antrean Anda
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-sm">
            Ikuti proses 3 langkah praktis ini untuk mendaftarkan bisnis Anda, mencetak flyer QR Code fisik, dan lakukan simulasi cara kerjanya sekarang.
          </p>
        </div>

        {/* Stepper Wizard Indicator */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 bg-white/60 p-3 rounded-[1.8rem] border border-zinc-150 shadow-sm">
          {steps.map((step, idx) => {
            const isCompleted = activeStep > idx;
            const isActive = activeStep === idx;
            return (
              <div 
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/25 scale-[1.02]' 
                    : isCompleted 
                      ? 'bg-brand-blue/5 text-brand-dark border border-brand-blue/15'
                      : 'bg-transparent text-zinc-500 hover:bg-zinc-100/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-lg ${
                  isActive 
                    ? 'bg-white text-brand-blue' 
                    : isCompleted 
                      ? 'bg-brand-blue text-white' 
                      : 'bg-zinc-200 text-zinc-600'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : step.num}
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider leading-none mb-1">{step.title}</h3>
                  <p className={`text-[10px] leading-tight ${isActive ? 'text-blue-100' : 'text-zinc-500'}`}>{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Alert Message Info Bar */}
        <AnimatePresence>
          {alertMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-brand-blue text-white rounded-2xl font-bold text-xs flex items-center gap-3 shadow-md shadow-brand-blue/15"
            >
              <Volume2 className="w-5 h-5 animate-bounce text-blue-100 shrink-0" />
              <span>{alertMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Contents */}
        <div className="bg-white rounded-[2.5rem] border border-zinc-200/80 shadow-2xl shadow-zinc-200/50 p-6 md:p-12 min-h-[480px] flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12"
              >
                {/* Left: Input Form */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-brand-dark mb-2">Langkah 1: Identitas & Industri Profil</h2>
                    <p className="text-zinc-500 text-xs">Pilihlah informasi profil dasar mengenai counter usaha Anda untuk menyesuaikan kriteria antrean digital.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">Nama Usaha / Bisnis </label>
                      <div className="relative">
                        <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                        <input 
                          type="text"
                          value={business.name}
                          onChange={(e) => setBusiness({...business, name: e.target.value})}
                          placeholder="Contoh: Barbershop Gentlemind"
                          className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">Kategori Bidang</label>
                        <select 
                          value={business.category}
                          onChange={(e) => setBusiness({...business, category: e.target.value})}
                          className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                        >
                          <option value="Klinik & Kesehatan">🏥 Klinik & Kesehatan</option>
                          <option value="Pangkas Rambut & Salon">💈 Pangkas Rambut & Salon</option>
                          <option value="Restoran & Kafe">☕ Restoran & Kafe</option>
                          <option value="Bank & Layanan Publik">🏦 Bank & Layanan Publik</option>
                          <option value="Bengkel & Cuci Mobil">🚗 Bengkel & Jasa Lokal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">Jumlah Loket Aktif</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="8"
                          value={business.counters}
                          onChange={(e) => setBusiness({...business, counters: Math.max(1, parseInt(e.target.value) || 1)})}
                          className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">No WhatsApp Notifikasi (Simulasi)</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                        <input 
                          type="text"
                          value={business.phone}
                          onChange={(e) => setBusiness({...business, phone: e.target.value})}
                          placeholder="Mulai dengan 08..."
                          className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1.5">Pelanggan akan mendapat pesan otomatis gratis saat nomor gilirannya hampir dipanggil.</p>
                    </div>
                  </div>
                </div>

                {/* Right: Informational/Aesthetic Card */}
                <div className="flex flex-col justify-center bg-zinc-50/80 p-8 rounded-[2rem] border border-zinc-150">
                  <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center mb-6">
                    <Check className="w-6 h-6 font-black" />
                  </div>
                  <h3 className="text-lg font-extrabold text-brand-dark mb-3">Keuntungan Pendaftaran Digital</h3>
                  <ul className="space-y-3.5">
                    {[
                      'Nomor antrean langsung ter-link ke cloud digital.',
                      'Notifikasi langsung ke ponsel pelanggan tanpa alat pager eksternal.',
                      'Dapat dipantau dari luar toko atau lokasi, menghindari kerumunan fisik.',
                      'Database terpusat memudahkan Anda memantau durasi pelayanan per staf.'
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-3 items-start text-xs text-zinc-650 font-medium">
                        <span className="w-1.5 h-1.5 bg-brand-blue rounded-full mt-2 shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-6 border-t border-zinc-200 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Sistem Server Siap Digunakan</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12"
              >
                {/* Left: QR Code Flyer Generator */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-brand-dark mb-2">Langkah 2: Tempatkan QR Code di Meja Kasir / Pintu Masuk</h2>
                    <p className="text-zinc-500 text-xs">Di bawah ini adalah poster pamflet otomatis yang siap Anda unduh dan cetak. Tempatkan poster ini pada lokasi fisik usaha agar pelanggan Anda bisa langsung memindainya untuk check-in mandiri.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl text-xs text-zinc-650 flex gap-3">
                      <Printer className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-extrabold text-brand-dark">Saran Media Cetak</h4>
                        <p className="text-[10px] text-zinc-500 leading-relaxed mt-0.5">Sebaiknya gunakan kertas tebal berukuran A5 / A6 dengan penyangga akrilik di meja kasir Anda agar mudah dipindai oleh kamera smartphone pelanggan.</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <button 
                        onClick={() => {
                          setFlyerDownloaded(true);
                          setAlertMessage('📥 Simulasi: Mengunduh Flyer Antrean PDF resolusi siap cetak...');
                          setTimeout(() => setAlertMessage(''), 4000);
                        }}
                        className="px-6 py-3 bg-brand-blue hover:bg-brand-blue/95 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-brand-blue/15"
                      >
                        {flyerDownloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                        <span>{flyerDownloaded ? 'Sukses Diunduh!' : 'Unduh File Flyer Cetak (PDF)'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Live Visual Flyer Preview */}
                <div className="flex items-center justify-center">
                  <div className="w-[300px] bg-white border-2 border-dashed border-zinc-200 rounded-[2rem] p-6 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-brand-blue"></div>
                    
                    {/* Flyer Header */}
                    <p className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-blue mt-2">Check-In Antrean Mandiri</p>
                    <h3 className="text-xl font-extrabold mt-1 text-brand-dark truncate w-full px-2">{business.name}</h3>
                    <p className="text-[9px] text-zinc-400 capitalize bg-zinc-100 rounded px-2 py-0.5 mt-1">{business.category}</p>

                    {/* QR Code Graphic Box */}
                    <div className="my-6 p-4 bg-zinc-50 border border-zinc-150 rounded-2xl relative group">
                      <div className="w-36 h-36 bg-white flex items-center justify-center relative p-1">
                        {/* Styled simulated QR columns/blocks */}
                        <div className="grid grid-cols-4 gap-1 w-full h-full opacity-90">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`rounded ${
                                (i % 3 === 0 || i === 1 || i === 7 || i === 10 || i === 14) 
                                  ? 'bg-brand-dark' 
                                  : (i % 5 === 0) ? 'bg-brand-blue' : 'bg-transparent'
                              }`}
                            ></div>
                          ))}
                        </div>
                        {/* Centered App Icon Overlay in QR */}
                        <div className="absolute w-8 h-8 bg-brand-blue rounded-lg border-2 border-white flex items-center justify-center shadow-lg">
                          <span className="text-white font-black text-xs">A</span>
                        </div>
                      </div>
                      
                      {/* Scan Badge Overlay */}
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-brand-blue text-white rounded-full font-bold text-[8px] uppercase tracking-widest leading-none shadow-md shadow-brand-blue/20">
                        PINDAI DI SINI
                      </span>
                    </div>

                    {/* Guidelines for Customers */}
                    <div className="space-y-1 mt-2 text-zinc-500">
                      <p className="text-[9px] font-bold text-brand-dark">3 Langkah Mudah Antri:</p>
                      <p className="text-[8px]">1. Pindai kode dengan kamera Handphone Anda</p>
                      <p className="text-[8px]">2. Masukkan nama & nomor WhatsApp</p>
                      <p className="text-[8px]">3. Tunggu notifikasi panggilan di mana saja!</p>
                    </div>

                    {/* Mini Footer branding */}
                    <div className="mt-6 pt-4 border-t border-zinc-100 w-full flex items-center justify-center gap-1 text-[8px] font-extrabold text-zinc-450 tracking-wider">
                      <span>POWERED BY</span>
                      <span className="text-brand-blue">ANTRIKU.COM</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-extrabold text-brand-dark mb-1">Coba Langsung Simulator Ekosistem AntriKu</h2>
                  <p className="text-zinc-550 text-xs">Di bawah ini adalah pengujian dua sisi. Anda dapat menguji sisi staf memanggil antrean, dan sisi pelanggan memindai QR code dan mendaftar.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  
                  {/* Left Column: Staff Console Dashboard */}
                  <div className="bg-zinc-50 p-6 rounded-[2rem] border border-zinc-150 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="w-5 h-5 text-brand-blue font-bold" />
                          <h3 className="font-extrabold text-sm text-brand-dark">Konsol Operasional Staf</h3>
                        </div>
                        <span className="px-2 py-1 bg-emerald-100/80 text-emerald-700 text-[8px] font-black uppercase tracking-widest rounded">
                          ON-DUTY
                        </span>
                      </div>

                      {/* Simulator Status Counter */}
                      <div className="bg-white rounded-2xl p-5 border border-zinc-100 text-center shadow-sm mb-6 relative">
                        <p className="text-zinc-400 text-[9px] uppercase tracking-wider font-bold mb-1">Nomor Sedang Dilayani</p>
                        <span className="text-5xl font-black text-brand-dark tracking-tight">{currentServing}</span>
                        <p className="text-[10px] text-brand-blue mt-2 font-bold uppercase tracking-wider">Loket 1</p>
                        
                        {/* Secondary stats */}
                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-100 text-left">
                          <div>
                            <span className="text-[8px] text-zinc-500 block uppercase tracking-wider leading-none">Menunggu</span>
                            <span className="text-sm font-extrabold text-brand-dark mt-1 block">
                              {queue.filter((t) => t.status === 'waiting').length} tiket
                            </span>
                          </div>
                          <div>
                            <span className="text-[8px] text-zinc-500 block uppercase tracking-wider leading-none">Total Antrean</span>
                            <span className="text-sm font-extrabold text-brand-dark mt-1 block">{queue.length} tiket</span>
                          </div>
                        </div>
                      </div>

                      {/* Queue List Table */}
                      <div className="space-y-2 max-h-48 overflow-y-auto mb-6 pr-1 custom-scrollbar">
                        <p className="text-[9px] text-zinc-500 uppercase font-extrabold tracking-wider mb-2">Daftar Antrean Real-time</p>
                        {queue.map((t, i) => (
                          <div 
                            key={i} 
                            className={`flex justify-between items-center p-3 rounded-xl border text-xs font-semibold ${
                              t.status === 'called'
                                ? 'bg-brand-blue/10 border-brand-blue text-brand-blue'
                                : t.status === 'finished'
                                  ? 'bg-zinc-100 border-zinc-200 text-zinc-400'
                                  : 'bg-white border-zinc-100 text-brand-dark shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="font-extrabold text-sm">{t.number}</span>
                              <span className="text-[9px] text-zinc-400">({t.phone})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold text-zinc-500">{t.time}</span>
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider block ${
                                t.status === 'called'
                                  ? 'bg-brand-blue text-white'
                                  : t.status === 'finished'
                                    ? 'bg-zinc-200 text-zinc-500'
                                    : 'bg-zinc-100 text-zinc-600'
                              }`}>
                                {t.status === 'called' ? 'Dilayani' : t.status === 'finished' ? 'Selesai' : 'Tunggu'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Primary Button Action Calling */}
                    <button 
                      onClick={handleCallNext}
                      disabled={isCalling}
                      className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                        isCalling 
                          ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed' 
                          : 'bg-brand-blue text-white hover:bg-brand-blue/95 shadow-md shadow-brand-blue/20'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isCalling ? 'Memanggil...' : 'Panggil Antrean Berikutnya'}</span>
                    </button>
                  </div>

                  {/* Right Column: Simulated Customer Mobile Scanner */}
                  <div className="bg-zinc-50 p-6 rounded-[2rem] border border-zinc-150 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <Phone className="w-5 h-5 text-zinc-500 font-bold" />
                          <h3 className="font-extrabold text-sm text-brand-dark">Panduan Ponsel Pelanggan [Simulasi]</h3>
                        </div>
                        <span className="w-2.5 h-2.5 bg-brand-blue rounded-full animate-pulse"></span>
                      </div>

                      <p className="text-[11px] text-zinc-500 leading-relaxed mb-6">
                        Simulasikan proses dari sudut pandang pengunjung Anda. Masukkan nomor ponsel mereka di bawah untuk mensimulasikan pemindaian scan dan perolehan nomor antrean secara otomatis.
                      </p>

                      <form onSubmit={handleSimulateScan} className="space-y-4 bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
                        <div>
                          <label className="block text-[8px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Nomor Ponsel Pengunjung Simulasi</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Contoh: 0812345678"
                            value={newCustomerPhone}
                            onChange={(e) => setNewCustomerPhone(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-150 rounded-xl text-xs font-semibold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                          />
                        </div>
                        <button 
                          type="submit"
                          className="w-full py-3 bg-zinc-900 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-md shadow-zinc-800/15"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Ambil Tiket Antrean</span>
                        </button>
                      </form>

                      {/* Simulator flow instructions graphic */}
                      <div className="mt-6 p-4 bg-brand-blue/5 rounded-2xl border border-brand-blue/10 flex gap-3 text-[10px] leading-relaxed text-zinc-500">
                        <AlertCircle className="w-5 h-5 text-brand-blue shrink-0" />
                        <div>
                          <span className="font-extrabold text-brand-dark">Bagaimana Pelanggan Tahu Gilirannya?</span>
                          <p className="mt-0.5">Setelah menginput detail, antrean digital akan terus ter-update secara otomatis di HP mereka, disertai pengingat notifikasi.</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-6 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-400">
                      <span>Metode Scan: Kamera / WA</span>
                      <span className="font-bold text-brand-blue">AntriKu Cloud Ready</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Control Actions (Prev/Next Step) */}
          <div className="mt-12 pt-8 border-t border-zinc-100 flex justify-between items-center">
            <button 
              onClick={handlePrevStep}
              disabled={activeStep === 0}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${
                activeStep === 0 
                  ? 'text-zinc-300 pointer-events-none' 
                  : 'text-zinc-550 bg-zinc-100 hover:bg-zinc-200'
              }`}
            >
              Kembali
            </button>

            {activeStep < 2 ? (
              <button 
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue/95 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-brand-blue/15"
              >
                <span>Langkah Selanjutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#10B981] flex items-center gap-2">
                <Check className="w-4 h-4 animate-bounce" />
                <span>Onboarding Selesai! Anda Siap Melayani.</span>
              </span>
            )}
          </div>

        </div>

        {/* Dynamic FAQ Onboarding Tips */}
        <div className="mt-20">
          <h3 className="text-xl font-extrabold text-brand-dark mb-8 text-center">Metode Pemasangan Lainnya di Lokasi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-zinc-150 shadow-sm">
              <span className="text-sm font-extrabold text-brand-blue uppercase">01 / Meja Resepsionis</span>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Letakkan akrilik QR Code tepat di area depan pintu masuk atau kasir agar semua orang langsung memindainya tanpa perlu antre di meja.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-150 shadow-sm">
              <span className="text-sm font-extrabold text-brand-blue uppercase">02 / Stiker Pintu</span>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Tempelkan stiker vinyl kualitas tinggi di kaca depan pintu toko. Pelanggan bahkan bisa mengambil nomor antrean sebelum toko resmi dibuka pagi hari.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-150 shadow-sm">
              <span className="text-sm font-extrabold text-brand-blue uppercase">03 / Display Monitor</span>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Tampilkan QR Code pada monitor display ruang tunggu yang juga menampilkan nomor antrean teraktif saat ini dalam ukuran besar.</p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
