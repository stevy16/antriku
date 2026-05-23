import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { 
  Users, 
  Play, 
  SkipForward, 
  RotateCcw, 
  Pause, 
  QrCode, 
  Download, 
  BarChart3, 
  Sparkles, 
  Smartphone, 
  Clock, 
  HelpCircle, 
  Settings, 
  MessageSquare, 
  Bell, 
  Layers, 
  Sliders, 
  Printer, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    authState, 
    queue, 
    analytics, 
    isPaused, 
    callNext, 
    skipTicket, 
    servedTicket, 
    resetQueue, 
    togglePauseQueue, 
    getQRUrl,
    addBusinessBranch
  } = useQueue();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'operasional' | 'qrcode' | 'analitik' | 'integrasi'>('operasional');
  
  // State for which counter the admin is simulating
  const [selectedCounter, setSelectedCounter] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<string>('A');
  const [qrSize, setQrSize] = useState<number>(200);
  const [selectedBranchAdmin, setSelectedBranchAdmin] = useState<string>('Semua Lokasi');
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [newBranchInput, setNewBranchInput] = useState('');

  // States for printing
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto redirect if not logged in
  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/get-started');
    }
  }, [authState]);

  const business = authState.business || {
    name: 'Klinik Sehat Bersama',
    category: 'Klinik & Kesehatan',
    address: 'Jl. Sudirman No 42, Jakarta',
    phone: '0812345678',
    totalCounters: 3,
    averageServiceTime: 12,
    branches: ['Cabang Senayan Utama', 'Cabang Bekasi Cyber Park', 'Cabang BSD Tangerang', 'Cabang Dago Bandung']
  };

  // Stats Calculations (optionally filtered by selected branch)
  const waitingList = queue.filter(q => q.status === 'waiting' && (selectedBranchAdmin === 'Semua Lokasi' || q.branch === selectedBranchAdmin));
  const callingList = queue.filter(q => q.status === 'calling' && (selectedBranchAdmin === 'Semua Lokasi' || q.branch === selectedBranchAdmin));
  const servedList = queue.filter(q => q.status === 'served' && (selectedBranchAdmin === 'Semua Lokasi' || q.branch === selectedBranchAdmin));
  const skippedList = queue.filter(q => q.status === 'skipped' && (selectedBranchAdmin === 'Semua Lokasi' || q.branch === selectedBranchAdmin));

  const currentOnCounter = (num: number) => {
    const item = queue.find(q => q.status === 'calling' && q.counterNumber === num && (selectedBranchAdmin === 'Semua Lokasi' || q.branch === selectedBranchAdmin));
    return item ? item.ticketNumber : '-';
  };

  // Copy scan link helper
  const handleCopyLink = () => {
    const url = getQRUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Generate downloadable flyer with canvas API
  const handleDownloadQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and Redraw HQ Flyer
    canvas.width = 400;
    canvas.height = 550;

    // Draw background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 400, 550);

    // Draw border accents
    ctx.strokeStyle = '#2563EB'; // Brand Blue
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, 386, 536);

    // Header branding
    ctx.fillStyle = '#1e1b4b'; // Dark Indigo
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PINDAI QR UNTUK ANTRIAN', 200, 50);

    ctx.fillStyle = '#2563EB';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(business.name, 200, 85);

    ctx.fillStyle = '#4b5563';
    ctx.font = 'normal 12px Arial';
    ctx.fillText(business.category + ' | Sistem Online Berbasis Awan', 200, 110);

    // Render modern simulated QR Box
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(100, 150, 200, 200);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 150, 200, 200);

    // Draw outer corner markers of QR Code representing professional standard
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(115, 165, 45, 45);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(123, 173, 29, 29);
    ctx.fillStyle = '#2563EB';
    ctx.fillRect(129, 179, 17, 17);

    // Top Right Marker
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(240, 165, 45, 45);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(248, 173, 29, 29);
    ctx.fillStyle = '#2563EB';
    ctx.fillRect(254, 179, 17, 17);

    // Bottom Left Marker
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(115, 290, 45, 45);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(123, 298, 29, 29);
    ctx.fillStyle = '#2563EB';
    ctx.fillRect(129, 304, 17, 17);

    // Fill the rest with beautiful QR random blocks representing URL payload
    ctx.fillStyle = '#1e1b4b';
    for (let x = 170; x < 235; x += 10) {
      for (let y = 165; y < 330; y += 10) {
        if (Math.random() > 0.4) {
          ctx.fillRect(x, y, 7, 7);
        }
      }
    }
    for (let x = 115; x < 285; x += 10) {
      for (let y = 240; y < 280; y += 10) {
        if (Math.random() > 0.4) {
          ctx.fillRect(x, y, 7, 7);
        }
      }
    }

    // Mini application icon logo inside the center of printed QR flyer
    ctx.fillStyle = '#2563EB';
    ctx.fillRect(182, 232, 36, 36);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.strokeRect(182, 232, 36, 36);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('A', 200, 258);

    // Flyer Bottom Instructions
    ctx.fillStyle = '#1e1b4b';
    ctx.font = 'bold 13px Arial';
    ctx.fillText('Tunggu Giliran dari Manapun!', 200, 390);

    ctx.fillStyle = '#4b5563';
    ctx.font = 'normal 11px Arial';
    ctx.fillText('1. Pindai QR di atas menggunakan kamera smartphone', 200, 420);
    ctx.fillText('2. Masukkan nama & data penerima notifikasi WhatsApp', 200, 440);
    ctx.fillText('3. Pantau antrean secara live di mana saja', 200, 460);

    // Fine print
    ctx.fillStyle = '#9ca3af';
    ctx.font = 'italic bold 9px Arial';
    ctx.fillText('Didukung penuh oleh AntriKu (SaaS Indonesia)', 200, 510);

    // Trigger download trigger
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Flyer_QR_${business.name.replace(/\s+/g, '_')}.png`;
    link.href = image;
    link.click();
  };

  // Synthesize dynamic flyer on screen rendering trigger
  useEffect(() => {
    // Basic rendering representing static layout
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#F3F4F6';
        ctx.fillRect(0, 0, 150, 150);
        ctx.fillStyle = '#2563EB';
        ctx.fillRect(15, 15, 40, 40);
        ctx.fillRect(95, 15, 40, 40);
        ctx.fillRect(15, 95, 40, 40);
      }
    }
  }, [activeTab]);

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-zinc-50 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Upper Dashboard Header info */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 bg-white p-8 rounded-[2rem] border border-zinc-150/80 shadow-md shadow-zinc-200/50">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-extrabold text-[10px] uppercase tracking-wider rounded-full">
                SaaS Administrator Mode
              </span>
              <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500 animate-ping'}`}></span>
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{isPaused ? 'Antrean Di-Pause' : 'Sistem Beroperasi'}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-brand-dark mt-2 tracking-tight">{business.name}</h1>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
              <span>📍 {business.address}</span>
              <span>•</span>
              <span className="font-bold text-brand-blue">{business.category}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => navigate('/display')}
              className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
            >
              <ExternalLink className="w-4 h-4 text-zinc-500" />
              <span>Buka Layar Display</span>
            </button>
            <button 
              onClick={togglePauseQueue}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
                isPaused 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                  : 'bg-amber-400 hover:bg-amber-500 text-brand-dark'
              }`}
            >
              <Pause className="w-4 h-4" />
              <span>{isPaused ? 'Buka Kunci Antrean (Resume)' : 'Pause Antrean'}</span>
            </button>
            <button 
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin me-reset seluruh antrean hari ini? Semua riwayat antrean aktif akan hilang.')) {
                  resetQueue();
                }
              }}
              className="px-5 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Antrean</span>
            </button>
          </div>
        </header>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-zinc-200 mb-8 overflow-x-auto gap-4 custom-scrollbar">
          {[
            { id: 'operasional', label: 'Operasional Harian', icon: <Sliders className="w-4 h-4" /> },
            { id: 'qrcode', label: 'QR Code System', icon: <QrCode className="w-4 h-4" /> },
            { id: 'analitik', label: 'Analitik & Grafik', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'integrasi', label: 'Integrasi WhatsApp', icon: <MessageSquare className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-2 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-brand-blue text-brand-blue' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-650'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Tab Contents */}
        {activeTab === 'operasional' && (
          <div className="space-y-8">
            
            {/* Global Branch/Location Selector Bar for Staf Administrator */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/30 border border-blue-150 p-4.5 rounded-[1.5rem] flex flex-col sm:flex-row justify-between items-center gap-4.5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white">
                  <Sliders className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider">Fokus Operasional Kantor / Cabang</h4>
                  <p className="text-[10px] text-zinc-500">Pilih cabang kantor tempat loket Anda berada untuk mengelola antrean di lokasi tersebut.</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto font-sans justify-end md:shrink-0">
                {showAddBranch ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newBranchInput.trim()) {
                        addBusinessBranch(newBranchInput.trim());
                        setSelectedBranchAdmin(newBranchInput.trim()); // Focus on it
                        setNewBranchInput('');
                        setShowAddBranch(false);
                      }
                    }}
                    className="flex items-center gap-2 bg-white border border-blue-200 p-1.5 rounded-xl shadow-sm"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Nama Cabang baru..."
                      value={newBranchInput}
                      onChange={(e) => setNewBranchInput(e.target.value)}
                      className="bg-transparent text-xs text-brand-dark px-3 py-1.5 focus:outline-none placeholder-zinc-400 font-bold max-w-[150px]"
                    />
                    <button
                      type="submit"
                      className="bg-brand-blue text-white text-[10px] uppercase font-black px-3.5 py-1.5 rounded-lg hover:bg-brand-blue/95 transition-all shadow-sm cursor-pointer"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddBranch(false);
                        setNewBranchInput('');
                      }}
                      className="text-zinc-400 hover:text-zinc-650 px-1 font-bold text-xs cursor-pointer"
                    >
                      Batal
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddBranch(true)}
                    className="text-[10px] bg-sky-500/10 border border-sky-500/20 text-[#0284C7] font-black px-3.5 py-2.5 rounded-xl hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all cursor-pointer shadow-sm shrink-0"
                  >
                    + Lokasi Baru
                  </button>
                )}

                <div className="relative w-full sm:w-auto font-sans">
                  <select 
                    value={selectedBranchAdmin}
                    onChange={(e) => setSelectedBranchAdmin(e.target.value)}
                    className="bg-white border border-blue-200 text-brand-blue font-extrabold text-xs rounded-xl pl-4 pr-10 py-2.5 w-full sm:w-64 focus:outline-none focus:border-brand-blue cursor-pointer shadow-sm appearance-none"
                  >
                    <option value="Semua Lokasi">🌐 Kelola Semua Cabang</option>
                    {business.branches?.map(b => (
                      <option key={b} value={b}>📍 {b}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-brand-blue">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Real-time counters summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Menunggu', count: waitingList.length, color: 'text-brand-blue bg-brand-blue/5 border-brand-blue/10' },
                { label: 'Sedang Dipanggil', count: callingList.length, color: 'text-amber-500 bg-amber-500/5 border-amber-500/10' },
                { label: 'Selesai Dilayani', count: servedList.length, color: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10' },
                { label: 'Dilewati (Skipped)', count: skippedList.length, color: 'text-zinc-400 bg-zinc-100 border-zinc-200' }
              ].map((stat, i) => (
                <div key={i} className={`p-6 rounded-2xl border bg-white flex flex-col justify-between shadow-sm`}>
                  <p className="text-[10px] uppercase font-extrabold tracking-widest text-zinc-400">{stat.label}</p>
                  <span className={`text-4xl font-black mt-3 block ${stat.color.split(' ')[0]}`}>{stat.count}</span>
                  <div className="mt-4 pt-4 border-t border-zinc-100 text-[10px] text-zinc-500 font-medium">
                    Total Hari Ini: <span className="font-bold text-brand-dark">{queue.length} pelanggan</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calling Management Panels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Panel: Active Counter Calling Operations */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-zinc-150/80 shadow-md">
                <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-base text-brand-dark">Panggilan Antrean Loket</h3>
                    <p className="text-xs text-zinc-500">Pilih loket aktif Anda dan panggil pelanggan berikutnya secara berurutan.</p>
                  </div>
                  
                  {/* Counter Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">LOKET AKTIF:</span>
                    <select 
                      value={selectedCounter}
                      onChange={(e) => setSelectedCounter(parseInt(e.target.value))}
                      className="bg-zinc-100 border border-zinc-200 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-blue"
                    >
                      {Array.from({ length: business.totalCounters }).map((_, i) => (
                        <option key={i+1} value={i+1}>Loket {i+1}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Simulated counter calling visual */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 p-6 rounded-2xl border border-zinc-150 mb-8">
                  <div className="bg-white rounded-xl p-5 border border-zinc-100 shadow-sm text-center">
                    <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Sedang Dilayani Loket {selectedCounter}</p>
                    <span className="text-6xl font-black text-brand-dark tracking-tighter">
                      {currentOnCounter(selectedCounter)}
                    </span>
                    <div className="mt-4 flex justify-center gap-2">
                      <button 
                        onClick={() => {
                          const currentCall = queue.find(q => q.status === 'calling' && q.counterNumber === selectedCounter);
                          if (currentCall) {
                            servedTicket(currentCall.id);
                          }
                        }}
                        disabled={currentOnCounter(selectedCounter) === '-'}
                        className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-zinc-200 disabled:text-zinc-400 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all"
                      >
                        Selesai Dilayani
                      </button>
                      <button 
                        onClick={() => {
                          const currentCall = queue.find(q => q.status === 'calling' && q.counterNumber === selectedCounter);
                          if (currentCall) {
                            skipTicket(currentCall.id);
                          }
                        }}
                        disabled={currentOnCounter(selectedCounter) === '-'}
                        className="px-4 py-2 bg-zinc-200 text-zinc-700 hover:bg-zinc-300 disabled:bg-zinc-100 disabled:text-zinc-400 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                      >
                        Lewati (Skip)
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-2">Statistik Tunggu Utama</span>
                      <div className="flex justify-between text-xs py-1.5 border-b border-zinc-100/60 font-bold">
                        <span className="text-zinc-550">Sisa Menunggu:</span>
                        <span className="text-brand-blue">{waitingList.length} orang</span>
                      </div>
                      <div className="flex justify-between text-xs py-1.5 border-b border-zinc-100/60 font-bold">
                        <span className="text-zinc-550">Estimasi Tunggu Maks:</span>
                        <span className="text-brand-dark">{waitingList.length * business.averageServiceTime} menit</span>
                      </div>
                      <div className="flex justify-between text-xs py-1.5 font-bold">
                        <span className="text-zinc-550">Rata-rata Servis:</span>
                        <span className="text-emerald-500">{business.averageServiceTime} menit</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => callNext(selectedCounter, selectedBranchAdmin)}
                      className="w-full py-4 bg-brand-blue hover:bg-brand-blue/95 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-brand-blue/25 flex items-center justify-center gap-2 mt-4"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>PANGGIL ANTREAN BERIKUTNYA</span>
                    </button>
                  </div>
                </div>

                {/* Counter status board list */}
                <div>
                  <h4 className="font-extrabold text-xs text-brand-dark uppercase tracking-widest mb-4">Status Monitor Seluruh Loket</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Array.from({ length: business.totalCounters }).map((_, i) => {
                      const counterNum = i + 1;
                      const activeItem = queue.find(q => q.status === 'calling' && q.counterNumber === counterNum);
                      return (
                        <div key={counterNum} className="p-4 rounded-xl border border-zinc-150 bg-white shadow-sm flex flex-col justify-between">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">Loket {counterNum}</span>
                            <span className={`w-2 h-2 rounded-full ${activeItem ? 'bg-emerald-500 animate-ping' : 'bg-zinc-200'}`}></span>
                          </div>
                          <span className="text-2xl font-black text-brand-dark tracking-tighter">
                            {activeItem ? activeItem.ticketNumber : '-'}
                          </span>
                          <span className="text-[9px] text-zinc-500 font-medium truncate mt-1">
                            {activeItem ? activeItem.customerName : 'Istirahat / Kosong'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Panel: List of Waiting Customers with Direct actions */}
              <div className="bg-white rounded-3xl p-8 border border-zinc-150/80 shadow-md flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-extrabold text-base text-brand-dark">Daftar Antrean Aktif</h3>
                      <p className="text-[10px] text-zinc-500">Menampilkan seluruh urutan pelanggan saat ini.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-brand-blue/5 border border-brand-blue/10 text-brand-blue text-[9px] font-extrabold rounded-full">
                      {waitingList.length} Menunggu
                    </span>
                  </div>

                  {/* List Container */}
                  <div className="space-y-3 max-h-[360px] overflow-y-auto mb-6 pr-1 custom-scrollbar">
                    {queue.length === 0 ? (
                      <div className="text-center py-12 text-zinc-400 text-xs font-semibold">
                        Tidak ada riwayat antrean untuk hari ini.
                      </div>
                    ) : (
                      queue.map((item, idx) => (
                        <div 
                          key={item.id} 
                          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                            item.status === 'calling'
                              ? 'bg-amber-400/10 border-amber-400 text-amber-600 font-bold'
                              : item.status === 'served'
                                ? 'bg-zinc-50 border-zinc-200 text-zinc-400 line-through'
                                : item.status === 'skipped'
                                  ? 'bg-red-50/70 border-red-200/50 text-red-500'
                                  : 'bg-white border-zinc-150 text-brand-dark font-semibold'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-sm">{item.ticketNumber}</span>
                              <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[80px]">{item.customerName}</span>
                            </div>
                            <span className="text-[8px] text-zinc-400 mt-0.5 block">{item.customerPhone} ({item.createdAt})</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.status === 'waiting' && (
                              <>
                                <button
                                  onClick={() => callNext(selectedCounter, selectedBranchAdmin)}
                                  className="px-2.5 py-1 bg-brand-blue text-white rounded font-bold text-[9px] uppercase tracking-wider"
                                >
                                  Panggil
                                </button>
                                <button
                                  onClick={() => skipTicket(item.id)}
                                  className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-250 text-zinc-650 rounded font-bold text-[9px] uppercase tracking-wider"
                                >
                                  Skip
                                </button>
                              </>
                            )}
                            {item.status === 'calling' && (
                              <span className="text-[8px] font-black uppercase text-amber-500 border border-amber-400 rounded px-1 py-0.5 animate-pulse">
                                Dipanggil Loket {item.counterNumber}
                              </span>
                            )}
                            {item.status === 'served' && (
                              <span className="text-[8px] font-extrabold uppercase text-emerald-500 bg-emerald-500/5 border border-emerald-500/10 rounded px-1.5 py-0.5">
                                Selesai
                              </span>
                            )}
                            {item.status === 'skipped' && (
                              <button
                                onClick={() => callNext(selectedCounter, selectedBranchAdmin)}
                                className="px-2 py-0.5 bg-red-100 text-red-700 rounded font-bold text-[9px]"
                              >
                                Panggil Ulang
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-2xl flex gap-2.5 items-start text-[10px] text-zinc-500 leading-relaxed font-med">
                  <Smartphone className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-brand-dark block">Gunakan Multi-Layar!</span>
                    Gunakan handphone Anda untuk memindai QR Code di tab sistem QR, lalu panggil pelanggan lewat konsol kiri ini untuk menguji live-announcement TTS di tab layar display monitor utama.
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {activeTab === 'qrcode' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-zinc-150/80 shadow-md">
              <div className="max-w-3xl mb-8">
                <h3 className="font-extrabold text-lg text-brand-dark mb-2">QR Code Integrasi Antrean Fisik</h3>
                <p className="text-xs text-zinc-650 leading-relaxed">
                  AntriKu menghasilkan QR Code yang dipersonalisasi untuk bisnis Anda. Tempatkan QR Code ini pada meja register, resepsionis, pintu kaca, atau pamflet promosi. Pelanggan cukup memindainya untuk check-in, mendapatkan nomor, dan bebas menunggu di mana saja.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Left: QR code custom preferences controls */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">Tujuan URL Ambil Antrean (QR Payload)</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                      <input 
                        type="text" 
                        readOnly
                        value={getQRUrl()}
                        className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold text-brand-blue"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={handleCopyLink}
                      className="px-5 py-3 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Smartphone className="w-4 h-4" />}
                      <span>{copiedLink ? 'Link Tersalin!' : 'Salin Tautan Scan'}</span>
                    </button>
                    <button 
                      onClick={handleDownloadQR}
                      className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/95 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-brand-blue/25"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Poster Flyer (PNG)</span>
                    </button>
                  </div>

                  <div className="border-t border-zinc-100 pt-6">
                    <h4 className="font-extrabold text-xs text-brand-dark uppercase tracking-widest mb-3">Panduan Penempatan QR Code</h4>
                    <ul className="space-y-3.5 text-xs text-zinc-650 font-medium">
                      <li className="flex gap-3 items-center">
                        <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                        <span>Cetak dalam ukuran minimal 10x10 cm untuk pemindaian instan berjarak 1-2 meter.</span>
                      </li>
                      <li className="flex gap-3 items-center">
                        <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                        <span>Sediakan pelindung mika akrilik bening untuk melindunginya dari kotoran atau air.</span>
                      </li>
                      <li className="flex gap-3 items-center">
                        <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                        <span>Tempatkan petunjuk manual singkat agar pengunjung lansia terbiasa memindai kode.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right: Live Mock Flyer Display Sheet */}
                <div className="flex flex-col items-center justify-center p-6 bg-zinc-100/50 rounded-2xl border border-zinc-200">
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-4">Preview Poster Flyer QR</span>
                  
                  {/* Visual flyer card */}
                  <div className="w-[280px] bg-white border border-zinc-200 rounded-[1.8rem] p-5 shadow-xl relative text-center">
                    <span className="text-[8px] font-black text-brand-blue uppercase tracking-widest">Digital Check-In Portal</span>
                    <h4 className="font-extrabold text-lg text-brand-dark truncate mt-1">{business.name}</h4>
                    <p className="text-[9px] text-zinc-500">{business.category}</p>

                    {/* QR block code box */}
                    <div className="my-6 p-4 bg-zinc-50 border border-zinc-150 rounded-xl relative inline-block mx-auto">
                      <canvas ref={canvasRef} className="hidden" />
                      {/* Interactive visual placeholder represented */}
                      <div className="w-32 h-32 bg-white flex items-center justify-center relative p-1 pb-1">
                        <div className="grid grid-cols-4 gap-1 w-full h-full opacity-90">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`rounded ${
                                (i % 3 === 0 || i === 1 || i === 9 || i === 14) 
                                  ? 'bg-brand-dark' 
                                  : (i % 7 === 0) ? 'bg-brand-blue' : 'bg-transparent'
                              }`}
                            ></div>
                          ))}
                        </div>
                        <div className="absolute w-8 h-8 bg-brand-blue rounded border-2 border-white flex items-center justify-center text-white font-bold text-xs shadow-lg">A</div>
                      </div>
                      <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-brand-blue text-white font-extrabold text-[7px] uppercase tracking-wider rounded-full shadow-sm">
                        PINDAI DI SINI
                      </span>
                    </div>

                    <p className="text-[10px] font-bold text-brand-dark mt-2">Bebas Tunggu Tanpa Kepenatan Fisik</p>
                    <p className="text-[8px] text-zinc-450 mt-1 max-w-[200px] mx-auto leading-tight">Pindai kode QR digital di atas untuk mengambil tiket antrean WhatsApp instan.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {activeTab === 'analitik' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Visual SVG Graphs panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Daily report bar graph */}
              <div className="bg-white p-8 rounded-3xl border border-zinc-150/80 shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-extrabold text-sm text-brand-dark uppercase tracking-wider">Grafik Pelanggan Harian</h3>
                    <p className="text-[10px] text-zinc-400">Jumlah pengambilan tiket per hari dalam 1 minggu terakhir.</p>
                  </div>
                  <span className="text-xs font-bold text-brand-blue bg-brand-blue/5 rounded-full px-2.5 py-1">Live Terkini</span>
                </div>

                {/* Customized highly polished SVG Bar Chart */}
                <div className="h-64 flex items-end justify-between gap-4 pt-6 pb-2 px-2 bg-zinc-50 rounded-2xl border border-zinc-150">
                  {analytics.dailyReport.map((day, i) => {
                    const maxHeight = 160;
                    const valFactor = 95; // scaling
                    const heightPercent = Math.min(100, Math.max(12, (day.count / valFactor) * 100));
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                        <span className="text-[9px] font-bold text-brand-blue group-hover:scale-110 transition-all opacity-0 group-hover:opacity-100 pb-1.5">{day.count} pax</span>
                        <div 
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[28px] rounded-t-lg transition-all duration-700 ease-out group-hover:bg-brand-blue/90 ${
                            day.date.includes('Hari Ini') 
                              ? 'bg-brand-blue shadow-lg shadow-brand-blue/20' 
                              : 'bg-zinc-300'
                          }`}
                        ></div>
                        <span className="text-[8px] text-zinc-550 font-bold tracking-tight pt-2 mt-1 block truncate w-full text-center">{day.date.split(' ')[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Busy hours step chart */}
              <div className="bg-white p-8 rounded-3xl border border-zinc-150/80 shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-extrabold text-sm text-brand-dark uppercase tracking-wider">Jam Ramai & Peak Hours</h3>
                    <p className="text-[10px] text-zinc-400">Akumulasi kepadatan kunjungan berdasarkan jam operasional.</p>
                  </div>
                  <HelpCircle className="w-4 h-4 text-zinc-400 cursor-pointer" />
                </div>

                {/* Custom SVG Stepped Area Chart */}
                <div className="h-64 bg-zinc-50 rounded-2xl border border-zinc-150 p-6 flex flex-col justify-between">
                  <div className="flex-1 flex items-end justify-between gap-2.5 relative">
                    
                    {/* Background gridlines representation */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                      <div className="w-full border-t border-dashed border-zinc-300"></div>
                      <div className="w-full border-t border-dashed border-zinc-300"></div>
                      <div className="w-full border-t border-dashed border-zinc-300"></div>
                    </div>

                    {/* Chart Columns representing hours */}
                    {analytics.busyHours.map((hour, i) => {
                      const peakFactor = 35;
                      const heightPercent = Math.min(100, Math.max(15, (hour.count / peakFactor) * 100));
                      const isHigh = hour.count >= 24;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end z-10">
                          <span className="text-[8px] font-extrabold text-brand-dark opacity-0 group-hover:opacity-100 mb-1">{hour.count}</span>
                          <div 
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full max-w-[12px] rounded-full transition-all duration-500 ${
                              isHigh 
                                ? 'bg-amber-400 shadow-md shadow-amber-400/20' 
                                : 'bg-zinc-300'
                            }`}
                          ></div>
                          <span className="text-[8px] text-zinc-450 font-bold pt-2 mt-1">{hour.hour.split(':')[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-200 flex justify-between items-center text-[10px] font-bold text-zinc-450 uppercase tracking-widest leading-none">
                    <span>🕒 Puncak Teramai: 10:00 - 12:00</span>
                    <span className="text-amber-500">Kepadatan Tinggi</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Service times performance indicators matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-zinc-150/80 shadow-sm">
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Durasi Layanan</span>
                <span className="text-3xl font-black text-brand-dark block mt-2">12 Menit</span>
                <p className="text-[10px] text-zinc-500 mt-2">Rata-rata pelayanan per satu counter atau staf medis.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-zinc-150/80 shadow-sm">
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Rasio Kehadiran</span>
                <span className="text-3xl font-black text-emerald-500 block mt-2">{analytics.servedPercent}%</span>
                <p className="text-[10px] text-zinc-500 mt-2">Persentase pelanggan yang hadir sampai selesai dipanggil.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-zinc-150/80 shadow-sm">
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Rasio Dilewati (Skipped)</span>
                <span className="text-3xl font-black text-amber-500 block mt-2">{analytics.skippedPercent}%</span>
                <p className="text-[10px] text-zinc-500 mt-2">Rasio pelanggan yang terpaksa di-skip karena terlambat hadir.</p>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'integrasi' && (
          <div className="bg-white p-8 rounded-3xl border border-zinc-150/80 shadow-md">
            <header className="mb-8 border-b border-zinc-100 pb-4">
              <h3 className="font-extrabold text-lg text-brand-dark">Webhook WhatsApp API Sandbox</h3>
              <p className="text-xs text-zinc-550 leading-relaxed mt-1">
                Kami menyediakan integrasi API gateway WhatsApp resmi di Indonesia. Saat nomor antrean dipanggil, sistem Cloud AntriKu otomatis membroadcast pesan notifikasi interaktif ke WhatsApp pelanggan.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Left explanation column */}
              <div className="space-y-6">
                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-150">
                  <h4 className="font-extrabold text-xs text-brand-dark uppercase tracking-widest mb-3">Struktur Broadcast Pesan Otomatis</h4>
                  
                  {/* Whatsapp mockup bubble representing live payload */}
                  <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-t-2xl rounded-br-2xl text-xs space-y-2 relative max-w-sm">
                    <div className="flex justify-between items-center border-b border-emerald-100/40 pb-1.5 text-[8px] font-black text-emerald-600 tracking-wider uppercase">
                      <span>✓ ANTRIKU INTEGRASI REGISTERED</span>
                      <span>10:35 AM</span>
                    </div>
                    <p className="font-semibold text-[11px] text-zinc-800 leading-relaxed">
                      Halo <span className="text-emerald-700 font-bold">*Citra Dewi*</span>, nomor antrean Anda <span className="text-emerald-700 font-bold">*B-01*</span> di *{business.name}* bersiap dipanggil! <br/><br/>
                      Estimasi sisa waktu: *3 Menit lagi* (Sisa 1 orang di depan Anda). Mohon bersiap menuju Loket Pelayanan. <br/><br/>
                      Terima kasih atas kerja sama Anda.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block">Pengaturan Autentikasi WhatsApp Gateway</span>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">API Key Token</label>
                        <input 
                          type="password" 
                          readOnly 
                          value="•••••••••••••••••••••••••••••••••"
                          className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Device ID Gateway</label>
                        <input 
                          type="text" 
                          readOnly 
                          value="wa_device_dev_77a9"
                          className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right column integration checklist */}
              <div className="space-y-6">
                <div className="p-6 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl">
                  <h4 className="font-extrabold text-xs text-brand-dark uppercase tracking-widest mb-4">Langkah Menghubungkan WhatsApp API</h4>
                  <div className="space-y-4">
                    {[
                      { step: '1', title: 'Verifikasi Nomor Bisnis WhatsApp', desc: 'Scan QR di dashboard provider web.antriku.co.id untuk mendaftarkan akun WA bisnis utama Anda.' },
                      { step: '2', title: 'Pilih Template Broadcast', desc: 'Tentukan isi template broadcast notifikasi pemanggilan antrean digital yang ramah bagi pelanggan.' },
                      { step: '3', title: 'Uji Coba Sandbox Berhasil', desc: 'Sistem siap membroadcast SMS dan pesan digital secara global ke seluruh nomor seluler Indonesia.' }
                    ].map((step, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="w-7 h-7 rounded-lg bg-brand-blue/10 text-brand-blue font-bold text-xs flex items-center justify-center shrink-0">
                          {step.step}
                        </div>
                        <div>
                          <h5 className="font-extrabold text-xs text-brand-dark leading-none mb-1">{step.title}</h5>
                          <p className="text-[10px] text-zinc-550 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold text-zinc-550 p-2 bg-zinc-50 rounded-xl border border-zinc-150">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                  <span>Integrasi WhatsApp Gateway: <span className="text-emerald-600 font-extrabold">Ready & Sandbox mode</span></span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
