import React, { createContext, useContext, useState, useEffect } from 'react';
import { QueueItem, BusinessInfo, AuthState, AnalyticsData } from '../types';

interface QueueContextType {
  authState: AuthState;
  queue: QueueItem[];
  analytics: AnalyticsData;
  isPaused: boolean;
  registerBusiness: (name: string, category: string, phone: string, address: string, totalCounters: number) => boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  takeTicket: (name: string, phone: string, categoryPrefix: string, branch: string) => QueueItem;
  callNext: (counterNumber: number, branchFilter?: string) => void;
  skipTicket: (ticketId: string) => void;
  servedTicket: (ticketId: string) => void;
  resetQueue: () => void;
  togglePauseQueue: () => void;
  getQRUrl: () => string;
  addBusinessBranch: (branchName: string) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

// Initial mock data to make analytics beautiful right out of the box
const initialDaily = [
  { date: 'Senin', count: 42 },
  { date: 'Selasa', count: 58 },
  { date: 'Rabu', count: 65 },
  { date: 'Kamis', count: 50 },
  { date: 'Jumat', count: 72 },
  { date: 'Sabtu', count: 95 },
  { date: 'Minggu (Hari Ini)', count: 18 } // Live active today count
];

const initialHours = [
  { hour: '08:00', count: 5 },
  { hour: '09:00', count: 12 },
  { hour: '10:00', count: 24 },
  { hour: '11:00', count: 32 },
  { hour: '12:00', count: 15 },
  { hour: '13:00', count: 20 },
  { hour: '14:00', count: 28 },
  { hour: '15:00', count: 18 },
  { hour: '16:00', count: 8 }
];

export function QueueProvider({ children }: { children: React.ReactNode }) {
  // 1. Core States loaded from LocalStorage
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('antriku_auth');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return {
      isAuthenticated: false,
      token: null,
      role: 'admin',
      business: null
    };
  });

  const [queue, setQueue] = useState<QueueItem[]>(() => {
    const saved = localStorage.getItem('antriku_queue');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    // Default queue placeholders for Klinik & Kesehatan bid
    return [
      { id: '1', ticketNumber: 'A-01', customerName: 'Ahmad Faisal', customerPhone: '0812341234', categoryPrefix: 'A', status: 'served', createdAt: '10:00', counterNumber: 1, branch: 'Cabang Senayan Utama' },
      { id: '2', ticketNumber: 'A-02', customerName: 'Banu Tri', customerPhone: '0857233211', categoryPrefix: 'A', status: 'served', createdAt: '10:12', counterNumber: 2, branch: 'Cabang Senayan Utama' },
      { id: '3', ticketNumber: 'B-01', customerName: 'Citra Dewi', customerPhone: '0899222444', categoryPrefix: 'B', status: 'calling', createdAt: '10:20', counterNumber: 1, branch: 'Cabang Bekasi Cyber Park' },
      { id: '4', ticketNumber: 'A-03', customerName: 'Deni Setiawan', customerPhone: '0813987654', categoryPrefix: 'A', status: 'waiting', createdAt: '10:35', branch: 'Cabang Senayan Utama' },
      { id: '5', ticketNumber: 'A-04', customerName: 'Eva Melati', customerPhone: '0822111199', categoryPrefix: 'A', status: 'waiting', createdAt: '10:48', branch: 'Cabang BSD Tangerang' }
    ];
  });

  const [isPaused, setIsPaused] = useState<boolean>(() => {
    const saved = localStorage.getItem('antriku_paused');
    return saved === 'true';
  });

  const [analytics, setAnalytics] = useState<AnalyticsData>(() => {
    const saved = localStorage.getItem('antriku_analytics');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return {
      dailyReport: initialDaily,
      busyHours: initialHours,
      averageServiceTime: 12,
      totalCustomersToday: 18,
      skippedPercent: 8,
      servedPercent: 92
    };
  });

  // 2. Synchronize states across tabs on change
  useEffect(() => {
    localStorage.setItem('antriku_auth', JSON.stringify(authState));
  }, [authState]);

  useEffect(() => {
    localStorage.setItem('antriku_queue', JSON.stringify(queue));
    updateAnalytics();
  }, [queue]);

  useEffect(() => {
    localStorage.setItem('antriku_paused', String(isPaused));
  }, [isPaused]);

  useEffect(() => {
    localStorage.setItem('antriku_analytics', JSON.stringify(analytics));
  }, [analytics]);

  // Real-time Storage Synced Event Listener (Magic Multi-Tab updates!)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'antriku_queue' && e.newValue) {
        try {
          const parsedQueue = JSON.parse(e.newValue);
          setQueue(parsedQueue);
        } catch (_) {}
      }
      if (e.key === 'antriku_paused' && e.newValue) {
        setIsPaused(e.newValue === 'true');
      }
      if (e.key === 'antriku_auth' && e.newValue) {
        try {
          setAuthState(JSON.parse(e.newValue));
        } catch (_) {}
      }
      if (e.key === 'antriku_analytics' && e.newValue) {
        try {
          setAnalytics(JSON.parse(e.newValue));
        } catch (_) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Request permission for push-like notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 3. Helper Functions
  const updateAnalytics = () => {
    const todayCount = queue.length;
    const served = queue.filter(q => q.status === 'served').length;
    const skipped = queue.filter(q => q.status === 'skipped').length;
    const finishedCount = served + skipped;
    
    const servedPct = finishedCount > 0 ? Math.round((served / finishedCount) * 100) : 100;
    const skippedPct = finishedCount > 0 ? Math.round((skipped / finishedCount) * 100) : 0;

    // Adjust today's count in daily report
    const updatedDaily = [...analytics.dailyReport];
    const todayIndex = updatedDaily.findIndex(d => d.date.includes('Hari Ini'));
    if (todayIndex !== -1) {
      updatedDaily[todayIndex].count = todayCount;
    }

    setAnalytics(prev => ({
      ...prev,
      dailyReport: updatedDaily,
      totalCustomersToday: todayCount,
      servedPercent: servedPct,
      skippedPercent: skippedPct
    }));
  };

  // Play audio buzz & speak ticket numbers
  const triggerAudioAnnouncement = (ticket: QueueItem, counterNum: number) => {
    try {
      // Step A: Short Beep Sound
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(698.46, audioCtx.currentTime + 0.15); // F5
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.3); // A5
      
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);

      // Step B: Indonesian Text to Speech TTS
      setTimeout(() => {
        if ('speechSynthesis' in window) {
          const text = `Nomor antrean ${ticket.ticketNumber.split('-')[0]}, ${parseInt(ticket.ticketNumber.split('-')[1])}, silakan menuju loket ${counterNum}`;
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'id-ID';
          utterance.rate = 0.95;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      }, 600);
    } catch (e) {
      console.log('Audio Context or TTS fails:', e);
    }
  };

  const notifyBrowser = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'antriku-notify'
      });
    }
  };

  // 4. API Operations
  const registerBusiness = (name: string, category: string, phone: string, address: string, totalCounters: number) => {
    const businessId = 'biz_' + Math.random().toString(36).substring(2, 9);
    const newBusiness: BusinessInfo = {
      id: businessId,
      name,
      category,
      address,
      phone,
      totalCounters,
      averageServiceTime: 12,
      isPaused: false,
      branches: ['Cabang Senayan Utama', 'Cabang Bekasi Cyber Park', 'Cabang BSD Tangerang', 'Cabang Dago Bandung']
    };

    const simulatedJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulated_token_' + Math.random().toString(36).substring(2, 10);

    setAuthState({
      isAuthenticated: true,
      token: simulatedJWT,
      role: 'admin',
      business: newBusiness
    });

    return true;
  };

  const loginAdmin = (email: string, password: string) => {
    // In search of registered business or fallbacks
    const fallbackBusiness: BusinessInfo = {
      id: 'biz_default',
      name: authState.business?.name || 'Klinik Sehat Bersama',
      category: authState.business?.category || 'Klinik & Kesehatan',
      address: authState.business?.address || 'Jl. Sudirman No 42, Jakarta',
      phone: authState.business?.phone || '0812345678',
      totalCounters: authState.business?.totalCounters || 3,
      averageServiceTime: 12,
      isPaused: false,
      branches: authState.business?.branches || ['Cabang Senayan Utama', 'Cabang Bekasi Cyber Park', 'Cabang BSD Tangerang', 'Cabang Dago Bandung']
    };

    const simulatedJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.login_token_' + Math.random().toString(36).substring(2, 10);

    setAuthState({
      isAuthenticated: true,
      token: simulatedJWT,
      role: 'admin',
      business: fallbackBusiness
    });

    return true;
  };

  const logoutAdmin = () => {
    setAuthState({
      isAuthenticated: false,
      token: null,
      role: 'admin',
      business: null
    });
  };

  const takeTicket = (name: string, phone: string, categoryPrefix: string, branch: string) => {
    const prefix = categoryPrefix.toUpperCase();
    const selectedBranchName = branch || 'Cabang Senayan Utama';
    // Calculate sequential ticket number per branch and category prefix
    const prefixTickets = queue.filter(q => q.categoryPrefix === prefix && q.branch === selectedBranchName);
    
    // Calculate next sequential number
    const maxNum = prefixTickets.length > 0 
      ? Math.max(...prefixTickets.map(q => parseInt(q.ticketNumber.split('-')[1]) || 0)) 
      : 0;
    
    const nextNum = maxNum + 1;
    const ticketStr = `${prefix}-${nextNum < 10 ? '0' : ''}${nextNum}`;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newTicket: QueueItem = {
      id: Math.random().toString(36).substring(2, 9),
      ticketNumber: ticketStr,
      customerName: name,
      customerPhone: phone,
      categoryPrefix: prefix,
      status: 'waiting',
      createdAt: timeStr,
      branch: selectedBranchName
    };

    const updatedQueue = [...queue, newTicket];
    setQueue(updatedQueue);

    // Trigger Browser Notification and simulated WhatsApp
    notifyBrowser(
      `Nomor Antrean Anda: ${ticketStr}`,
      `Halo ${name}, Anda terdaftar di antrean ${authState.business?.name || 'Klinik'.trim()} - ${selectedBranchName}.`
    );

    return newTicket;
  };

  const callNext = (counterNumber: number, branchFilter?: string) => {
    // Find next ticket that is waiting, optionally filtered by branch
    const nextTicket = queue.find(q => 
      q.status === 'waiting' && 
      (!branchFilter || branchFilter === 'Semua Lokasi' || q.branch === branchFilter)
    );
    
    if (!nextTicket) {
      notifyBrowser('Semua antrean selesai!', 'Tidak ada pengunjung dalam daftar tunggu saat ini.');
      return;
    }

    // Set other calling items of that counter or state as finished/served
    const updated = queue.map(q => {
      // Current served at this counter is completed
      if (q.status === 'calling' && q.counterNumber === counterNumber) {
        return { ...q, status: 'served' as const, finishedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) };
      }
      // New called ticket
      if (q.id === nextTicket.id) {
        return { ...q, status: 'calling' as const, counterNumber, calledAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) };
      }
      return q;
    });

    setQueue(updated);
    
    // Announce verbally & trigger notification
    triggerAudioAnnouncement(nextTicket, counterNumber);
    notifyBrowser(
      `Panggilan Antrean ${nextTicket.ticketNumber}`,
      `Silakan nomor ${nextTicket.ticketNumber} menuju ke Loket Kantor ${counterNumber}`
    );
  };

  const skipTicket = (ticketId: string) => {
    setQueue(prev => prev.map(q => q.id === ticketId ? { ...q, status: 'skipped' as const } : q));
  };

  const servedTicket = (ticketId: string) => {
    setQueue(prev => prev.map(q => q.id === ticketId ? { ...q, status: 'served' as const, finishedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) } : q));
  };

  const resetQueue = () => {
    setQueue([]);
    notifyBrowser('Sistem Antrean AntriKu', 'Daftar antrean berhasil di-reset ulang.');
  };

  const togglePauseQueue = () => {
    setIsPaused(prev => !prev);
  };

  const getQRUrl = () => {
    const origin = window.location.origin;
    // URL targeting Customer Portal
    return `${origin}/queue`;
  };

  const addBusinessBranch = (branchName: string) => {
    if (!branchName.trim()) return;
    setAuthState(prev => {
      if (!prev.business) return prev;
      const currentBranches = prev.business.branches || ['Cabang Senayan Utama', 'Cabang Bekasi Cyber Park', 'Cabang BSD Tangerang', 'Cabang Dago Bandung'];
      if (currentBranches.map(b => b.toLowerCase()).includes(branchName.trim().toLowerCase())) return prev;
      return {
        ...prev,
        business: {
          ...prev.business,
          branches: [...currentBranches, branchName.trim()]
        }
      };
    });
  };

  return (
    <QueueContext.Provider value={{
      authState,
      queue,
      analytics,
      isPaused,
      registerBusiness,
      loginAdmin,
      logoutAdmin,
      takeTicket,
      callNext,
      skipTicket,
      servedTicket,
      resetQueue,
      togglePauseQueue,
      getQRUrl,
      addBusinessBranch
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
}
