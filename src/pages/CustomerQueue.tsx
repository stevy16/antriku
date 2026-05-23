import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  User, 
  Phone, 
  Layout, 
  Check, 
  Clock, 
  RefreshCw, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  PhoneCall, 
  HelpCircle 
} from 'lucide-react';

export default function CustomerQueue() {
  const { authState, queue, takeTicket, isPaused } = useQueue();
  
  const business = authState.business || {
    name: 'Klinik Sehat Bersama',
    category: 'Klinik & Kesehatan',
    address: 'Jl. Sudirman No 42, Jakarta',
    phone: '0812345678',
    totalCounters: 3,
    averageServiceTime: 12,
    branches: ['Cabang Senayan Utama', 'Cabang Bekasi Cyber Park', 'Cabang BSD Tangerang', 'Cabang Dago Bandung']
  };

  // Local identity state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [categoryPrefix, setCategoryPrefix] = useState('A');
  const [selectedBranch, setSelectedBranch] = useState(() => {
    return business.branches?.[0] || 'Cabang Senayan Utama';
  });
  const [monitorBranch, setMonitorBranch] = useState(() => {
    return business.branches?.[0] || 'Cabang Senayan Utama';
  });

  const [activeTicketId, setActiveTicketId] = useState<string | null>(() => {
    return localStorage.getItem('my_active_ticket_id') || null;
  });

  const [alertError, setAlertError] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState<any | null>(() => {
    const saved = localStorage.getItem('my_active_ticket_obj');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return null;
  });

  const handleTakeQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPaused) {
      setAlertError('⛔ Maaf, pendaftaran antrean saat ini sedang di-pause sementara oleh administrator.');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setAlertError('Harap isi Nama Lengkap dan Nomor WhatsApp Anda.');
      return;
    }

    try {
      const ticket = takeTicket(customerName, customerPhone, categoryPrefix, selectedBranch);
      setActiveTicketId(ticket.id);
      setTicketSuccess(ticket);
      
      // Persist locally in device storage
      localStorage.setItem('my_active_ticket_id', ticket.id);
      localStorage.setItem('my_active_ticket_obj', JSON.stringify(ticket));
      
      setCustomerName('');
      setCustomerPhone('');
      setAlertError('');
    } catch (e) {
      setAlertError('Terdapat kendala operasional. Harap hubungi resepsionis langsung.');
    }
  };

  const handleLeaveQueue = () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan/meninggalkan antrean Anda?')) {
      localStorage.removeItem('my_active_ticket_id');
      localStorage.removeItem('my_active_ticket_obj');
      setActiveTicketId(null);
      setTicketSuccess(null);
    }
  };

  // Find live stats of active ticket
  const myLiveTicket = queue.find(q => q.id === activeTicketId) || ticketSuccess;
  
  // Calculate index / remaining queue before this customer
  const getProgressStats = () => {
    if (!myLiveTicket) return { beforeMeCount: 0, waitTime: 0 };
    
    // Filter waiting queue of the same prefix created before this ticket
    const prefixQueue = queue.filter(q => q.categoryPrefix === myLiveTicket.categoryPrefix && q.status === 'waiting');
    const myIndex = prefixQueue.findIndex(q => q.id === myLiveTicket.id);

    // If already served / called
    const liveStatus = queue.find(q => q.id === myLiveTicket.id)?.status || myLiveTicket.status;
    if (liveStatus === 'calling' || liveStatus === 'served') {
      return { beforeMeCount: 0, waitTime: 0, status: liveStatus };
    }

    const beforeMeCount = myIndex >= 0 ? myIndex : prefixQueue.length;
    const waitTime = beforeMeCount * business.averageServiceTime;

    return { beforeMeCount, waitTime, status: liveStatus };
  };

  const { beforeMeCount, waitTime, status: liveStatus } = getProgressStats();

  // Find currently calling for each category prefix
  const getCurrentlyCalling = (prefix: string) => {
    const item = queue.find(q => q.categoryPrefix === prefix && q.status === 'calling' && q.branch === monitorBranch);
    return item ? item.ticketNumber : 'Belum Mulai';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-zinc-50 min-h-screen text-sans"
    >
      <div className="max-w-md mx-auto">
        
        {/* Upper Business Header Details card */}
        <div className="bg-white rounded-[2rem] p-6 border border-zinc-150/80 shadow-md text-center mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-blue"></div>
          <p className="text-[9px] font-black uppercase text-brand-blue tracking-[0.2em] mb-1">Check-in Antrean Online</p>
          <h2 className="text-xl font-extrabold text-brand-dark tracking-tight">{business.name}</h2>
          <span className="text-[10px] bg-zinc-50 text-zinc-500 font-bold px-3 py-1 rounded-full border border-zinc-100 mt-2 inline-block">
            {business.category}
          </span>
          <p className="text-[10px] text-zinc-400 mt-2 truncate">📍 {business.address}</p>
        </div>

        {/* Dynamic Status Display alert messages */}
        {alertError && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold leading-normal">
            {alertError}
          </div>
        )}

        {/* Main Content Area Toggle: Input Form vs. Digital Ticket Card */}
        <AnimatePresence mode="wait">
          {!myLiveTicket ? (
            
            /* TICKET REGISTRATION FORM CONTAINER */
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-[2.2rem] p-8 border border-zinc-150 shadow-xl"
            >
              <div className="mb-6">
                <h3 className="text-lg font-black text-brand-dark mb-1">Ambil Antrean Baru</h3>
                <p className="text-[10px] text-zinc-450 leading-relaxed">Silakan lengkapi info di bawah ini untuk memperoleh tiket elektronik WhatsApp atau Web.</p>
              </div>

              {isPaused ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-700 font-bold mb-6 flex gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>Maaf, loket pendaftaran antrean saat ini sedang dinonaktifkan sementara oleh staf administrator. Silakan coba beberapa saat lagi.</span>
                </div>
              ) : null}

              <form onSubmit={handleTakeQueue} className="space-y-4">
                
                {/* Branch selection */}
                <div>
                  <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">Pilih Lokasi Kantor / Cabang</label>
                  <div className="relative font-sans">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue w-5 h-5" />
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs font-bold text-brand-blue focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-sm cursor-pointer appearance-none"
                    >
                      {business.branches?.map(b => (
                        <option key={b} value={b} className="text-zinc-700 font-semibold">{b}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-blue">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Full name input */}
                <div>
                  <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">Nama Lengkap Anda</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: Citra Dewi"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* WhatsApp Phone number input */}
                <div>
                  <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">No WhatsApp Penerima SMS / Notif</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: 0812345678"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Categories Tab prefix selection */}
                <div>
                  <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5 font-display">Tujuan / Pilihan Layanan</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { prefix: 'A', label: 'Spesialis Umum / Dokter' },
                      { prefix: 'B', label: 'Apotek / Serah Obat' },
                      { prefix: 'C', label: 'Kasir & Pembayaran' },
                      { prefix: 'D', label: 'Layanan Pengaduan' }
                    ].map(cat => (
                      <button 
                        key={cat.prefix}
                        type="button"
                        onClick={() => setCategoryPrefix(cat.prefix)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          categoryPrefix === cat.prefix 
                            ? 'bg-brand-blue border-brand-blue text-white shadow-md shadow-brand-blue/15'
                            : 'bg-zinc-50 border-zinc-150 text-brand-dark hover:bg-zinc-100'
                        }`}
                      >
                        <span className="font-extrabold text-xs">{cat.prefix}</span>
                        <span className={`text-[9px] font-bold tracking-tight mt-1 truncate ${categoryPrefix === cat.prefix ? 'text-blue-100' : 'text-zinc-405'}`}>
                          {cat.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Button Registration action click */}
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isPaused}
                    className={`w-full py-4 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                      isPaused 
                        ? 'bg-zinc-300 text-zinc-550 cursor-not-allowed shadow-none' 
                        : 'bg-brand-blue hover:bg-brand-blue/95 shadow-brand-blue/25 hover:scale-[1.01]'
                    }`}
                  >
                    <span>Dapatkan Antrean Digital</span>
                  </button>
                </div>

              </form>
            </motion.div>
          ) : (
            
            /* SECURE DIGITAL TICKET OVERWAY DISPLAY */
            <motion.div 
              key="ticket"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              
              {/* Actual digital card graphic */}
              <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-zinc-200 p-6 shadow-2xl relative text-center overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
                
                {/* Success sign header info badge design */}
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <Check className="w-6 h-6 stroke-[3px]" />
                </div>
                
                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                  Tiket Antrean Anda Aktif
                </span>
                
                <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-6 leading-none">Nomor Giliran</h4>
                <div className="text-7xl font-black text-brand-dark tracking-tighter my-2">
                  {myLiveTicket.ticketNumber}
                </div>
                
                <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-4 max-w-[280px] mx-auto space-y-2 mt-4 text-left">
                  <div className="flex justify-between text-xs font-bold font-display text-zinc-500">
                    <span>Pemegang Antrean:</span>
                    <span className="text-brand-dark">{myLiveTicket.customerName}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold font-display text-zinc-500">
                    <span>No WhatsApp:</span>
                    <span className="text-zinc-650">{myLiveTicket.customerPhone}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold font-display text-zinc-500">
                    <span>Layanan Kode:</span>
                    <span className="text-brand-blue uppercase">{myLiveTicket.categoryPrefix} Category</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold font-display text-zinc-500 border-t border-zinc-100 pt-1.5 mt-1.5">
                    <span>Lokasi Layanan:</span>
                    <span className="text-zinc-700 font-extrabold truncate max-w-[150px]">{myLiveTicket.branch || 'Cabang Senayan Utama'}</span>
                  </div>
                </div>

                {/* Estimated waiting stats metrics progress */}
                <div className="mt-8 pt-6 border-t border-zinc-150 space-y-4">
                  {liveStatus === 'calling' ? (
                    <div className="p-4 bg-brand-blue text-white rounded-xl font-bold text-center text-xs animate-bounce leading-relaxed">
                      📢 NOMOR ANDA DENGAN DI-PANGGIL! <br/>
                      Silakan menuju Loket loket staf atau kasir sekarang.
                    </div>
                  ) : liveStatus === 'served' ? (
                    <div className="p-4 bg-emerald-500 text-white rounded-xl font-bold text-center text-xs">
                      ✓ Pelayanan Selesai. Terima kasih atas kunjungan Anda!
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-150">
                        <span className="text-[8px] text-zinc-500 uppercase block font-extrabold leading-none pb-1">Antrean Sebelumnya</span>
                        <span className="text-lg font-black text-brand-dark">{beforeMeCount} orang</span>
                      </div>
                      <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-150">
                        <span className="text-[8px] text-zinc-500 uppercase block font-extrabold leading-none pb-1">Estimasi Menunggu</span>
                        <span className="text-lg font-black text-brand-blue">{waitTime} menit</span>
                      </div>
                    </div>
                  )}

                  {liveStatus === 'waiting' && (
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider animate-pulse">
                      Status diperbarui secara real-time dari Server...
                    </p>
                  )}
                </div>
              </div>

              {/* Leave queue cancel action */}
              <button 
                onClick={handleLeaveQueue}
                className="w-full py-4.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-2xl uppercase tracking-widest text-center block transition-colors"
              >
                Batalkan Antrean Saya
              </button>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Counters Board Monitor representing on-site screen */}
        <div className="mt-10 bg-white rounded-2xl p-6 border border-zinc-150/80 shadow-sm">
          <div className="flex flex-col gap-3.5 mb-4 border-b border-zinc-100 pb-4">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-xs text-brand-dark uppercase tracking-widest">Informasi Monitor Cabang</h4>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            
            {/* Custom Horizontal Branch selection pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 mt-1 scrollbar-hide">
              {business.branches?.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setMonitorBranch(b)}
                  className={`text-[10px] px-3 py-1.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer ${
                    monitorBranch === b
                      ? 'bg-brand-blue border-brand-blue text-white shadow-sm shadow-brand-blue/10 scale-[1.02]'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100'
                  }`}
                >
                  📍 {b.replace('Cabang ', '')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150">
              <span className="text-[8px] text-zinc-500 uppercase font-black block">Spesialis Umum (A)</span>
              <span className="text-lg font-black text-brand-dark">{getCurrentlyCalling('A')}</span>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150">
              <span className="text-[8px] text-zinc-500 uppercase font-black block">Apotek Obat (B)</span>
              <span className="text-lg font-black text-brand-dark">{getCurrentlyCalling('B')}</span>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150">
              <span className="text-[8px] text-zinc-500 uppercase font-black block">Kasir Pembayaran (C)</span>
              <span className="text-lg font-black text-brand-dark">{getCurrentlyCalling('C')}</span>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150">
              <span className="text-[8px] text-zinc-500 uppercase font-black block">Lainnya (D)</span>
              <span className="text-lg font-black text-brand-dark">{getCurrentlyCalling('D')}</span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
