import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { 
  Users, 
  Play, 
  SkipForward, 
  RotateCcw, 
  Pause, 
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
  ExternalLink,
  Send,
  CheckCheck
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
    addBusinessBranch
  } = useQueue();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'operasional' | 'analitik' | 'integrasi'>('operasional');
  
  // State for which counter the admin is simulating
  const [selectedCounter, setSelectedCounter] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<string>('A');
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [newBranchInput, setNewBranchInput] = useState('');

  // Auto redirect if not logged in
  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/auth');
    }
  }, [authState]);

  const getDynamicBranches = () => {
    const saved = localStorage.getItem('antriku_user_manual_branches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    // Default manual starting branch
    const initial = [authState.business?.name || 'Cabang Utama'];
    localStorage.setItem('antriku_user_manual_branches', JSON.stringify(initial));
    return initial;
  };

  const [branchesList, setBranchesList] = useState<string[]>(() => {
    return getDynamicBranches();
  });

  const handleAddNewBranchManual = (branchName: string) => {
    if (!branchName.trim()) return;
    const current = getDynamicBranches();
    if (current.includes(branchName.trim())) return;
    const updated = [...current, branchName.trim()];
    localStorage.setItem('antriku_user_manual_branches', JSON.stringify(updated));
    setBranchesList(updated);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('antriku_locations_changed'));
  };

  const handleRemoveBranchManual = (branchName: string) => {
    const current = getDynamicBranches();
    const updated = current.filter(b => b !== branchName);
    localStorage.setItem('antriku_user_manual_branches', JSON.stringify(updated));
    setBranchesList(updated);
    if (selectedBranchAdmin === branchName) {
      setSelectedBranchAdmin('Semua Lokasi');
    }
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('antriku_locations_changed'));
  };

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
        name: 'AntriKu Admin',
        category: 'Sistem Publik',
        address: 'Pusat Manajemen Antrean Terpadu',
        phone: '',
        totalCounters: 3,
        averageServiceTime: 10,
        branches: branchesList
      };

  const [autoSyncLocation, setAutoSyncLocation] = useState<boolean>(() => {
    const saved = localStorage.getItem('antriku_admin_auto_sync_location');
    return saved !== 'false'; // default is true
  });

  const [latestCustomerBranch, setLatestCustomerBranch] = useState<string>(() => {
    return localStorage.getItem('antriku_latest_customer_branch') || 'Klinik Sehat Bersama';
  });

  const [selectedBranchAdmin, setSelectedBranchAdmin] = useState<string>(() => {
    const savedAuto = localStorage.getItem('antriku_admin_auto_sync_location');
    const isAuto = savedAuto !== 'false';
    const currentList = getDynamicBranches();
    if (isAuto) {
      return localStorage.getItem('antriku_latest_customer_branch') || currentList[0] || 'Semua Lokasi';
    }
    return currentList[0] || 'Semua Lokasi';
  });

  // Track latest customer branch & auto sync if enabled
  useEffect(() => {
    const handleStorage = () => {
      const liveBranch = localStorage.getItem('antriku_latest_customer_branch');
      if (liveBranch) {
        setLatestCustomerBranch(liveBranch);
        if (autoSyncLocation) {
          setSelectedBranchAdmin(liveBranch);
        }
      }
    };

    handleStorage();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('antriku_customer_branch_changed', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('antriku_customer_branch_changed', handleStorage);
    };
  }, [autoSyncLocation]);

  // Persist autoSyncLocation toggle choice
  useEffect(() => {
    localStorage.setItem('antriku_admin_auto_sync_location', String(autoSyncLocation));
  }, [autoSyncLocation]);

  // WhatsApp Integration Sandbox state
  const [selectedWaCustomer, setSelectedWaCustomer] = useState<string>('');
  const [waCustomName, setWaCustomName] = useState<string>('');
  const [waCustomPhone, setWaCustomPhone] = useState<string>('');
  const [customWaMessage, setCustomWaMessage] = useState<string>('');
  const [waSendingState, setWaSendingState] = useState<'idle' | 'sending' | 'success'>('idle');
  const [waHistoryLogs, setWaHistoryLogs] = useState<Array<{ id: string; time: string; name: string; phone: string; message: string; ticket: string; status: string }>>(() => {
    const saved = localStorage.getItem('antriku_wa_history_logs2');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return [
      {
        id: 'wa_1',
        time: '10:15 WIB',
        name: 'Citra Dewi',
        phone: '0812345678',
        message: `Halo *Citra Dewi*, nomor antrean Anda *A-02* di *${business.name}* bersiap dipanggil! Mohon bersiap menuju Loket Pelayanan.\n\nHormat kami, Tim ${business.name}`,
        ticket: 'A-02',
        status: 'Terkirim ✓✓'
      },
      {
        id: 'wa_2',
        time: '10:30 WIB',
        name: 'Budi Santoso',
        phone: '0877112233',
        message: `Halo *Budi Santoso*, nomor antrean Anda *B-05* di *${business.name}* (${selectedBranchAdmin}) bersiap dipanggil! Mohon bersiap menuju Loket Pelayanan.\n\nSent via AntriKu.`,
        ticket: 'B-05',
        status: 'Terkirim ✓✓'
      }
    ];
  });

  // Save WhatsApp logs to localStorage
  useEffect(() => {
    localStorage.setItem('antriku_wa_history_logs2', JSON.stringify(waHistoryLogs));
  }, [waHistoryLogs]);

  // Handle selected customer change to auto-fill custom fields
  useEffect(() => {
    if (selectedWaCustomer && selectedWaCustomer !== 'custom') {
      const selectedItem = queue.find(q => q.id === selectedWaCustomer);
      if (selectedItem) {
        setWaCustomName(selectedItem.customerName);
        setWaCustomPhone(selectedItem.customerPhone || '08124294812');
        setCustomWaMessage(`Halo *${selectedItem.customerName}*, nomor antrean Anda *${selectedItem.ticketNumber}* di *${business.name}* (${selectedItem.branch}) bersiap dipanggil! Silakan beralih menuju ruangan pelayanan atau loket penanganan.\n\nTerima kasih atas kerja sama Anda.\n\n---\n*Pemberitahuan Sistem AntriKu*`);
      }
    } else if (selectedWaCustomer === 'custom') {
      // Keep input editable or empty
    } else {
      // default: first waiting queue customer or just general message
      const activeWaiting = queue.filter(q => q.status === 'waiting' || q.status === 'calling');
      if (activeWaiting.length > 0) {
        const item = activeWaiting[0];
        setSelectedWaCustomer(item.id);
        setWaCustomName(item.customerName);
        setWaCustomPhone(item.customerPhone);
        setCustomWaMessage(`Halo *${item.customerName}*, nomor antrean Anda *${item.ticketNumber}* di *${business.name}* (${item.branch}) bersiap dipanggil! Silakan beralih menuju ruangan pelayanan atau loket penanganan.\n\nTerima kasih atas kerja sama Anda.\n\n---\n*Pemberitahuan Sistem AntriKu*`);
      } else {
        setWaCustomName('Nama Pengunjung');
        setWaCustomPhone('0812345678');
        setCustomWaMessage(`Halo *Nama Pengunjung*, nomor antrean Anda siap untuk dipanggil di *${business.name}*. Harap bersiap!\n\n---\n*Pemberitahuan Sistem AntriKu*`);
      }
    }
  }, [selectedWaCustomer, queue, business.name]);

  const handleSendSimulatedWa = () => {
    if (!waCustomName.trim() || !waCustomPhone.trim() || !customWaMessage.trim()) return;

    setWaSendingState('sending');
    setTimeout(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
      
      const newLog = {
        id: 'wa_' + Math.random().toString(36).substring(2, 9),
        time: timeStr,
        name: waCustomName,
        phone: waCustomPhone,
        message: customWaMessage,
        ticket: queue.find(q => q.id === selectedWaCustomer)?.ticketNumber || 'UM-99',
        status: 'Terkirim ✓✓'
      };

      setWaHistoryLogs(prev => [newLog, ...prev]);
      setWaSendingState('success');
      
      // Reset back to idle after a brief indicator
      setTimeout(() => {
        setWaSendingState('idle');
      }, 2000);

    }, 1500);
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
                  <p className="text-[10px] text-zinc-500">Pilih cabang kantor tempat loket Anda berada atau gunakan mode hubung otomatis.</p>
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
                    onChange={(e) => {
                      setSelectedBranchAdmin(e.target.value);
                      // Disable autoSync if modified manually
                      if (autoSyncLocation && e.target.value !== latestCustomerBranch) {
                        setAutoSyncLocation(false);
                      }
                    }}
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

            {/* Live Autoconnect & Synchronization Status Indicator */}
            <div className="bg-white border border-zinc-200/80 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 shadow-inner text-xs -mt-5">
              <div className="flex items-center gap-2.5">
                <span className={`relative flex h-2.5 w-2.5 mt-0.5`}>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${autoSyncLocation ? 'bg-emerald-400' : 'bg-zinc-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${autoSyncLocation ? 'bg-emerald-500' : 'bg-zinc-300'}`}></span>
                </span>
                <span className="font-extrabold text-zinc-650">
                  {autoSyncLocation ? (
                    <span>
                      Tersambung Otomatis dengan Lokasi Pilihan Pelanggan: <strong className="text-brand-blue font-black">{latestCustomerBranch}</strong>
                    </span>
                  ) : (
                    <span>
                      Sinkronisasi Otomatis Nonaktif (Terakhir: <strong className="text-zinc-500">{latestCustomerBranch}</strong>)
                    </span>
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const targetState = !autoSyncLocation;
                  setAutoSyncLocation(targetState);
                  if (targetState) {
                    const live = localStorage.getItem('antriku_latest_customer_branch');
                    if (live) {
                      setSelectedBranchAdmin(live);
                    }
                  }
                }}
                className={`px-3.5 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm cursor-pointer ${
                  autoSyncLocation
                    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border border-zinc-300'
                    : 'bg-brand-blue hover:bg-brand-blue/95 text-white shadow-brand-blue/15'
                }`}
              >
                {autoSyncLocation ? '🔌 Putus Sambungan' : '⚡ Sambungkan Otomatis'}
              </button>
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
                    Hubungkan handphone Anda atau buka halaman web ini di tab baru sebagai pengunjung. Lalu panggil pelanggan lewat konsol kiri ini untuk menguji live-announcement TTS di tab layar display monitor utama.
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
            <header className="mb-8 border-b border-zinc-100 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-lg text-brand-dark flex items-center gap-2">
                  <span className="p-1 px-2.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black">WA API</span>
                  Integrasi Notifikasi WhatsApp Antrean
                </h3>
                <p className="text-xs text-zinc-550 mt-1">
                  Kirim pemberitahuan pemanggilan, status antrean, dan pengingat lewat WhatsApp langsung ke nomor telepon yang didaftarkan pelanggan.
                </p>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100/80 rounded-xl text-xs font-extrabold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                WhatsApp Gateway: Terhubung Otomatis
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: SIMULATION & DISPATCHER (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-zinc-50/50 p-6 rounded-2xl border border-zinc-150/80 space-y-4">
                  <h4 className="font-extrabold text-xs text-brand-dark uppercase tracking-widest flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-brand-blue" />
                    Kirim Pesan Notifikasi Baru
                  </h4>

                  {/* Customer Select Dropdown */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                      Ambil Otomatis Dari Pengunjung Terdaftar
                    </label>
                    <select
                      value={selectedWaCustomer}
                      onChange={(e) => setSelectedWaCustomer(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-blue cursor-pointer"
                    >
                      <option value="">-- Hubungkan Nomor Pengunjung Aktif --</option>
                      {queue.filter(q => q.status === 'waiting' || q.status === 'calling').map(q => (
                        <option key={q.id} value={q.id}>
                          [{q.ticketNumber}] {q.customerName} - {q.customerPhone || 'Tidak ada nomor'} ({q.branch})
                        </option>
                      ))}
                      <option value="custom">📝 Masukkan Nomor Kustom Secara Manual</option>
                    </select>
                  </div>

                  {/* Manual / Auto inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                        Nama Penerima
                      </label>
                      <input
                        type="text"
                        value={waCustomName}
                        onChange={(e) => {
                          setWaCustomName(e.target.value);
                          if (selectedWaCustomer !== 'custom') {
                            setSelectedWaCustomer('custom');
                          }
                        }}
                        placeholder="Nama Lengkap Pelanggan..."
                        className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                        Nomor WhatsApp (Tujuan)
                      </label>
                      <input
                        type="text"
                        value={waCustomPhone}
                        onChange={(e) => {
                          setWaCustomPhone(e.target.value);
                          if (selectedWaCustomer !== 'custom') {
                            setSelectedWaCustomer('custom');
                          }
                        }}
                        placeholder="Contoh: 08123456789 atau +62..."
                        className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-mono focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  {/* Draft Message */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                        Draft Pemberitahuan (WhatsApp Markdown)
                      </label>
                      <span className="text-[9px] text-zinc-400 font-bold font-mono">Simulasi Pesan Instan</span>
                    </div>
                    <textarea
                      rows={4}
                      value={customWaMessage}
                      onChange={(e) => setCustomWaMessage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-medium leading-relaxed focus:outline-none focus:border-brand-blue resize-none"
                    />
                  </div>

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={handleSendSimulatedWa}
                    disabled={waSendingState === 'sending' || !waCustomName.trim() || !waCustomPhone.trim()}
                    className={`w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      waSendingState === 'sending'
                        ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed'
                        : waSendingState === 'success'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/10'
                    }`}
                  >
                    {waSendingState === 'sending' ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-zinc-300 border-t-zinc-650 rounded-full animate-spin"></span>
                        Mengirim via Secure WhatsApp API...
                      </>
                    ) : waSendingState === 'success' ? (
                      <>
                        <Check className="w-4 h-4" />
                        Pesan Berhasil Terkirim ke WhatsApp Tujuan!
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Kirim Notifikasi WhatsApp Ke {waCustomName || 'Pelanggan'}
                      </>
                    )}
                  </button>
                </div>

                {/* VISUAL PHONE MOCKUP FOR CHAT INTERFACES */}
                <div className="bg-zinc-950 p-6 rounded-2xl text-white space-y-3 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2 text-[9px] font-black tracking-widest text-zinc-500 uppercase">
                    <span>💬 PRATINJAU WHATSAPP REAL-TIME</span>
                    <span>{waCustomPhone || '0812345678'}</span>
                  </div>
                  
                  <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl text-xs space-y-2 relative max-w-md">
                    <div className="flex justify-between items-center border-b border-zinc-800/60 pb-1 text-[8px] font-bold text-emerald-400 tracking-wider">
                      <span>✓ PANGGILAN OTOMATIS: {waCustomName || 'PELANGGAN'}</span>
                      <span>Now</span>
                    </div>
                    <p className="font-semibold text-[11px] text-zinc-200 whitespace-pre-line leading-relaxed">
                      {customWaMessage}
                    </p>
                    <div className="text-right text-[8px] text-zinc-500 flex items-center justify-end gap-1 select-none">
                      <span>Just now</span>
                      <CheckCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: HISTORI PENGIRIMAN & MONITOR (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-5 border border-zinc-150 rounded-2xl flex flex-col h-full justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs text-brand-dark uppercase tracking-widest mb-4 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-500" />
                      Log Pengiriman Terakhir
                    </h4>

                    {waHistoryLogs.length === 0 ? (
                      <div className="py-12 text-center text-zinc-400 space-y-2">
                        <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto" />
                        <p className="text-[10px] font-bold">Belum ada riwayat pengiriman notifikasi WhatsApp.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        {waHistoryLogs.map((log) => (
                          <div key={log.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-150/80 hover:bg-zinc-100/50 transition-colors text-xs space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="font-black text-brand-dark">{log.name}</span>
                              <span className="text-[9px] text-zinc-405 font-semibold font-mono">{log.time}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                              <span>Telp: {log.phone}</span>
                              <span className="font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 flex items-center gap-1">
                                {log.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-500 italic line-clamp-2 leading-relaxed border-t border-zinc-100 pt-1">
                              {log.message.replace(/\*/g, '')}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl mt-6">
                    <h5 className="font-black text-[10px] text-brand-dark uppercase tracking-wider mb-1">Mekanisme Autokoneksi WhatsApp</h5>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                      Sistem terhubung otomatis dengan database pendaftaran pelanggan. Begitu kasir atau operator memanggil pengunjung, detak API langsung mengirimkan payload pesan WhatsApp secara senyap tanpa Anda perlu melakukan apa pun secara manual!
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
