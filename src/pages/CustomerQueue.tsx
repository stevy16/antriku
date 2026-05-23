import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Check, 
  Clock, 
  Smartphone,
  Tv,
  ArrowRight
} from 'lucide-react';

export default function CustomerQueue() {
  const { queue, takeTicket } = useQueue();
  const routerLocation = useLocation();
  const navigate = useNavigate();

  // Parse location query parameter
  const searchParams = new URLSearchParams(routerLocation.search);
  const selectedLocationName = searchParams.get('location') || 'Klinik Sehat Bersama';

  // Dynamic details based on location
  const getLocationDetails = () => {
    // 1. Try to fetch from LocalStorage list which contains both predefined and custom locations
    const saved = localStorage.getItem('antriku_all_locations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const matched = parsed.find(loc => loc.name === selectedLocationName);
          if (matched) {
            return {
              name: matched.name,
              category: matched.category,
              address: matched.address,
              services: matched.services || [
                { key: 'A', label: 'Layanan Utama' },
                { key: 'B', label: 'Layanan Pendukung' },
                { key: 'C', label: 'Kasir & Pembayaran' }
              ]
            };
          }
        }
      } catch (e) {
        console.error('Error parsing locations in queue page:', e);
      }
    }

    // 2. Fallbacks for standard hardcoded default options
    switch (selectedLocationName) {
      case 'Apotek Utama Jaya':
        return {
          name: 'Apotek Utama Jaya',
          category: 'Apotek',
          address: 'Jl. Gatot Subroto No. 15, Jakarta',
          services: [
            { key: 'A', label: 'Resep Dokter' },
            { key: 'B', label: 'Obat Bebas & Alkes' },
            { key: 'C', label: 'Pembayaran & Kasir' }
          ]
        };
      case 'Barbershop Gentlemens':
        return {
          name: 'Barbershop Gentlemens',
          category: 'Barbershop',
          address: 'Jl. Kemang Raya No. 8, Jakarta Selatan',
          services: [
            { key: 'A', label: 'Potong Rambut (Haircut)' },
            { key: 'B', label: 'Perawatan Wajah & Shaving' },
            { key: 'C', label: 'Pijat / Creambath' }
          ]
        };
      case 'Restoran Selera Nusantara':
        return {
          name: 'Restoran Selera Nusantara',
          category: 'Restoran',
          address: 'Jl. Dago No. 120, Bandung',
          services: [
            { key: 'A', label: 'Makan di Tempat (Dine-In)' },
            { key: 'B', label: 'Bawa Pulang (Takeaway)' },
            { key: 'C', label: 'Reservasi Khusus' }
          ]
        };
      case 'Klinik Sehat Bersama':
      default:
        return {
          name: selectedLocationName || 'Klinik Sehat Bersama',
          category: 'Klinik & Kesehatan',
          address: 'Jl. Sudirman No 42, Jakarta',
          services: [
            { key: 'A', label: 'Spesialis Umum / Dokter' },
            { key: 'B', label: 'Apotek / Serah Obat' },
            { key: 'C', label: 'Kasir & Pembayaran' }
          ]
        };
    }
  };

  const currentDetails = getLocationDetails();

  // Local state
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedService, setSelectedService] = useState('A');
  const [errorText, setErrorText] = useState('');

  // Active ticket of this device
  const [activeTicket, setActiveTicket] = useState<any | null>(() => {
    const saved = localStorage.getItem(`active_ticket_obj_${currentDetails.name}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Keep ticket state fresh with global queue update
  useEffect(() => {
    if (activeTicket) {
      const refreshed = queue.find(q => q.id === activeTicket.id);
      if (refreshed && JSON.stringify(refreshed) !== JSON.stringify(activeTicket)) {
        setActiveTicket(refreshed);
        localStorage.setItem(`active_ticket_obj_${currentDetails.name}`, JSON.stringify(refreshed));
      }
    }
  }, [queue, activeTicket, currentDetails.name]);

  const handleTakeQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorText('Harap lengkapi Nama Anda dan No WhatsApp.');
      return;
    }

    try {
      const newTicket = takeTicket(
        customerName.trim(), 
        customerPhone.trim(), 
        selectedService, 
        currentDetails.name
      );

      setActiveTicket(newTicket);
      localStorage.setItem(`active_ticket_obj_${currentDetails.name}`, JSON.stringify(newTicket));
      setCustomerName('');
      setCustomerPhone('');
      setErrorText('');
      setShowRegistrationForm(false);
    } catch (err) {
      setErrorText('Terjadi kendala saat menerbitkan nomor antrean.');
    }
  };

  const handleCancelQueue = () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan atau keluar dari antrean ini?')) {
      localStorage.removeItem(`active_ticket_obj_${currentDetails.name}`);
      setActiveTicket(null);
    }
  };

  // Stats
  const getWaitingCountBeforeMyTurn = () => {
    if (!activeTicket) return 0;
    const samePrefixWaiting = queue.filter(q => 
      q.branch === currentDetails.name && 
      q.categoryPrefix === activeTicket.categoryPrefix && 
      q.status === 'waiting'
    );
    const myIndex = samePrefixWaiting.findIndex(q => q.id === activeTicket.id);
    return myIndex >= 0 ? myIndex : 0;
  };

  const waitingBefore = getWaitingCountBeforeMyTurn();
  const averageTime = 10; // 10 minutes average per person

  // Monitor info per service
  const getStatusOfService = (prefix: string) => {
    const callingTicket = queue.find(q => 
      q.branch === currentDetails.name && 
      q.categoryPrefix === prefix && 
      q.status === 'calling'
    );
    return callingTicket ? callingTicket.ticketNumber : 'Belum Mulai';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-28 pb-20 px-6 bg-slate-50 min-h-screen text-sans"
    >
      <div className="max-w-md mx-auto">
        {/* Navigation back */}
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xs font-black text-zinc-450 uppercase tracking-widest mb-6 hover:text-brand-blue transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ganti Lokasi</span>
        </Link>

        {/* Location Information Header */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm relative overflow-hidden mb-6">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-blue"></div>
          
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-black uppercase text-brand-blue tracking-widest bg-brand-blue/5 border border-brand-blue/10 rounded-full px-3 py-1 mb-2 inline-block">
                📍 {currentDetails.category}
              </span>
              <h2 className="text-xl font-extrabold text-brand-dark tracking-tight leading-tight mt-1">
                {currentDetails.name}
              </h2>
              <p className="text-xs text-zinc-400 mt-2">
                {currentDetails.address}
              </p>
            </div>
          </div>
        </div>

        {/* Display Alert Messages */}
        {errorText && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-600 mb-6">
            ⚠️ {errorText}
          </div>
        )}

        {/* Interactive Step-by-Step Selection */}
        <AnimatePresence mode="wait">
          {!activeTicket ? (
            <div className="space-y-6">
              {/* If no active ticket, show the main dashboard for place, and an 'Ambil Antrean' Menu Button */}
              {!showRegistrationForm ? (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="bg-white rounded-[2.2rem] p-6 border border-zinc-200 shadow-sm text-center"
                >
                  <Smartphone className="w-12 h-12 text-brand-blue/80 mx-auto mb-4" />
                  <h3 className="text-base font-extrabold text-brand-dark mb-1">
                    Ingin Mengunjungi {currentDetails.name}?
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto mb-6">
                    Lihat antrean yang sedang dipanggil di bawah, atau klik tombol di bawah untuk mendaftar antrean digital.
                  </p>

                  {/* The Menu trigger: Ambil Antrean */}
                  <button
                    onClick={() => setShowRegistrationForm(true)}
                    className="w-full py-4 bg-brand-blue hover:bg-brand-blue/95 text-white text-xs font-extrabold uppercase tracking-widest rounded-2xl transition-all shadow-md shadow-brand-blue/20 cursor-pointer"
                  >
                    Ambil Antrean Baru
                  </button>
                </motion.div>
              ) : (
                /* REGISTRATION FORM CONTAINER */
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-[2.2rem] p-6 border border-zinc-200 shadow-lg"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-black text-brand-dark">Form Registrasi Antrean</h3>
                      <p className="text-[10px] text-zinc-400">Silakan lengkapi identitas Anda di bawah ini</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRegistrationForm(false)}
                      className="text-xs font-extrabold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl hover:bg-red-100 cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>

                  <form onSubmit={handleTakeQueue} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                        Nama Lengkap Anda
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                        <input
                          type="text"
                          required
                          placeholder="Masukkan nama lengkap Anda..."
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-zinc-200 rounded-2xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                        Nomor WhatsApp Aktif
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                        <input
                          type="text"
                          required
                          placeholder="Contoh: 0812345678"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-zinc-200 rounded-2xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    {/* Service Type Selection */}
                    <div>
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                        Silakan Pilih Jenis Layanan
                      </label>
                      <div className="grid grid-cols-1 gap-2.5">
                        {currentDetails.services.map((srv) => (
                          <button
                            key={srv.key}
                            type="button"
                            onClick={() => setSelectedService(srv.key)}
                            className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              selectedService === srv.key
                                ? 'bg-brand-blue border-brand-blue text-white shadow-md shadow-brand-blue/15'
                                : 'bg-slate-50 border-zinc-250 text-brand-dark hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                                selectedService === srv.key ? 'bg-white/20 text-white' : 'bg-zinc-150 text-zinc-650'
                              }`}>
                                {srv.key}
                              </span>
                              <span className="text-xs font-bold">{srv.label}</span>
                            </div>
                            {selectedService === srv.key && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ambil Antrean Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-4 bg-brand-blue hover:bg-brand-blue/95 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md shadow-brand-blue/25"
                      >
                        Ambil Antrean
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          ) : (
            /* SUCCESS TICKET DETAILS WATERMARK CARD */
            <motion.div
              key="ticket-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-[2.5rem] p-6 border-2 border-dashed border-zinc-200 shadow-xl relative text-center overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>

                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                  <Check className="w-6 h-6 stroke-[3px]" />
                </div>

                <span className="text-[9px] font-black text-emerald-650 uppercase tracking-widest bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 mt-1 inline-block">
                  Pendaftaran Antrean Berhasil
                </span>

                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-6">
                  NOMOR ANTREAN ANDA
                </h4>
                <div className="text-7xl font-black text-brand-dark tracking-tighter my-2">
                  {activeTicket.ticketNumber}
                </div>

                {/* Patient Information Table */}
                <div className="bg-slate-50 border border-zinc-200/80 rounded-2xl p-4 max-w-[280px] mx-auto space-y-2 mt-4 text-left">
                  <div className="flex justify-between text-xs font-bold text-zinc-500">
                    <span>Nama Lengkap:</span>
                    <span className="text-brand-dark font-extrabold">{activeTicket.customerName}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-zinc-500">
                    <span>No WhatsApp:</span>
                    <span className="text-zinc-700">{activeTicket.customerPhone}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-zinc-500">
                    <span>Jenis Layanan:</span>
                    <span className="text-brand-blue uppercase font-black">
                      {currentDetails.services.find(s => s.key === activeTicket.categoryPrefix)?.label || 'Umum'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-zinc-500 border-t border-zinc-100 pt-1.5 mt-1.5">
                    <span>Lokasi Tempat:</span>
                    <span className="text-zinc-700 font-extrabold truncate max-w-[150px]">{currentDetails.name}</span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-zinc-100 space-y-4">
                  {activeTicket.status === 'calling' ? (
                    <div className="p-3 bg-brand-blue text-white rounded-xl font-black text-center text-xs animate-bounce">
                      📢 GLiRAN ANDA DIPANGGIL! <br/>
                      Silakan merapat ke loket pelayanan sekarang.
                    </div>
                  ) : activeTicket.status === 'served' ? (
                    <div className="p-3 bg-emerald-500 text-white rounded-xl font-bold text-center text-xs">
                      ✓ Selesai Dilayani. Terima kasih!
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="bg-slate-50 p-3 rounded-xl border border-zinc-150">
                        <span className="text-[8px] text-zinc-450 uppercase block font-black mb-0.5">Antrean Depan</span>
                        <span className="text-base font-black text-zinc-700">{waitingBefore} orang</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-zinc-150">
                        <span className="text-[8px] text-zinc-450 uppercase block font-black mb-0.5">Estimasi Waktu</span>
                        <span className="text-base font-black text-brand-blue">{waitingBefore * averageTime} menit</span>
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider animate-pulse pt-1">
                    Status diperbarui secara langsung oleh petugas admin
                  </p>
                </div>
              </div>

              {/* Action route to Monitor TV Screen */}
              <Link
                to="/display"
                className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                <Tv className="w-4 h-4 text-emerald-400" />
                <span>Lihat Antrean di Monitor TV</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              {/* Cancel / Leave */}
              <button
                onClick={handleCancelQueue}
                className="w-full py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-650 text-[10px] font-bold rounded-2xl uppercase tracking-wider text-center block transition-colors cursor-pointer"
              >
                Batalkan Antrean
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-time calling boards */}
        <div className="mt-8 bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b border-zinc-100 pb-3">
            <h4 className="font-extrabold text-[10px] text-brand-dark uppercase tracking-widest">
              Gilirian Saat Ini di {currentDetails.name.replace('Cabang ', '')}
            </h4>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {currentDetails.services.map((srv) => (
              <div key={srv.key} className="p-3 bg-slate-50 rounded-xl border border-zinc-150 text-center">
                <span className="text-[8px] text-zinc-450 uppercase font-black block mb-0.5">{srv.label.substring(0, 15)}</span>
                <span className="text-sm font-black text-brand-blue">{getStatusOfService(srv.key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
