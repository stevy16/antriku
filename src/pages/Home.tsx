import { motion } from 'motion/react';
import { ArrowRight, GalleryHorizontal as Gallery, CheckCircle2, Clock, Bell, LayoutDashboard, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  // ... existing features
];

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-10 relative z-10 w-full pt-20 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 bg-brand-pink/10 border border-brand-pink/20 rounded-full">
                <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-tighter font-semibold text-brand-pink">Now powering 500+ businesses</span>
              </div>
              <h1 className="text-6xl md:text-[5.5rem] font-bold leading-[0.95] tracking-tighter mb-8">
                Smarter Queue <br/>Management for <br/><span className="text-brand-pink italic">Modern Businesses.</span>
              </h1>
              <p className="text-lg text-zinc-400 mb-10 max-w-md leading-relaxed">
                Reduce waiting time, eliminate crowding, and improve customer experience with AntriKu's cloud-based digital queue ecosystem.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/about"
                  className="px-8 py-4 bg-brand-pink text-black font-bold rounded-xl text-sm uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/gallery"
                  className="px-8 py-4 glass text-white font-bold rounded-xl text-sm uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  View Gallery
                </Link>
              </div>

              {/* Target User Badges */}
              <div className="mt-16">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 font-bold">Built for Professionals</p>
                <div className="flex flex-wrap gap-3">
                  {['Clinics', 'Barbershops', 'Restaurants', 'Banks', 'Workshops'].map((badge) => (
                    <span key={badge} className="px-4 py-1.5 glass rounded-lg text-[11px] text-zinc-300 font-medium">{badge}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Visual Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative hidden lg:flex items-center justify-center pt-10"
            >
              <div className="w-full max-w-md aspect-[4/5] glass rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Live Status</p>
                    <h3 className="text-xl font-bold">Digital Dashboard</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-pink/20 flex items-center justify-center text-brand-pink">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>
                </div>

                {/* Big Number */}
                <div className="bg-white/5 rounded-3xl p-10 text-center border border-white/5 mb-8 flex flex-col justify-center flex-1">
                  <p className="text-brand-pink uppercase tracking-widest text-xs font-bold mb-4">Current Serving</p>
                  <div className="text-8xl font-black tracking-tighter">A-24</div>
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
                      Estimated wait: <span className="text-white font-mono">12 MINS</span>
                    </p>
                  </div>
                </div>

                {/* Queue List */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-xl bg-brand-pink text-black font-bold">
                    <span className="text-sm">B-12</span>
                    <span className="text-[10px] uppercase tracking-widest">Ready to serve</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-sm text-zinc-300">C-08</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Next in line</span>
                  </div>
                </div>

                {/* Tech Stack Floating Label */}
                <div className="absolute -bottom-1 -right-1 pt-6 pl-6 pb-4 pr-4 glass rounded-tl-3xl border-brand-pink/20">
                  <p className="text-[8px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Powered By</p>
                  <div className="flex gap-4 items-center opacity-80">
                    <span className="text-[10px] font-bold text-zinc-200">React</span>
                    <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
                    <span className="text-[10px] font-bold text-zinc-200">Node</span>
                    <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
                    <span className="text-[10px] font-bold text-zinc-200">PostgreSQL</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-black relative">
        <div className="pink-gradient absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-40"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              Everything you need to transform your customer waiting experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Digital Queue Number',
                description: 'Instantly issue digital tickets to your customers via their smartphones.',
                icon: <CheckCircle2 className="w-6 h-6 text-brand-pink" />,
              },
              {
                title: 'Estimated Waiting Time',
                description: 'Precision algorithms calculate exact wait times to reduce customer anxiety.',
                icon: <Clock className="w-6 h-6 text-brand-pink" />,
              },
              {
                title: 'Queue Notifications',
                description: 'Automated SMS or push alerts when it is almost their turn.',
                icon: <Bell className="w-6 h-6 text-brand-pink" />,
              },
              {
                title: 'Real-time Dashboard',
                description: 'Live view of your current traffic and service performance.',
                icon: <LayoutDashboard className="w-6 h-6 text-brand-pink" />,
              },
              {
                title: 'Service Analytics',
                description: 'Data-driven insights to optimize staffing and reduce bottlenecks.',
                icon: <BarChart3 className="w-6 h-6 text-brand-pink" />,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-brand-zinc rounded-3xl border border-white/5 hover:border-brand-pink/30 transition-colors group"
              >
                <div className="w-14 h-14 bg-brand-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 bg-brand-pink/10 border border-brand-pink/20 rounded-full mb-8">
            <span className="text-brand-pink text-xs font-bold uppercase tracking-widest">Why AntriKu?</span>
          </div>
          <h2 className="text-3xl md:text-6xl font-bold mb-12 max-w-4xl mx-auto leading-tight">
            Saving Time is <span className="text-brand-pink italic">Economic Value</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Unlocking Efficiency</h3>
              <p className="text-zinc-500 leading-relaxed">
                Physical lines are a drain on your resources. AntriKu allows your staff to focus on service, not line management. By digitizing the queue, you gain visibility into peak hours and service bottlenecks.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Customer Loyalty</h3>
              <p className="text-zinc-500 leading-relaxed">
                Nobody likes waiting. By giving control back to the customer—allowing them to book from home or grab a coffee while waiting—you build instant trust and loyalty that translates to repeat business.
              </p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
