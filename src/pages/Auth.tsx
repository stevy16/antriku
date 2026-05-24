import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useQueue } from '../context/QueueContext';
import { 
  Store, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles,
  Activity,
  Tv,
  Check,
  UserCheck
} from 'lucide-react';

export default function Auth() {
  const { registerBusiness, loginAdmin, authState } = useQueue();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRegisterParam = searchParams.get('tab') === 'register';

  const [isRegister, setIsRegister] = useState(isRegisterParam);
  
  // Registration Form State
  const [ownerName, setOwnerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Klinik & Kesehatan');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [counters, setCounters] = useState(3);
  
  // Login Form State
  const [email, setEmail] = useState('admin@antriku.co.id');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Quick Autofill Demo Credentials
  const triggerAutofill = () => {
    setEmail('admin@antriku.co.id');
    setPassword('password123');
    setSuccessMsg('✨ Kredensial Demo Terisi Otomatis! Silakan klik Masuk.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Harap masukkan email dan kata sandi admin.');
      return;
    }
    
    const success = loginAdmin(email, password);
    if (success) {
      setSuccessMsg('🛡️ Autentikasi JWT sukses! Mengalihkan ke Dasbor Admin...');
      setTimeout(() => {
        navigate('/admin');
      }, 1200);
    } else {
      setErrorMsg('Kredensial admin tidak valid. Silakan gunakan e-mail uji coba.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!businessName || !phone || !address || !ownerName) {
      setErrorMsg('Harap lengkapi seluruh formulir registrasi toko.');
      return;
    }

    const success = registerBusiness(businessName, category, phone, address, counters);
    if (success) {
      setSuccessMsg('🎉 Pendaftaran Bisnis Baru Berhasil! Mengalihkan ke Dasbor Admin...');
      setTimeout(() => {
        navigate('/admin');
      }, 1200);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 px-6 lg:px-12 bg-slate-50 min-h-screen flex items-center justify-center font-sans"
    >
      <div className="w-full max-w-5xl bg-white border border-zinc-200/80 rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* LEFT COLUMN: VISUAL BRAND PANEL WITH SIMULATED SYSTEM DIAGRAM & QUICK AUTOFULL HELP */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Background overlay decorations */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/15 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-505/10 blur-3xl rounded-full -translate-x-12 translate-y-12"></div>

          {/* Header element */}
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-blue-200">
                AntriKu Admin Gateway v2.1
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-3 text-white">
              Sistem Pengelola <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-extrabold">
                Antrean Real-time
              </span>
            </h1>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mb-8">
              Satu portal pusat untuk mendelegasikan nomor loket, memanggil pelanggan, dan memantau TV Display antrean secara sinkron virtual.
            </p>
          </div>

          {/* Interactive Live Monitor Preview Mockup Card */}
          <div className="relative z-10 bg-white/5 border border-white/10 p-5 rounded-2xl mb-8">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[10px] font-black tracking-wider text-emerald-400 uppercase">TELEMETRI HARIAN</span>
              </div>
              <Activity className="w-4 h-4 text-zinc-400" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  <span className="text-[10.5px] font-medium text-zinc-300">Total Lokasi Aktif</span>
                </div>
                <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-white">4 Pos utama</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                  <span className="text-[10.5px] font-medium text-zinc-300">Sertifikat Enkripsi</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 shrink-0" /> Signed JWT
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  <span className="text-[10.5px] font-medium text-zinc-300">Simulasi Sinkronisasi</span>
                </div>
                <span className="text-xs font-mono text-amber-350">100% Real-time</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Helper Section */}
          <div className="relative z-10 bg-gradient-to-r from-blue-950/40 to-indigo-950/30 border border-brand-blue/30 rounded-2xl p-4 md:p-5 mt-auto">
            <h4 className="text-xs font-extrabold text-blue-300 uppercase tracking-wider mb-1 flex items-center gap-2">
              <span>💡 Mode Uji Coba Cepat</span>
            </h4>
            <p className="text-[10.5px] text-zinc-400 leading-relaxed mb-3">
              Gunakan kredensial pengelola standar di bawah ini untuk langsung mengeksplorasi Dashboard Admin tanpa registrasi panjang.
            </p>
            <button 
              type="button"
              onClick={triggerAutofill}
              className="w-full py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-brand-blue/15 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Autofill Kredensial Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: RICH PORTAL INTERACTIVE LOGIN & SIGNUP FORMS */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center relative">
          
          {/* Dual Toggle tab selectors */}
          <div className="flex border-b border-zinc-150 mb-8 max-w-sm">
            <button 
              type="button"
              onClick={() => { setIsRegister(false); setErrorMsg(''); setSuccessMsg(''); }}
              className={`w-1/2 pb-4 text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                !isRegister ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-zinc-400 hover:text-zinc-650'
              }`}
            >
              Masuk Dashboard
            </button>
            <button 
              type="button"
              onClick={() => { setIsRegister(true); setErrorMsg(''); setSuccessMsg(''); }}
              className={`w-1/2 pb-4 text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                isRegister ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-zinc-400 hover:text-zinc-650'
              }`}
            >
              Daftar Lokasi Baru
            </button>
          </div>

          {/* Status Alert Panels Container */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-650 rounded-2xl text-xs font-black"
              >
                ⚠️ {errorMsg}
              </motion.div>
            )}
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-xs font-black flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-500 stroke-[3px]" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FORM PORT SWITCHERS */}
          <AnimatePresence mode="wait">
            {!isRegister ? (
              /* LOGIN FORM SUB-PANEL */
              <motion.form 
                key="login-form-sub"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLogin} 
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-black text-brand-dark tracking-tight">
                    Masuk Portal Admin
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Silakan input email pengelola untuk mengakses dashboard manajemen antrean terpadu.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Email Input wrapper */}
                  <div>
                    <label className="block text-[10px] font-black text-zinc-450 uppercase tracking-widest mb-1.5">
                      Email Pengelola / Admin
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                      <input 
                        type="email"
                        placeholder="Contoh: admin@antriku.co.id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-zinc-200 rounded-2xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input wrapper */}
                  <div>
                    <label className="block text-[10px] font-black text-zinc-450 uppercase tracking-widest mb-1.5">
                      Sandi Pengaman
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-zinc-200 rounded-2xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 transition-colors cursor-pointer"
                        title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-brand-blue hover:bg-brand-blue/95 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-blue/20 cursor-pointer"
                  >
                    <span>Masuk Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            ) : (
              /* REGISTRATION FORM SUB-PANEL */
              <motion.form 
                key="register-form-sub"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRegister} 
                className="space-y-4"
              >
                <div>
                  <h2 className="text-2xl font-black text-brand-dark tracking-tight">
                    Registrasi Bisnis & Lokasi Baru
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Buat tempat layanan atau klinik digital kustom tersinkronis dengan database pusat.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-zinc-450 uppercase tracking-widest mb-1.5">
                      Nama Admin/Pemilik Usaha
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Contoh: Stevy Rafa"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-zinc-450 uppercase tracking-widest mb-1.5">
                      Nama Tempat Layanan
                    </label>
                    <div className="relative">
                      <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                      <input 
                        type="text"
                        required
                        placeholder="Klinik Gigi Rafa Sehat"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-zinc-450 uppercase tracking-widest mb-1.5">
                      Kategori Usaha
                    </label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="Klinik & Kesehatan">🩺 Klinik & Kesehatan</option>
                      <option value="Apotek">💊 Apotek</option>
                      <option value="Barbershop">💈 Barbershop / Salon</option>
                      <option value="Restoran">🍔 Restoran / Kuliner</option>
                      <option value="Kafe">☕ Kafe & Coffee Shop</option>
                      <option value="Jasa / Kantor">💼 Jasa / Kantor Umum</option>
                      <option value="Lainnya">🏪 Lokasi Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-zinc-450 uppercase tracking-widest mb-1.5">
                      No WhatsApp Bisnis
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                      <input 
                        type="text"
                        required
                        placeholder="Contoh: 0812345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-450 uppercase tracking-widest mb-1.5">
                    Alamat Lengkap Tempat Layanan
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                    <input 
                      type="text"
                      required
                      placeholder="Contoh: Jl. Grand Boulevard No. 12, Kelapa Gading"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-450 uppercase tracking-widest mb-1.5">
                    Jumlah Loket Pemanggilan Aktif (Maks 10)
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                    <input 
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={counters}
                      onChange={(e) => setCounters(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-zinc-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-brand-blue hover:bg-brand-blue/95 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-blue/20 cursor-pointer"
                  >
                    <span>Daftarkan Bisnis Baru</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer certification validation banner */}
          <div className="mt-8 pt-6 border-t border-zinc-150 flex items-center justify-center gap-2 text-[9px] font-black text-zinc-450 tracking-widest uppercase">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
            <span>Sertifikat Terverifikasi & Sinkronisasi Token Otomatis</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
