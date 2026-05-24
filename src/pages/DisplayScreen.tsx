import React, { useState, useEffect, useRef } from 'react';
import { useQueue } from '../context/QueueContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tv, 
  Volume2, 
  Expand, 
  Minimize, 
  Clock, 
  LayoutGrid, 
  ChevronRight, 
  QrCode, 
  BellRing, 
  Volume1, 
  VolumeX 
} from 'lucide-react';

export default function DisplayScreen() {
  const { authState, queue } = useQueue();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [liveTime, setLiveTime] = useState('');
  const [muteSound, setMuteSound] = useState(false);
  const lastCalledIdRef = useRef<string | null>(null);

  const getDynamicBranches = () => {
    const saved = localStorage.getItem('antriku_all_locations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((loc: any) => loc.name);
        }
      } catch (e) {}
    }
    return ['Klinik Sehat Bersama', 'Apotek Utama Jaya', 'Barbershop Gentlemens', 'Restoran Selera Nusantara'];
  };

  const [branchesList, setBranchesList] = useState<string[]>(() => {
    return getDynamicBranches();
  });

  // Track the locations change from Storage and custom events
  useEffect(() => {
    const handleLocationsChange = () => {
      setBranchesList(getDynamicBranches());
    };
    window.addEventListener('storage', handleLocationsChange);
    window.addEventListener('antriku_locations_changed', handleLocationsChange);
    return () => {
      window.removeEventListener('storage', handleLocationsChange);
      window.removeEventListener('antriku_locations_changed', handleLocationsChange);
    };
  }, []);

  const business = authState.business 
    ? { ...authState.business, branches: branchesList }
    : {
        name: 'AntriKu Monitor',
        category: 'Layanan Publik',
        address: 'Sistem Pemantauan Antrean Terpadu',
        phone: '',
        totalCounters: 3,
        averageServiceTime: 10,
        branches: branchesList
      };

  const [tvBranch, setTvBranch] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('location') || params.get('branch') || 'Semua Lokasi';
  });

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen to queue changes to trigger live audio announcement verbalization ONLY once per new call
  useEffect(() => {
    const callingItems = queue.filter(q => q.status === 'calling');
    if (callingItems.length > 0) {
      // Find the most recently called item (highest calledAt or simply latest in list)
      const latestCall = callingItems[callingItems.length - 1];
      
      if (latestCall.id !== lastCalledIdRef.current) {
        lastCalledIdRef.current = latestCall.id;
        
        // Trigger Sound Beep & Indonesian SpeechSynthesis
        if (!muteSound) {
          triggerIndonesianTTS(latestCall);
        }
      }
    }
  }, [queue, muteSound]);

  const triggerIndonesianTTS = (ticket: any) => {
    try {
      // Beep sound
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
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);

      // Web Indonesian TTS Vocal Call
      setTimeout(() => {
        if ('speechSynthesis' in window) {
          const prefixLetter = ticket.ticketNumber.split('-')[0];
          const ticketNum = parseInt(ticket.ticketNumber.split('-')[1]);
          const counterNum = ticket.counterNumber || 1;

          const phrase = `Nomor antrean ${prefixLetter}, ${ticketNum}, silakan menuju loket ${counterNum}`;
          const utterance = new SpeechSynthesisUtterance(phrase);
          utterance.lang = 'id-ID';
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      }, 600);
    } catch (e) {
      console.log('Voice announcement failed (unsupported or blocked):', e);
    }
  };

  // Toggle Fullscreen layout
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Get current ticket on each counter
  const getCounterTicket = (counterNum: number) => {
    return queue.find(q => 
      q.status === 'calling' && 
      q.counterNumber === counterNum &&
      (tvBranch === 'Semua Lokasi' || q.branch === tvBranch)
    );
  };

  // Main highlighted call
  const activeCallingList = queue.filter(q => 
    q.status === 'calling' &&
    (tvBranch === 'Semua Lokasi' || q.branch === tvBranch)
  );
  const primaryCall = activeCallingList.length > 0 ? activeCallingList[activeCallingList.length - 1] : null;

  // Next waiting tickets list
  const nextWaitingList = queue.filter(q => 
    q.status === 'waiting' &&
    (tvBranch === 'Semua Lokasi' || q.branch === tvBranch)
  ).slice(0, 4);

  return (
    <div className={`pt-32 pb-16 px-6 lg:px-12 bg-[#0F172A] min-h-screen text-white font-sans flex flex-col justify-between transition-all duration-300 ${isFullscreen ? 'pt-12' : ''}`}>
      
      {/* Top Banner & TV Header */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-blue/20">
            <Tv className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-450 font-black">MONITOR ANTRIAN DIGITAL</span>
            <h1 className="text-xl font-extrabold tracking-tight">{business.name}</h1>
          </div>
        </div>

        {/* Dynamic Digital NTP Clock & Control Buttons */}
        <div className="flex items-center gap-6">
          {/* TV Branch Location Selector Dropdown */}
          <div className="relative font-sans hidden md:block">
            <select
              value={tvBranch}
              onChange={(e) => setTvBranch(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-[#60A5FA] text-xs font-extrabold rounded-xl pl-4 pr-10 py-2.5 cursor-pointer focus:outline-none focus:border-brand-blue appearance-none transition-colors"
            >
              <option value="Semua Lokasi">🌐 Semua Cabang</option>
              {business.branches?.map(b => (
                <option key={b} value={b}>📍 {b}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#60A5FA]">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-xs font-bold text-zinc-300">
            <Clock className="w-4 h-4 text-brand-blue" />
            <span className="font-mono">{liveTime || 'Memuat...'}</span>
          </div>

          <div className="flex gap-2.5">
            <button 
              onClick={() => setMuteSound(!muteSound)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                muteSound 
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' 
                  : 'bg-slate-950 border-slate-800 text-zinc-400 hover:text-white'
              }`}
            >
              {muteSound ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleToggleFullscreen}
              className="p-3 bg-slate-950 border border-slate-800 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Primary calling visual, Right sub-counters & upcoming queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 items-stretch">
        
        {/* Left Column: Primary highlighted Calling box */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl flex flex-col justify-between items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/5 blur-3xl rounded-full"></div>
          
          <div className="w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-blue/15 border border-brand-blue/35 text-brand-blue rounded-full mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#60A5FA]">SEDANG DIPANGGIL</span>
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Nomor Antrean Utama</p>
          </div>

          <div className="my-10">
            <AnimatePresence mode="wait">
              {primaryCall ? (
                <motion.div
                  key={primaryCall.id}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="font-black text-9xl sm:text-[11rem] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-200 cursor-pointer drop-shadow-[0_10px_20px_rgba(59,130,246,0.15)] leading-none select-none"
                  onClick={() => triggerIndonesianTTS(primaryCall)}
                >
                  {primaryCall.ticketNumber}
                </motion.div>
              ) : (
                <div className="text-zinc-500 text-3xl font-bold py-16 uppercase tracking-wider">
                  ANTREAN KOSONG
                </div>
              )}
            </AnimatePresence>
          </div>

          {primaryCall ? (
            <div className="w-full border-t border-slate-800 pt-8 mt-4">
              <div className="flex justify-center items-center gap-3">
                <span className="text-zinc-400 text-sm font-semibold uppercase">SILAKAN MENUJU KE:</span>
                <span className="px-5 py-2 bg-brand-blue text-white font-extrabold rounded-2xl text-xl uppercase tracking-widest shadow-lg shadow-brand-blue/20">
                  LOKET {primaryCall.counterNumber || 1}
                </span>
              </div>
              <p className="text-[11px] text-zinc-550 mt-4 capitalize font-semibold tracking-wider">
                Pemegang tiket: {primaryCall.customerName}
              </p>
            </div>
          ) : (
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest border-t border-slate-800 w-full pt-6">
              SELURUH REVISI ANTREAN SELESAI
            </div>
          )}

        </div>

        {/* Right Column: Dynamic sub-counters status list & grid of upcoming queue items */}
        <div className="flex flex-col justify-between gap-8 h-full">
          
          {/* Sub-counters board status */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-extrabold text-xs tracking-wider uppercase text-zinc-400 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-brand-blue" />
              <span>Daftar Monitor Loket</span>
            </h3>

            <div className="space-y-3">
              {Array.from({ length: business.totalCounters }).map((_, i) => {
                const counterNum = i + 1;
                const activeItem = getCounterTicket(counterNum);
                return (
                  <div key={counterNum} className="flex justify-between items-center p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-brand-blue uppercase">LOKET {counterNum}</span>
                      <span className="text-[10px] text-zinc-500 truncate max-w-[100px]">({activeItem ? activeItem.customerName : 'Istirahat'})</span>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl font-black text-sm tracking-tight ${
                      activeItem 
                        ? 'bg-brand-blue text-white animate-pulse' 
                        : 'bg-slate-900 text-zinc-650'
                    }`}>
                      {activeItem ? activeItem.ticketNumber : '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming tickets sequence */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-xs tracking-wider uppercase text-zinc-400 mb-4 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-brand-blue" />
                <span>Berikutnya Bersiap (Queue)</span>
              </h3>

              <div className="space-y-3">
                {nextWaitingList.length === 0 ? (
                  <div className="text-zinc-500 text-xs text-center py-10 font-bold uppercase">
                    TIDAK ADA DAFTAR TUNGGU
                  </div>
                ) : (
                  nextWaitingList.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-xs font-semibold">
                      <span className="text-zinc-300">{item.customerName}</span>
                      <span className="px-2.5 py-1 bg-slate-850 border border-slate-800 text-zinc-300 font-extrabold rounded-lg">
                        {item.ticketNumber}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Running Info Ticker Footer banner */}
      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden relative shadow-md">
        <div className="animate-marquee whitespace-nowrap text-xs text-zinc-300 flex items-center gap-12">
          <span>📢 Selamat datang di <span className="font-extrabold text-brand-blue">{business.name}</span>.</span>
          <span>•</span>
          <span>Silakan kunjungi portal halaman utama AntriKu untuk mengambil nomor antrean digital secara mandiri.</span>
          <span>•</span>
          <span>Mohon mendengarkan panggilan nomor antrean Anda dengan tertib. Prioritas kenyamanan dan akurasi layanan adalah komitmen utama kami.</span>
        </div>
      </div>

    </div>
  );
}
