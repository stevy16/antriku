import { motion } from 'motion/react';
import { ShieldAlert, Hourglass, Users, Settings, Plus } from 'lucide-react';

const problems = [
  { icon: <ShieldAlert className="text-brand-blue" />, title: "Antrean Fisik Panjang", description: "Pelanggan membuang waktu berjam-jam berdiri dalam barisan antrean, menurunkan kepuasan serta produktivitas bisnis." },
  { icon: <Hourglass className="text-brand-blue" />, title: "Waktu Tunggu Tidak Pasti", description: "Ketidakpastian giliran pelayanan memicu kecemasan dan kekecewaan hingga pembatalan kunjungan." },
  { icon: <Users className="text-brand-blue" />, title: "Kepadatan Ruang Tunggu", description: "Area tunggu yang penuh sesak meningkatkan ketidaknyamanan operasional dan risiko penularan kesehatan." },
  { icon: <Settings className="text-brand-blue" />, title: "Manajemen Tidak Efisien", description: "Sistem tiket manual ataupun kertas sangat rentan kekeliruan dan tidak menyediakan data evaluasi bisnis." },
];

const industries = [
  "Klinik & layanan kesehatan",
  "Pangkas rambut & salon",
  "Restoran & kafe kuliner",
  "Bank & layanan administrasi publik",
  "Bisnis jasa lokal (laundry, bengkel, dll)"
];

const techStack = [
  { name: "Frontend", tools: "React.js, Flutter" },
  { name: "Backend", tools: "Node.js dengan Express" },
  { name: "Database", tools: "PostgreSQL, Firebase" },
  { name: "Hosting", tools: "Vercel, Render" },
];

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-brand-dark">Apa itu AntriKu?</h1>
              <p className="text-lg text-zinc-600 mb-6 leading-relaxed">
                AntriKu adalah platform SaaS (Software as a Service) berbasis cloud inovatif yang dirancang untuk mendigitalisasi serta mengatur antrean pelanggan secara efisien. Kami percaya bahwa kenyamanan pelanggan dan pengelolaan waktu adalah kunci sukses utama bisnis modern.
              </p>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Melalui pemanfaatan data tersinkronisasi secara real-time, kami mempermudah masa transisi dari antrean fisik konvensional yang melelahkan menuju pengalaman menunggu yang praktis, fleksibel, serta serbadigital.
              </p>
            </div>
            <div className="bg-white p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden group border border-brand-blue/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-3xl font-extrabold mb-6 italic leading-tight text-brand-dark font-display">Masalah Modern <br />memerlukan <span className="text-brand-blue font-bold">Solusi Cerdas.</span></h3>
              <div className="flex items-center space-x-2 text-zinc-500">
                <div className="w-10 h-[1px] bg-brand-blue/50"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Dibuat untuk manusia</span>
              </div>
            </div>
          </div>
        </section>

        {/* Problems Section */}
        <section className="mb-24 p-12 bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200">
          <h2 className="text-3xl font-extrabold mb-12 tracking-tighter text-brand-dark">Masalah yang Kami Selesaikan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {problems.map((p, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 bg-brand-blue/5 rounded-2xl flex items-center justify-center font-bold text-2xl border border-zinc-100 group hover:border-brand-blue/30 transition-colors">
                  {p.icon}
                </div>
                <h4 className="font-extrabold text-lg tracking-tight text-brand-dark">{p.title}</h4>
                <p className="text-zinc-500 text-xs leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Target Users */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-extrabold mb-8 tracking-tighter text-brand-dark">Target Pengguna Kami</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {industries.map((ind, i) => (
                  <div key={i} className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm hover:border-brand-blue/20 transition-all hover:bg-zinc-50">
                    <div className="w-5 h-5 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                       <Plus size={12} className="text-brand-blue" />
                    </div>
                    <span className="text-zinc-700 text-xs font-bold uppercase tracking-wider">{ind}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-[2rem] p-8 border border-zinc-100 shadow-xl shadow-zinc-200 h-fit self-center">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6 border-b border-zinc-150 pb-4">Arsitektur Teknologi</h3>
              <div className="space-y-6">
                {techStack.map((tech, i) => (
                  <div key={i} className="flex justify-between items-center group">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{tech.name}</span>
                    <span className="text-brand-blue text-xs font-extrabold group-hover:text-brand-dark transition-colors">{tech.tools}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
