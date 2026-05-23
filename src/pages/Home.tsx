import { useState, useEffect } from 'react';
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
  Clock, 
  Tv, 
  Users, 
  ShieldCheck,
  Plus,
  Trash2,
  Store,
  Coffee,
  Briefcase
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
  const { addBusinessBranch } = useQueue();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
    if (window.confirm(`Apakah Anda yakin ingin menghapus lokasi custom "${name}"?`)) {
      const filtered = locations.filter(loc => loc.id !== id);
      setLocations(filtered);
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
      {/* Premium Hero Title */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-12 pb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse"></span>
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-blue">
            Antrean Digital Sederhana & Teratur
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black text-brand-dark tracking-tighter leading-none mb-4">
          Selamat Datang di <span className="text-brand-blue">AntriKu</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 max-w-xl mx-auto leading-relaxed">
          Ambil antrean mandiri secara instan dan tanpa kerumunan fisik hanya melalui smartphone Anda.
        </p>
      </section>

      {/* Main Feature: Selection of Service Location */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xs font-black text-brand-blue uppercase tracking-widest">
              LANGKAH 1: PILIH LOKASI / TEMPAT LAYANAN
            </h2>
            <p className="text-lg font-extrabold text-brand-dark mt-1">
              Silakan pilih tempat layanan yang ingin Anda kunjungi di bawah ini:
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider bg-brand-blue border border-brand-blue/30 text-white px-5 py-3 rounded-2xl hover:bg-brand-blue/90 cursor-pointer shadow-md shadow-brand-blue/15 duration-200"
          >
            <Plus className="w-4 h-4" />
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
                        // Map appropriate icons automatically based on category selection
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
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
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
          {locations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => handleSelectLocation(loc.name)}
              onMouseEnter={() => setHoveredCard(loc.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="bg-white rounded-[2rem] border border-zinc-200/80 p-6 shadow-sm hover:shadow-xl hover:border-brand-blue/30 transition-all duration-300 cursor-pointer flex flex-col justify-between relative group overflow-hidden"
            >
              {/* Subtle visual accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-100 group-hover:bg-brand-blue transition-colors"></div>
              
              <div>
                {/* Header line */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {getIconComponent(loc.icon)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {loc.isCustom && (
                      <button
                        title="Hapus lokasi kustom ini"
                        onClick={(e) => handleDeleteLocation(loc.id, loc.name, e)}
                        className="p-1 px-2.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg border border-rose-100 transition-all text-[9px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    )}
                    <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${getBadgeColor(loc.category)}`}>
                      {loc.category}
                    </span>
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
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Buka Halaman Antrean
                </span>
                <span className="w-8 h-8 rounded-full bg-brand-blue/5 text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}

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
      <section className="max-w-4xl mx-auto px-6 sm:px-10 py-12">
        <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/20 border border-blue-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
          <h3 className="text-xs font-black text-brand-blue uppercase tracking-widest mb-6 text-center">
            Bagaimana Cara AntriKu Membantu Anda?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-brand-blue font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark mb-1">Pilih Lokasi</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Pilih klinik, apotek, salon, atau toko kuliner dari halaman beranda utama.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-brand-blue font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark mb-1">Ambil Antrean</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Isi nama lengkap, WhatsApp & jenis layanan untuk mengklaim nomor digital Anda.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-brand-blue font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark mb-1">Pantau di TV Monitor</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Lihat nomor pemanggilan aktif secara real-time dari halaman Monitor TV.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
