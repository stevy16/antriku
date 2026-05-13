import { motion } from 'motion/react';
import { ShieldAlert, Hourglass, Users, Settings, Plus } from 'lucide-react';

const problems = [
  { icon: <ShieldAlert className="text-brand-pink" />, title: "Long Physical Queues", description: "Customers wasting hours standing in line reduces satisfaction and business throughput." },
  { icon: <Hourglass className="text-brand-pink" />, title: "Uncertain Waiting Times", description: "Not knowing when they will be served causes customer anxiety and walk-aways." },
  { icon: <Users className="text-brand-pink" />, title: "Crowding", description: "Packed waiting rooms create stress and can be health hazards in clinical settings." },
  { icon: <Settings className="text-brand-pink" />, title: "Inefficient Management", description: "Manual systems are prone to error and provide zero data for business improvement." },
];

const industries = [
  "Clinics and healthcare services",
  "Barbershops and salons",
  "Restaurants and cafes",
  "Banks and public service offices",
  "Small service businesses (laundry, workshops, etc.)"
];

const techStack = [
  { name: "Frontend", tools: "React.js, Flutter" },
  { name: "Backend", tools: "Node.js with Express" },
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
              <h1 className="text-4xl md:text-6xl font-bold mb-8">What is AntriKu?</h1>
              <p className="text-lg text-zinc-400 mb-6 leading-relaxed">
                AntriKu is a state-of-the-art cloud-based SaaS solution designed to modernize the way businesses manage customer queues. We believe that professional queue management is not just a luxury, but a necessity in the modern digital economy.
              </p>
              <p className="text-lg text-zinc-400 leading-relaxed">
                By leveraging real-time data and cloud infrastructure, we help businesses transition from chaotic physical lines to a seamless, digital-first waiting experience.
              </p>
            </div>
            <div className="glass p-12 rounded-[2.5rem] relative overflow-hidden group border-brand-pink/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-3xl font-bold mb-6 italic leading-tight">Modern Problems <br />require <span className="text-brand-pink">Smarter Solutions.</span></h3>
              <div className="flex items-center space-x-2 text-zinc-500">
                <div className="w-10 h-[1px] bg-brand-pink/50"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Built for humans</span>
              </div>
            </div>
          </div>
        </section>

        {/* Problems Section */}
        <section className="mb-24 p-12 glass rounded-[2.5rem] border-white/5">
          <h2 className="text-3xl font-bold mb-12 tracking-tighter">The Problems We Solve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {problems.map((p, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-bold text-2xl border border-white/5 group hover:border-brand-pink/30 transition-colors">
                  {p.icon}
                </div>
                <h4 className="font-bold text-lg tracking-tight">{p.title}</h4>
                <p className="text-zinc-500 text-xs leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Target Users */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-8 tracking-tighter">Our Target Users</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {industries.map((ind, i) => (
                  <div key={i} className="flex items-center space-x-3 p-4 glass rounded-2xl border-white/5 hover:border-brand-pink/20 transition-all hover:bg-white/5">
                    <div className="w-5 h-5 rounded-lg bg-brand-pink/20 flex items-center justify-center">
                       <Plus size={12} className="text-brand-pink" />
                    </div>
                    <span className="text-zinc-300 text-xs font-bold uppercase tracking-wider">{ind}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-[2rem] p-8 border-white/5 h-fit self-center">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-4">Technology Stack</h3>
              <div className="space-y-6">
                {techStack.map((tech, i) => (
                  <div key={i} className="flex justify-between items-center group">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{tech.name}</span>
                    <span className="text-brand-pink text-xs font-bold group-hover:text-white transition-colors">{tech.tools}</span>
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
