import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { 
  Heart, 
  Scissors, 
  Utensils, 
  Pill, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  Clock, 
  Tv, 
  Users, 
  User,
  ShieldCheck,
  Plus,
  Trash2,
  Store,
  Coffee,
  Briefcase,
  Mail,
  Lock,
  Unlock,
  Printer,
  QrCode,
  Ticket,
  Map,
  Smartphone,
  Search,
  LogOut,
  Check,
  UserCheck,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Heart': return <Heart className="w-6 h-6 text-rose-500" />;
    case 'Pill': return <Pill className="w-6 h-6 text-emerald-500" />;
    case 'Scissors': return <Scissors className="w-6 h-6 text-amber-500" />;
    case 'Utensils': return <Utensils className="w-6 h-6 text-sky-500" />;
    case 'Coffee': return <Coffee className="w-6 h-6 text-amber-750" />;
    case 'Briefcase': return <Briefcase className="w-6 h-6 text-slate-500" />;
    case 'Store':
    default:
      return <Store className="w-6 h-6 text-indigo-500" />;
  }
};

const getBadgeColor = (category: string) => {
  switch (category) {
    case 'Klinik & Kesehatan': return 'bg-rose-50 text-rose-650 border-rose-100';
    case 'Apotek': return 'bg-emerald-50 text-emerald-650 border-emerald-100';
    case 'Barbershop': return 'bg-amber-50 text-amber-655 border-amber-100';
    case 'Restoran': return 'bg-sky-50 text-sky-650 border-sky-100';
    case 'Kafe': return 'bg-orange-50 text-orange-650 border-orange-100';
    case 'Jasa / Kantor': return 'bg-slate-50 text-slate-650 border-slate-100';
    default: return 'bg-indigo-50 text-indigo-650 border-indigo-100';
  }
};

const defaultLocations = [
  {
    id: 'klinik',
    name: 'Klinik Sehat Bersama',
    category: 'Klinik & Kesehatan',
    address: 'Jl. Sudirman No 42, Jakarta',
    phone: '0812345678',
    icon: 'Heart',
    badgeColor: 'bg-rose-50 text-rose-650 border-rose-100',
    bannerImg: 'bg-rose-500',
    isCustom: false,
    services: [
      { key: 'A', label: 'Spesialis Umum / Dokter' },
      { key: 'B', label: 'Apotek / Serah Obat' },
      { key: 'C', label: 'Kasir & Pembayaran' }
    ]
  },
  {
    id: 'apotek',
    name: 'Apotek Utama Jaya',
    category: 'Apotek',
    address: 'Jl. Gatot Subroto No. 15, Jakarta',
    phone: '0821876543',
    icon: 'Pill',
    badgeColor: 'bg-emerald-50 text-emerald-650 border-emerald-100',
    bannerImg: 'bg-emerald-500',
    isCustom: false,
    services: [
      { key: 'A', label: 'Resep Dokter' },
      { key: 'B', label: 'Obat Bebas & Alkes' },
      { key: 'C', label: 'Pembayaran & Kasir' }
    ]
  },
  {
    id: 'barbershop',
    name: 'Barbershop Gentlemens',
    category: 'Barbershop',
    address: 'Jl. Kemang Raya No. 8, Jakarta Selatan',
    phone: '0813998877',
    icon: 'Scissors',
    badgeColor: 'bg-amber-50 text-amber-655 border-amber-100',
    bannerImg: 'bg-amber-500',
    isCustom: false,
    services: [
      { key: 'A', label: 'Potong Rambut (Haircut)' },
      { key: 'B', label: 'Perawatan Wajah & Shaving' },
      { key: 'C', label: 'Pijat / Creambath' }
    ]
  },
  {
    id: 'restoran',
    name: 'Restoran Selera Nusantara',
    category: 'Restoran',
    address: 'Jl. Dago No. 120, Bandung',
    phone: '0812445566',
    icon: 'Utensils',
    badgeColor: 'bg-sky-50 text-sky-650 border-sky-100',
    bannerImg: 'bg-sky-500',
    isCustom: false,
    services: [
      { key: 'A', label: 'Makan di Tempat (Dine-In)' },
      { key: 'B', label: 'Bawa Pulang (Takeaway)' },
      { key: 'C', label: 'Reservasi Khusus' }
    ]
  }
];

export default function Home() {
  const navigate = useNavigate();
  const { addBusinessBranch, authState, loginAdmin, logoutAdmin, queue, takeTicket } = useQueue();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // New States for Portal / Quick Login on Home
  const [activePortal, setActivePortal] = useState<'customer' | 'admin'>('customer');
  const [lookupPhone, setLookupPhone] = useState('');
  const [foundTickets, setFoundTickets] = useState<any[]>([]);
  const [lookupAttempted, setLookupAttempted] = useState(false);

  // States for Customer Auth Flow / Steps (Tahapan Masuk Pengguna)
  const [customerMode, setCustomerMode] = useState<'login' | 'register'>('login');
  const [customerStep, setCustomerStep] = useState<1 | 2>(1); // 1: Email/No.HP, 2: Kata Sandi
  const [customerEmail, setCustomerEmail] = useState('pengguna@antriku.id');
  const [customerPassword, setCustomerPassword] = useState('password123');
  const [customerName, setCustomerName] = useState('Budi Santoso');
  const [customerError, setCustomerError] = useState('');
  const [customerSuccess, setCustomerSuccess] = useState('');
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);
  const [customerAuth, setCustomerAuth] = useState<{ email: string; name: string; phone: string } | null>(() => {
    const saved = localStorage.getItem('antriku_customer_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return null;
  });

  // Unified 3-Step Connected Wizard (Masuk -> Pilih Lokasi -> Ambil Antrean)
  const [selectedHomeLocation, setSelectedHomeLocation] = useState<any | null>(null);
  const [selectedHomeService, setSelectedHomeService] = useState<string>('A');
  const [justTakenTicket, setJustTakenTicket] = useState<any | null>(null);

  const [adminEmail, setAdminEmail] = useState('admin@antriku.co.id');
  const [adminPassword, setAdminPassword] = useState('password123');
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Load locations from localStorage or fallback
  const [locations, setLocations] = useState<any[]>(() => {
    const saved = localStorage.getItem('antriku_all_locations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return defaultLocations;
  });

  // State for form to add custom location
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocCategory, setNewLocCategory] = useState('Kafe');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocPhone, setNewLocPhone] = useState('');
  const [newLocIcon, setNewLocIcon] = useState('Store');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('antriku_all_locations', JSON.stringify(locations));
  }, [locations]);

  // Handle Select Location click
  const handleSelectLocation = (name: string) => {
    navigate(`/queue?location=${encodeURIComponent(name)}`);
  };

  const handleSelectLocationHome = (loc: any) => {
    setSelectedHomeLocation(loc);
    navigate(`/queue?location=${encodeURIComponent(loc.name)}`);
  };

  const handleTakeTicketHome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerAuth || !selectedHomeLocation) return;
    
    try {
      const newTicket = takeTicket(
        customerAuth.name,
        customerAuth.phone,
        selectedHomeService,
        selectedHomeLocation.name
      );
      setJustTakenTicket(newTicket);
      // Auto-update found active tickets for the current customer session view
      setFoundTickets(prev => {
        const withNew = [...prev.filter(t => t.id !== newTicket.id), newTicket];
        return withNew;
      });
      setLookupAttempted(true);
    } catch (err) {
      console.error('Failed to issue ticket inline:', err);
    }
  };

  // Add custom location handler
  const handleAddLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim() || !newLocAddress.trim()) return;

    // Check duplicate name
    if (locations.some(loc => loc.name.toLowerCase() === newLocName.trim().toLowerCase())) {
      alert('Nama tempat layanan ini sudah terdaftar.');
      return;
    }

    const uniqueId = 'loc_' + Math.random().toString(36).substring(2, 9);
    
    // Choose appropriate default service types based on category
    let customServices = [
      { key: 'A', label: 'Layanan Utama / Loket 1' },
      { key: 'B', label: 'Layanan Pendukung / Loket 2' },
      { key: 'C', label: 'Kasir & Pembayaran / Loket 3' }
    ];

    if (newLocCategory === 'Kafe') {
      customServices = [
        { key: 'A', label: 'Pemesanan Makanan / Minuman' },
        { key: 'B', label: 'Pengambilan Pesanan (Pickup)' },
        { key: 'C', label: 'Pembayaran Kasir' }
      ];
    } else if (newLocCategory === 'Jasa / Kantor') {
      customServices = [
        { key: 'A', label: 'Customer Service' },
        { key: 'B', label: 'Konsultasi Layanan' },
        { key: 'C', label: 'Kasir & Pembayaran' }
      ];
    }

    const newLocationObj = {
      id: uniqueId,
      name: newLocName.trim(),
      category: newLocCategory,
      address: newLocAddress.trim(),
      phone: newLocPhone.trim() || '0812345678',
      icon: newLocIcon,
      badgeColor: getBadgeColor(newLocCategory),
      bannerImg: 'bg-indigo-500',
      isCustom: true,
      services: customServices
    };

    // Propagate to global state
    addBusinessBranch(newLocName.trim());

    // Update local list
    const updated = [...locations, newLocationObj];
    setLocations(updated);

    // Clear form
    setNewLocName('');
    setNewLocAddress('');
    setNewLocPhone('');
    setShowAddForm(false);
  };

  // Delete custom location handler
  const handleDeleteLocation = (id: string, name: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent trigger navigate
    if (window.confirm(`Apakah Anda yakin ingin menghapus lokasi "${name}"?`)) {
      const filtered = locations.filter(loc => loc.id !== id);
      setLocations(filtered);
      // Dispatch storage update so other screens/tabs are updated in real-time
      localStorage.setItem('antriku_all_locations', JSON.stringify(filtered));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('antriku_locations_changed'));
    }
  };

  // Customer lookup handler
  const handleCustomerLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupAttempted(true);
    if (!lookupPhone.trim()) {
      setFoundTickets([]);
      return;
    }
    const matches = queue.filter(q => 
      q.customerPhone === lookupPhone.trim() && 
      (q.status === 'waiting' || q.status === 'calling')
    );
    setFoundTickets(matches);
  };

  // Customer Login Handler
  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerError('');
    setCustomerSuccess('');

    if (!customerEmail.trim() || !customerPassword.trim()) {
      setCustomerError('Harap isi email dan sandi Anda.');
      return;
    }

    // Authenticate with mock credentials
    const isUjiCoba = customerEmail.trim() === 'pengguna@antriku.id' && customerPassword === 'password123';
    let authData = null;

    if (isUjiCoba) {
      authData = {
        email: 'pengguna@antriku.id',
        name: 'Budi Santoso',
        phone: '081298765432'
      };
    } else {
      authData = {
        email: customerEmail.trim(),
        name: customerEmail.split('@')[0],
        phone: '08' + Math.floor(100000000 + Math.random() * 900000000).toString()
      };
    }

    setCustomerSuccess('✓ Masuk Pengguna Berhasil!');
    setCustomerAuth(authData);
    localStorage.setItem('antriku_customer_auth', JSON.stringify(authData));

    setTimeout(() => {
      setCustomerSuccess('');
      setLookupPhone(authData.phone);
      const matches = queue.filter(q => 
        q.customerPhone === authData.phone && 
        (q.status === 'waiting' || q.status === 'calling')
      );
      setFoundTickets(matches);
      setLookupAttempted(true);
    }, 1200);
  };

  // Customer Register Handler
  const handleCustomerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerError('');
    setCustomerSuccess('');

    if (!customerName.trim() || !customerEmail.trim() || !customerPassword.trim() || !lookupPhone.trim()) {
      setCustomerError('Harap lengkapi semua isian formulir.');
      return;
    }

    const authData = {
      email: customerEmail.trim(),
      name: customerName.trim(),
      phone: lookupPhone.trim()
    };

    setCustomerSuccess('✓ Akun Baru Terdaftar & Masuk Berhasil!');
    setCustomerAuth(authData);
    localStorage.setItem('antriku_customer_auth', JSON.stringify(authData));

    setTimeout(() => {
      setCustomerSuccess('');
      setLookupPhone(authData.phone);
      const matches = queue.filter(q => 
        q.customerPhone === authData.phone && 
        (q.status === 'waiting' || q.status === 'calling')
      );
      setFoundTickets(matches);
      setLookupAttempted(true);
    }, 1200);
  };

  // Customer Logout Handler
  const handleCustomerLogout = () => {
    setCustomerAuth(null);
    localStorage.removeItem('antriku_customer_auth');
    setLookupPhone('');
    setFoundTickets([]);
    setLookupAttempted(false);
    setCustomerStep(1);
    setCustomerError('');
    setCustomerSuccess('');
    setSelectedHomeLocation(null);
    setJustTakenTicket(null);
  };

  // Admin Home Login handler
  const handleAdminHomeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setAdminError('Harap lengkapi email dan password.');
      return;
    }
    const success = loginAdmin(adminEmail.trim(), adminPassword.trim());
    if (success) {
      setAdminSuccess('✓ Autentikasi Admin Berhasil! Mengalihkan ke Dasbor...');
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } else {
      setAdminError('Kredensial salah. Gunakan email uji coba.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 pb-16 min-h-screen bg-slate-50/70"
    >
      {/* Premium Hero Title with Dual Active Portals */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT SIDE: Welcome & Live Statistics Branding */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-blue">
                Antrean Digital Sederhana & Teratur
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-brand-dark tracking-tight leading-none">
              Portal Layanan <br />
              <span className="text-brand-blue">AntriKu Digital</span>
            </h1>
            
            <p className="text-sm text-zinc-550 leading-relaxed max-w-xl">
              Platform modern multi-lokasi untuk memudahkan masyarakat mengklaim nomor loket virtual secara mandiri, sekaligus memberikan kemudahan bagi petugas dalam mengatur pemanggilan loket secara simultan. Say goodbye to antrean konvensional yang membosankan!
            </p>

            {/* Quick Live Stats Visuals */}
            <div className="grid grid-cols-3 gap-3 max-w-lg pt-2">
              <div className="bg-white rounded-2xl border border-zinc-150 p-4 shadow-sm">
                <p className="text-[10px] font-black tracking-wider uppercase text-zinc-400">Total Tiket</p>
                <p className="text-2xl font-black text-brand-dark mt-1">{queue.length}</p>
              </div>
              <div className="bg-white rounded-2xl border border-zinc-150 p-4 shadow-sm">
                <p className="text-[10px] font-black tracking-wider uppercase text-zinc-400">Menunggu</p>
                <p className="text-2xl font-black text-amber-500 mt-1">{queue.filter(q => q.status === 'waiting').length}</p>
              </div>
              <div className="bg-white rounded-2xl border border-zinc-150 p-4 shadow-sm">
                <p className="text-[10px] font-black tracking-wider uppercase text-zinc-400">Sedang Dipanggil</p>
                <p className="text-2xl font-black text-emerald-500 mt-1">{queue.filter(q => q.status === 'calling').length}</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Tabbed Gateways for Admin & Customers */}
          <div className="lg:col-span-5" id="step-1-auth">
            <div className="bg-white rounded-[2.5rem] border border-zinc-200 p-6 md:p-8 shadow-xl relative overflow-hidden">
              
              {/* Portal Header Labels */}
              <div className="text-center mb-6">
                <span className="px-2.5 py-1 bg-brand-blue/10 text-brand-blue text-[9px] font-black uppercase rounded-lg mb-2.5 inline-block tracking-wider border border-brand-blue/10">
                  ⚡ LANGKAH 1 DARI 3: MASUK PORTAL
                </span>
                <h3 className="text-base font-black text-brand-dark uppercase tracking-tight">SINKRONISASI PORTAL MASUK</h3>
              </div>

              {/* Selector Tabs for Customer vs Admin */}
              <div className="flex bg-zinc-100 p-1 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => { setActivePortal('customer'); setLookupAttempted(false); }}
                  className={`flex-1 py-2.5 text-[10.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activePortal === 'customer' 
                      ? 'bg-white text-brand-blue shadow-sm' 
                      : 'text-zinc-400 hover:text-zinc-650'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Pengguna Web</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActivePortal('admin'); setAdminError(''); setAdminSuccess(''); }}
                  className={`flex-1 py-2.5 text-[10.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activePortal === 'admin' 
                      ? 'bg-white text-brand-blue shadow-sm' 
                      : 'text-zinc-400 hover:text-zinc-650'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Portal Admin</span>
                </button>
              </div>

              {/* Conditional Portal Rendering */}
              <div>
                {activePortal === 'customer' ? (
                  /* 👤 CUSTOMER ENTRANCE / RETRIEVAL with step-by-step auth */
                  <div className="space-y-4">
                    {/* Status alerts */}
                    <AnimatePresence mode="wait">
                      {customerError && (
                        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-650 rounded-xl text-[11px] font-black">
                          ⚠️ {customerError}
                        </div>
                      )}
                      {customerSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[11px] font-black flex items-center gap-1.5 animate-pulse">
                          <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3px]" />
                          <span>{customerSuccess}</span>
                        </div>
                      )}
                    </AnimatePresence>

                    {customerAuth ? (
                      /* Authenticated Customer View */
                      <div className="space-y-3">
                        <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest">PENGGUNA AKTIF</p>
                              <h4 className="text-sm font-extrabold text-brand-dark mt-1 flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-brand-blue" />
                                <span>{customerAuth.name}</span>
                              </h4>
                              <p className="text-[10px] text-zinc-500 mt-1">📧 {customerAuth.email} | 📞 {customerAuth.phone}</p>
                            </div>
                            <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue font-bold rounded text-[9.5px]">Terverifikasi</span>
                          </div>
                        </div>

                        {/* Customer Action: View or Take Ticket */}
                        <div className="bg-slate-50 border border-zinc-200 rounded-2xl p-4">
                          <div className="flex justify-between items-center mb-2.5">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">TIKET ANTREAN AKTIF</span>
                            <button
                              onClick={() => {
                                // Refresh search based on user's phone
                                const matches = queue.filter(q => 
                                  q.customerPhone === customerAuth.phone && 
                                  (q.status === 'waiting' || q.status === 'calling')
                                );
                                setFoundTickets(matches);
                                setLookupAttempted(true);
                              }}
                              className="text-[9px] font-black text-brand-blue hover:underline uppercase tracking-wider cursor-pointer"
                            >
                              Segarkan
                            </button>
                          </div>

                          {foundTickets.length > 0 ? (
                            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                              {foundTickets.map((ticket) => (
                                <div 
                                  key={ticket.id} 
                                  className="bg-white border border-zinc-150 rounded-xl p-3 flex justify-between items-center text-xs shadow-sm"
                                >
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-extrabold text-brand-dark text-sm">{ticket.ticketNumber}</span>
                                      <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-extrabold uppercase ${
                                        ticket.status === 'calling' ? 'bg-emerald-50 text-emerald-600 animate-pulse' : 'bg-amber-50 text-amber-600'
                                      }`}>
                                        {ticket.status === 'calling' ? 'Dipanggil' : 'Menunggu'}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-semibold truncate max-w-[150px] mt-0.5">{ticket.branch}</p>
                                  </div>
                                  <button
                                    onClick={() => handleSelectLocation(ticket.branch)}
                                    className="px-2.5 py-1.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-[9.5px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <span>PANDUAN</span>
                                    <ArrowRight className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-2.5">
                              <p className="text-[11px] text-zinc-500 font-bold">⚠️ Tidak ada tiket aktif terdaftar.</p>
                              <p className="text-[10px] text-zinc-400 mt-1">Silakan pilih destinasi di bawah untuk mengambil nomor antrean baru.</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleCustomerLogout}
                            className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Ganti / Keluar Akun</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Authenticating Customer Steps Form */
                      <div>
                        {/* Selector Subtabs (Masuk vs Daftar) */}
                        <div className="flex border-b border-zinc-100 pb-3 mb-4 justify-between items-center">
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() => { setCustomerMode('login'); setCustomerStep(1); setCustomerError(''); }}
                              className={`text-xs font-black uppercase tracking-wider pb-1 relative cursor-pointer ${
                                customerMode === 'login' ? 'text-brand-blue' : 'text-zinc-400 hover:text-zinc-650'
                              }`}
                            >
                              Masuk Sesi
                              {customerMode === 'login' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full"></span>}
                            </button>
                            <button
                              type="button"
                              onClick={() => { setCustomerMode('register'); setCustomerStep(1); setCustomerError(''); }}
                              className={`text-xs font-black uppercase tracking-wider pb-1 relative cursor-pointer ${
                                customerMode === 'register' ? 'text-brand-blue' : 'text-zinc-400 hover:text-zinc-650'
                              }`}
                            >
                              Buat Akun Baru
                              {customerMode === 'register' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full"></span>}
                            </button>
                          </div>
                          
                          {/* Visual Step Indicator */}
                          <div className="flex items-center gap-1.5">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                              customerStep === 1 ? 'bg-brand-blue text-white' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {customerStep === 1 ? '1' : '✓'}
                            </span>
                            <span className="w-2.5 h-0.5 bg-zinc-200 rounded"></span>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                              customerStep === 2 ? 'bg-brand-blue text-white' : 'bg-zinc-100 text-zinc-400'
                            }`}>
                              2
                            </span>
                          </div>
                        </div>

                        {/* Step Forms */}
                        {customerStep === 1 ? (
                          /* TAHAP 1: IDENTITAS DIRI */
                          <div className="space-y-3.5">
                            <div className="p-3 bg-blue-50/50 border border-blue-100/60 rounded-xl mb-1 text-[11px] text-brand-dark leading-normal">
                              <span className="font-extrabold text-brand-blue block mb-0.5">Langkah 1 dari 2: Identifikasi Diri</span>
                              Isi data unik untuk memulai proses sinkronisasi antrean terpadu Anda.
                            </div>

                            {customerMode === 'register' && (
                              <div>
                                <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-wider mb-1">
                                  Nama Lengkap (Sesuai KTP)
                                </label>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
                                  <input
                                    type="text"
                                    placeholder="Masukkan nama lengkap Anda"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                                  />
                                </div>
                              </div>
                            )}

                            <div>
                              <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-wider mb-1">
                                Alamat Email Pengguna
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
                                <input
                                  type="email"
                                  placeholder="contoh: pengguna@antriku.id"
                                  value={customerEmail}
                                  onChange={(e) => setCustomerEmail(e.target.value)}
                                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                                />
                              </div>
                            </div>

                            {customerMode === 'register' && (
                              <div>
                                <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-wider mb-1">
                                  No. WhatsApp (Untuk Pelacakan)
                                </label>
                                <div className="relative">
                                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
                                  <input
                                    type="text"
                                    placeholder="Contoh: 081298765432"
                                    value={lookupPhone}
                                    onChange={(e) => setLookupPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                                  />
                                </div>
                              </div>
                            )}

                            {customerMode === 'login' && (
                              <div className="flex justify-end pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCustomerEmail('pengguna@antriku.id');
                                    setCustomerPassword('password123');
                                  }}
                                  className="text-[9px] font-black text-brand-blue uppercase tracking-wider hover:underline cursor-pointer flex items-center gap-1"
                                >
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>Isi Otomatis Kredensial Demo</span>
                                </button>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                if (!customerEmail.trim()) {
                                  setCustomerError('Harap isi alamat email Anda.');
                                  return;
                                }
                                if (customerMode === 'register' && (!customerName.trim() || !lookupPhone.trim())) {
                                  setCustomerError('Harap lengkapi nama dan No WhatsApp.');
                                  return;
                                }
                                setCustomerError('');
                                setCustomerStep(2);
                              }}
                              className="w-full mt-2 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-[10.5px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-blue/10"
                            >
                              <span>Lanjut ke Tahap 2: Kata Sandi</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          /* TAHAP 2: KATA SANDI / PIN KEAMANAN */
                          <div className="space-y-4">
                            <div className="p-3 bg-blue-50/50 border border-blue-100/60 rounded-xl mb-1 text-[11px] text-brand-dark leading-normal flex items-start gap-1.5">
                              <span className="mt-0.5 text-brand-blue font-extrabold">✓</span>
                              <div>
                                <span className="font-extrabold text-brand-blue block mb-0.5">Langkah 2 dari 2: Kata Sandi Keamanan</span>
                                Amankan akses antrean Anda agar tidak disalahgunakan orang lain.
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-wider">
                                  Kata Sandi Akses
                                </label>
                                <span className="text-[9px] font-black text-zinc-400 italic">Minimal 6 Karakter</span>
                              </div>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
                                <input
                                  type={showCustomerPassword ? 'text' : 'password'}
                                  placeholder="Masukkan sandi minimal 6 karakter"
                                  value={customerPassword}
                                  onChange={(e) => setCustomerPassword(e.target.value)}
                                  className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 cursor-pointer"
                                >
                                  {showCustomerPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>

                            {/* Back and Action Buttons */}
                            <div className="grid grid-cols-12 gap-2 mt-4">
                              <button
                                type="button"
                                onClick={() => setCustomerStep(1)}
                                className="col-span-4 py-3 bg-zinc-150 hover:bg-zinc-250 text-zinc-650 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Kembali</span>
                              </button>

                              <button
                                type="button"
                                onClick={customerMode === 'login' ? handleCustomerLogin : handleCustomerRegister}
                                className="col-span-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10.5px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/15"
                              >
                                <UserCheck className="w-3.5 h-3.5 text-white" />
                                <span>Masuk Sesi Sekarang</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* 🔑 ADMIN QUICK LOGIN with step-by-step documentation */
                  <div className="space-y-4">
                    {/* Status alerts */}
                    <AnimatePresence mode="wait">
                      {adminError && (
                        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-650 rounded-xl text-[11px] font-black">
                          ⚠️ {adminError}
                        </div>
                      )}
                      {adminSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[11px] font-black flex items-center gap-1.5 animate-pulse">
                          <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3px]" />
                          <span>{adminSuccess}</span>
                        </div>
                      )}
                    </AnimatePresence>

                    {authState.isAuthenticated ? (
                      /* Authenticated state */
                      <div className="space-y-3 pt-1">
                        <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">LOGGED IN SEBAGAI ADMIN</p>
                          <h4 className="text-sm font-extrabold text-brand-dark mt-1">{authState.business?.name || 'AntriKu Admin'}</h4>
                          <p className="text-[10px] text-zinc-450 mt-0.5">{authState.business?.address}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="py-3 bg-brand-blue hover:bg-brand-blue/90 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-brand-blue/10"
                          >
                            <span>Dashboard</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={logoutAdmin}
                            className="py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Form Login state with explicit stages */
                      <div>
                        {/* Interactive Steps Guide banner */}
                        <div className="p-3 bg-slate-50 border border-zinc-150 rounded-xl mb-4 text-[11px] text-zinc-650 leading-normal">
                          <span className="font-extrabold text-indigo-600 block mb-0.5">Tahapan Akses Masuk Pengelola (2-Step):</span>
                          <span className="block text-zinc-500">1. Ketikkan alamat email administratif Anda.</span>
                          <span className="block text-zinc-500">2. Lapisi sandi keamanan rahasia instansi.</span>
                        </div>

                        <form onSubmit={handleAdminHomeLogin} className="space-y-3.5">
                          {/* Email input */}
                          <div>
                            <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-wider mb-1">
                              Email Admin Resmi
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
                              <input
                                type="email"
                                placeholder="Masukkan Email Pengelola"
                                value={adminEmail}
                                onChange={(e) => setAdminEmail(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                                required
                              />
                            </div>
                          </div>

                          {/* Password input */}
                          <div>
                            <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-wider mb-1">
                              Sandi Keamanan Pengelola
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
                              <input
                                type={showAdminPassword ? 'text' : 'password'}
                                placeholder="Masukkan sandi keamanan"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowAdminPassword(!showAdminPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 cursor-pointer"
                              >
                                {showAdminPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Quick Autofill Helper */}
                          <div className="flex justify-end pt-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                setAdminEmail('admin@antriku.co.id');
                                setAdminPassword('password123');
                              }}
                              className="text-[9px] font-black text-brand-blue uppercase tracking-wider hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Isi Otomatis Kredensial Demo</span>
                            </button>
                          </div>

                          {/* Login button */}
                          <button
                            type="submit"
                            className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-[10.5px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-blue/10"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>Verifikasi & Masuk Dashboard</span>
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Visual Stepper Progress Bar */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 pt-4 pb-2">
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Step 1 Indicator */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${
                customerAuth ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-brand-blue text-white animate-pulse'
              }`}>
                {customerAuth ? <Check className="w-5 h-5 stroke-[3px]" /> : '1'}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase text-zinc-400 block">Langkah 1</span>
                <span className="text-xs font-extrabold text-brand-dark block truncate">Masuk Sesi Portal</span>
                {customerAuth && (
                  <span className="text-[10px] font-bold text-emerald-600 truncate block">✓ {customerAuth.name}</span>
                )}
              </div>
            </div>

            {/* Step 2 Indicator */}
            <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-zinc-100">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${
                !customerAuth 
                  ? 'bg-zinc-100 text-zinc-400 border border-zinc-250' 
                  : selectedHomeLocation 
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                    : 'bg-brand-blue text-white animate-pulse'
              }`}>
                {!customerAuth ? <Lock className="w-4 h-4" /> : selectedHomeLocation ? <Check className="w-5 h-5 stroke-[3px]" /> : '2'}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase text-zinc-400 block">Langkah 2</span>
                <span className="text-xs font-extrabold text-brand-dark block truncate">Ambil Antrean Cabang</span>
                {selectedHomeLocation && (
                  <span className="text-[10px] font-bold text-brand-blue truncate block">{selectedHomeLocation.name}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature: Selection of Service Location */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 py-8 relative" id="step-2-lokasi">
        
        {/* If not logged in as customer, show overlay lock */}
        {!customerAuth && (
          <div className="absolute inset-0 bg-slate-50/75 backdrop-blur-[4px] z-20 flex flex-col items-center justify-center text-center p-8 rounded-[2.5rem] border border-zinc-200">
            <div className="w-16 h-16 rounded-full bg-indigo-50 border-4 border-white flex items-center justify-center text-brand-blue shadow-md mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-brand-dark uppercase tracking-tight">🔒 LANGKAH 2 TERKUNCI</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4 leading-normal font-medium">
              Harap masuk / login pada **Langkah 1: Masuk Portal** di bagian atas terlebih dahulu untuk mengaktifkan pilihan tempat layanan.
            </p>
            <button
              onClick={() => {
                const el = document.getElementById('step-1-auth');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-[10px] tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer"
            >
              Kembali ke Langkah 1
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xs font-black text-brand-blue uppercase tracking-widest flex items-center gap-1.5">
              <span>⚡ LANGKAH 2 DARI 3: PILIH TEMPAT LAYANAN</span>
            </h2>
            <p className="text-lg font-extrabold text-brand-dark mt-1">
              {selectedHomeLocation 
                ? `Dipilih: ${selectedHomeLocation.name} ✓` 
                : 'Silakan pilih tempat layanan yang ingin Anda kunjungi di bawah ini:'}
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider bg-brand-blue border border-brand-blue/30 text-white px-5 py-3 rounded-2xl hover:bg-brand-blue/90 cursor-pointer shadow-md shadow-brand-blue/15 duration-200"
          >
            <Plus className="w-2.5 h-2.5" />
            <span>Tambah Lokasi Kustom</span>
          </button>
        </div>

        {/* Dynamic Add Location Form Panel */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <form 
                onSubmit={handleAddLocationSubmit}
                className="bg-white rounded-[2rem] border border-blue-150 p-6 md:p-8 shadow-md space-y-5"
              >
                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                  <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider">
                    Form Tambah Tempat Layanan Baru
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-xs font-bold text-zinc-400 hover:text-rose-500 cursor-pointer"
                  >
                    Tutup FORM
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                      Nama Tempat Layanan *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kafe Kopi Mantap, Klinik Gigi Indah..."
                      value={newLocName}
                      onChange={(e) => setNewLocName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                      Kategori Tempat *
                    </label>
                    <select
                      value={newLocCategory}
                      onChange={(e) => {
                        setNewLocCategory(e.target.value);
                        if (e.target.value === 'Kafe') setNewLocIcon('Coffee');
                        else if (e.target.value === 'Jasa / Kantor') setNewLocIcon('Briefcase');
                        else setNewLocIcon('Store');
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="Kafe">☕ Kafe & Coffee Shop</option>
                      <option value="Klinik & Kesehatan">🩺 Klinik & Kesehatan</option>
                      <option value="Apotek">💊 Apotek</option>
                      <option value="Barbershop">💈 Barbershop / Salon</option>
                      <option value="Restoran">🍔 Restoran / Kuliner</option>
                      <option value="Jasa / Kantor">💼 Jasa / Kantor Umum</option>
                      <option value="Lainnya">🏪 Lokasi Lainnya</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                      Alamat Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Jl. Diponegoro No. 88, Menteng"
                      value={newLocAddress}
                      onChange={(e) => setNewLocAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                      No. Telepon / WhatsApp Tempat Layanan
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 0812998877"
                      value={newLocPhone}
                      onChange={(e) => setNewLocPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-4 py-3 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                      Icon Representasi Visual
                    </label>
                    <div className="flex gap-3">
                      {['Store', 'Coffee', 'Briefcase', 'Heart', 'Pill', 'Scissors', 'Utensils'].map((icName) => (
                        <button
                          key={icName}
                          type="button"
                          onClick={() => setNewLocIcon(icName)}
                          className={`w-10 h-10 rounded-xl grid place-items-center border transition-all cursor-pointer ${
                            newLocIcon === icName 
                              ? 'bg-brand-blue text-white border-brand-blue shadow-md' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100'
                          }`}
                        >
                          {getIconComponent(icName)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-5 py-2.5 bg-zinc-100 text-zinc-500 hover:bg-zinc-200 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md shadow-emerald-500/10"
                  >
                    Simpan Lokasi
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Locations Grid Loop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((loc) => {
            const isSelected = selectedHomeLocation?.id === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => handleSelectLocationHome(loc)}
                onMouseEnter={() => setHoveredCard(loc.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-white rounded-[2rem] border p-6 shadow-sm transition-all duration-300 cursor-pointer flex flex-col justify-between relative group overflow-hidden ${
                  isSelected 
                    ? 'border-brand-blue ring-4 ring-brand-blue/15 bg-indigo-50/10 shadow-md scale-[1.01]' 
                    : 'border-zinc-200/80 hover:shadow-xl hover:border-brand-blue/30'
                }`}
              >
                {/* Subtle visual accent */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 transition-colors ${
                  isSelected ? 'bg-brand-blue' : 'bg-zinc-100 group-hover:bg-brand-blue'
                }`}></div>
                
                <div>
                  {/* Header line */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                        {getIconComponent(loc.icon)}
                      </div>
                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-md">
                          <Check className="w-3 h-3 stroke-[3.5px]" />
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        title="Hapus lokasi ini"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLocation(loc.id, loc.name, e);
                        }}
                        className="p-1 px-2.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg border border-rose-100 transition-all text-[9px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                      
                      {isSelected ? (
                        <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border bg-brand-blue text-white border-brand-blue flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 stroke-[3.5px]" />
                          <span>Dipilih</span>
                        </span>
                      ) : (
                        <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${getBadgeColor(loc.category)}`}>
                          {loc.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Business details */}
                  <h3 className="text-xl font-extrabold text-brand-dark tracking-tight mb-2 group-hover:text-brand-blue transition-colors">
                    {loc.name}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-4">
                    <MapPin className="w-4 h-4 text-zinc-450 shrink-0" />
                    <span className="truncate">{loc.address}</span>
                  </div>
                </div>

                {/* Action Button Trigger */}
                <div className="border-t border-zinc-100 pt-4 mt-2 flex items-center justify-between">
                  {isSelected ? (
                    <span className="text-[10px] font-extrabold text-brand-blue uppercase tracking-wider flex items-center gap-1 animate-pulse">
                      <span>Lanjut Ambil Antrean di Bawah</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Klik untuk Pilih Tempat
                    </span>
                  )}
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20' 
                      : 'bg-brand-blue/5 text-brand-blue group-hover:bg-brand-blue group-hover:text-white'
                  }`}>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}

          {/* Quick Add Bento Block inside Grid */}
          {!showAddForm && (
            <div
              onClick={() => setShowAddForm(true)}
              className="border-2 border-dashed border-zinc-200 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center hover:border-brand-blue hover:bg-blue-50/10 transition-all cursor-pointer group py-10"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-brand-dark">
                Tempat Layanan Belum Terdaftar?
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-[240px]">
                Klik di sini untuk mendaftarkan tempat layanan kustom impian Anda sekarang juga.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Helper guide overview */}
      <section className="max-w-4xl mx-auto px-6 sm:px-10 py-4 mb-12">
        <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/20 border border-blue-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
          <h3 className="text-xs font-black text-brand-blue uppercase tracking-widest mb-6 text-center">
            Bagaimana Cara AntriKu Membantu Anda?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-brand-blue font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark mb-1">Masuk Sesi Portal</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Masuk atau buat sesi portal baru menggunakan Email & kata sandi pada formulir utama di atas.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-brand-blue font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark mb-1">Pilih Cabang & Ambil Antrean</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Pilih cabang kantor layanan yang Anda tuju, sistem akan langsung mengarahkan Anda ke loket virtual untuk mencetak nomor antrean.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
