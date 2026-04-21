import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Monitor, 
  Palette, 
  Calculator, 
  Tv, 
  Briefcase, 
  ShoppingCart,
  ArrowRight,
  Shield,
  Star,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const jurusans = [
    { 
      name: 'TKJ', 
      title: 'Teknik Komputer & Jaringan', 
      desc: 'Mempelajari cara membangun network, maintenance komputer, hingga cybersecurity.', 
      icon: Monitor,
      color: 'bg-blue-500',
      span: 'col-span-2 row-span-2'
    },
    { 
      name: 'DKV', 
      title: 'Desain Komunikasi Visual', 
      desc: 'Wujudkan kreativitas melalui desain grafis, ilustrasi, dan multimedia.', 
      icon: Palette,
      color: 'bg-red-500',
      span: 'col-span-1 row-span-1'
    },
    { 
      name: 'AK', 
      title: 'Akuntansi', 
      desc: 'Mencetak tenaga ahli akuntansi yang teliti dan kompeten di bidang keuangan.', 
      icon: Calculator,
      color: 'bg-green-500',
      span: 'col-span-1 row-span-1'
    },
    { 
      name: 'BC', 
      title: 'Broadcasting', 
      desc: 'Dunia pertelevisian dan produksi konten digital di tanganmu.', 
      icon: Tv,
      color: 'bg-purple-500',
      span: 'col-span-1 row-span-1'
    },
    { 
      name: 'MPLB', 
      title: 'Manajemen Perkantoran', 
      desc: 'Tata kelola bisnis dan administrasi perkantoran modern.', 
      icon: Briefcase,
      color: 'bg-amber-500',
      span: 'col-span-1 row-span-1'
    },
    { 
      name: 'BD', 
      title: 'Bisnis Digital', 
      desc: 'Strategi pemasaran era digital dan e-commerce.', 
      icon: ShoppingCart,
      color: 'bg-indigo-500',
      span: 'col-span-2 row-span-1'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans']">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
               <span className="text-white font-black text-xl">P</span>
            </div>
            <div>
               <h1 className="text-lg font-black text-slate-900 leading-none">SMK Prima</h1>
               <p className="text-red-600 text-[10px] font-black uppercase tracking-widest mt-0.5">Unggul</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-slate-500">
             <a href="#profil" className="hover:text-red-600 transition-colors">Profil</a>
             <a href="#jurusan" className="hover:text-red-600 transition-colors">Jurusan</a>
             <a href="#kontak" className="hover:text-red-600 transition-colors">Kontak</a>
          </div>
          <Link 
            to="/login" 
            className="px-8 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
          >
            Akses Sistem
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="profil" className="pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full text-red-600 text-[10px] font-black uppercase tracking-widest mb-8">
              <Star className="w-3 h-3 fill-current" /> Terakreditasi A
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter">
              Membangun <br /> Generasi <span className="text-red-600">Terbaik.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-lg mb-10 leading-relaxed">
              SMK Prima Unggul berkomitmen mencetak lulusan yang kompeten, berakhlak, dan siap bersaing di era digital.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
               <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-red-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-2xl shadow-red-500/30 group">
                 Mulai Absensi <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Link>
               <div className="flex -space-x-3 items-center">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                       <img src={`https://picsum.photos/seed/user${i}/100/100`} referrerPolicy="no-referrer" alt="User" />
                    </div>
                  ))}
                  <div className="pl-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     +1.2k Siswa Aktif
                  </div>
               </div>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8 }}
             className="relative"
          >
             <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                   <div className="h-64 bg-slate-200 rounded-[3rem] overflow-hidden shadow-2xl">
                      <img src="https://picsum.photos/seed/school1/600/800" className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="School" />
                   </div>
                   <div className="p-8 bg-red-600 text-white rounded-[3rem] shadow-2xl shadow-red-500/20">
                      <Shield className="w-10 h-10 mb-4 opacity-50" />
                      <h4 className="text-xl font-black tracking-tight leading-none">Aman & Terpadu</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-70">Kehadiran Realtime</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="p-8 bg-slate-900 text-white rounded-[3rem] shadow-2xl">
                      <Users className="w-10 h-10 mb-4 text-red-500" />
                      <h4 className="text-xl font-black tracking-tight leading-none">Tenaga Profesional</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-40">Pengajar Berkompeten</p>
                   </div>
                   <div className="h-80 bg-slate-200 rounded-[3rem] overflow-hidden shadow-2xl">
                      <img src="https://picsum.photos/seed/school2/600/800" className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="School" />
                   </div>
                </div>
             </div>
             <div className="absolute inset-0 bg-red-600/5 blur-[100px] -z-10 rounded-full"></div>
          </motion.div>
        </div>
      </section>

      {/* Program Keahlian Section - BENTO STYLE */}
      <section id="jurusan" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Our Excellence</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                Program Keahlian <br /> Unggulan.
              </h2>
            </div>
            <p className="max-w-xs text-slate-400 text-sm font-medium leading-relaxed">
              Pilih masa depanmu dari 6 peminatan strategis yang kami sediakan untuk karir gemilang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 h-auto md:h-[900px]">
            {jurusans.map((j, i) => (
              <motion.div
                key={j.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "relative group rounded-[3rem] p-10 flex flex-col justify-end overflow-hidden border border-slate-200 hover:border-red-600 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-red-500/10",
                  j.span
                )}
              >
                <div className={cn("absolute top-0 right-0 p-8 text-white opacity-10 group-hover:opacity-20 transition-all group-hover:scale-150 group-hover:-rotate-12")}>
                   <j.icon size={120} />
                </div>
                <div className="relative z-10">
                   <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl text-white", j.color)}>
                      <j.icon className="w-8 h-8" />
                   </div>
                   <div className="flex items-center gap-3 mb-2">
                     <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{j.name}</h3>
                     <span className="h-px flex-1 bg-slate-100"></span>
                   </div>
                   <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">{j.title}</h4>
                   <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">
                      {j.desc}
                   </p>
                   
                   <button className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-600 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      Selengkapnya <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
                
                {/* Background visual element */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                 <span className="text-white font-black text-xl">P</span>
              </div>
              <h1 className="text-lg font-black text-slate-900 leading-none uppercase tracking-tighter">SMK Prima Unggul</h1>
            </div>
            <p className="text-slate-400 text-sm font-medium max-w-sm leading-relaxed">
              Mencetak generasi bangsa yang tidak hanya cerdas secara intelektual, namun juga kokoh secara karakter dan spiritual.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8">Navigasi</h4>
            <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
               <li><a href="#" className="hover:text-red-600 transition-colors">Visi & Misi</a></li>
               <li><a href="#" className="hover:text-red-600 transition-colors">Struktur Organisasi</a></li>
               <li><a href="#" className="hover:text-red-600 transition-colors">Fasilitas</a></li>
               <li><a href="#" className="hover:text-red-600 transition-colors">PPDB Online</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8">Media Sosial</h4>
            <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
               <li><a href="#" className="hover:text-red-600 transition-colors">Instagram</a></li>
               <li><a href="#" className="hover:text-red-600 transition-colors">YouTube</a></li>
               <li><a href="#" className="hover:text-red-600 transition-colors">TikTok</a></li>
               <li><a href="#" className="hover:text-red-600 transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
           <p>© 2024 SMK PRIMA UNGGUL. CODED WITH ❤️</p>
           <div className="flex gap-8">
              <a href="#" className="hover:text-slate-500">Privacy Policy</a>
              <a href="#" className="hover:text-slate-500">Terms of Service</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

// Utility function copied from lib/utils.ts for easy access inside this file if needed
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default LandingPage;
