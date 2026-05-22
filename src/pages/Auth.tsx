import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useQueue } from '../context/QueueContext';
import { Store, Mail, Lock, Phone, MapPin, Layers, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

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

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Harap masukkan email dan kata sandi admin.');
      return;
    }
    
    const success = loginAdmin(email, password);
    if (success) {
      setSuccessMsg('🛡️ Autentikasi JWT sukses! Mengalihkan ke Dasbor Admin...');
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } else {
      setErrorMsg('Kredensial admin tidak valid.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !phone || !address || !ownerName) {
      setErrorMsg('Harap lengkapi seluruh formulir registrasi toko.');
      return;
    }

    const success = registerBusiness(businessName, category, phone, address, counters);
    if (success) {
      setSuccessMsg('🎉 Pendaftaran Bisnis Baru Berhasil! Mengalihkan ke Dasbor Admin...');
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 hero-gradient min-h-screen flex items-center justify-center font-sans"
    >
      <div className="w-full max-w-xl bg-white border border-zinc-150 rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 blur-3xl rounded-full"></div>
        
        {/* Toggle Mode Tab */}
        <div className="flex border-b border-zinc-100 mb-8">
          <button 
            type="button"
            onClick={() => { setIsRegister(false); setErrorMsg(''); setSuccessMsg(''); }}
            className={`w-1/2 pb-4 text-xs font-black uppercase tracking-widest transition-all ${
              !isRegister ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-zinc-400 hover:text-zinc-650'
            }`}
          >
            Masuk Admin (JWT)
          </button>
          <button 
            type="button"
            onClick={() => { setIsRegister(true); setErrorMsg(''); setSuccessMsg(''); }}
            className={`w-1/2 pb-4 text-xs font-black uppercase tracking-widest transition-all ${
              isRegister ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-zinc-400 hover:text-zinc-650'
            }`}
          >
            Daftar Bisnis Baru
          </button>
        </div>

        {/* Dynamic Status Alert Message */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-650 rounded-2xl text-xs font-bold">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN VIEW */}
        {!isRegister ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest mb-1">Informasi Kredensial</p>
              <h2 className="text-2xl font-extrabold text-brand-dark mb-4">Masuk ke AntriKu Dashboard</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">Email Admin</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full py-4 bg-brand-blue hover:bg-brand-blue/95 text-white font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-blue/25 hover:scale-[1.01]"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-2">
              <span className="text-[10px] text-zinc-400 font-bold">Default Uji Coba: <span className="text-zinc-600 font-mono">admin@antriku.co.id</span> / <span className="text-zinc-600 font-mono">password123</span></span>
            </div>
          </form>
        ) : (
          /* REGISTRATION VIEW */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest mb-1">Mulai Gratis 14 Hari</p>
              <h2 className="text-2xl font-extrabold text-brand-dark mb-4">Daftarkan Toko & Bisnis Anda</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">Nama Pemilik</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Dr. Stevy Rafa"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">Nama Usaha / Klinik</label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Apotek Rafa Sehat"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">Kategori Usaha</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                >
                  <option value="Klinik & Kesehatan">🏥 Klinik & Kesehatan</option>
                  <option value="Pangkas Rambut & Salon">💈 Pangkas Rambut & Salon</option>
                  <option value="Restoran & Kafe">☕ Restoran & Kafe</option>
                  <option value="Bank & Keuangan">🏦 Bank & Keuangan</option>
                  <option value="Bengkel Jasa">🚗 Bengkel & Jasa Lokal</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">WhatsApp Notif Bisnis</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: 0812349090"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">Alamat Lengkap Lokasi Fisik</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input 
                  type="text"
                  required
                  placeholder="Jl. Thamrin No. 10, Jakarta Pusat"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">Jumlah Inisiasi Loket</label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input 
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={counters}
                  onChange={(e) => setCounters(parseInt(e.target.value) || 1)}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full py-4 bg-brand-blue hover:bg-brand-blue/95 text-white font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-blue/25 hover:scale-[1.01]"
              >
                <span>Daftar Sekarang (JWT Token)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5 text-brand-blue" />
          <span>Sistem Menggunakan JWT Token & Enkripsi TLS</span>
        </div>
      </div>
    </motion.div>
  );
}
