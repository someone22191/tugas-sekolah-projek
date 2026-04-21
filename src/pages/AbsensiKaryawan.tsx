import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { UserCheck, Clock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const AbsensiKaryawan = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [alreadyAbsent, setAlreadyAbsent] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const checkTodayStatus = async () => {
    if (!user) return;
    try {
      setChecking(true);
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('attendance_employees')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today);
        
      if (error) throw error;
      setAlreadyAbsent(data && data.length > 0);

      // Fetch recent history
      const { data: historyData, error: historyError } = await supabase
        .from('attendance_employees')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5);
        
      if (historyError) throw historyError;
      setHistory(historyData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkTodayStatus();
  }, [user]);

  const handleAbsen = async (status: 'present' | 'sick' | 'absent') => {
    if (!user) return;
    setLoading(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const { error } = await supabase.from('attendance_employees').insert({
        user_id: user.id,
        user_name: profile?.name || 'User',
        date: today,
        time: new Date().toISOString(),
        status
      });
      
      if (error) throw error;
      setAlreadyAbsent(true);
      checkTodayStatus();
    } catch (err: any) {
      console.error(err);
      alert("Gagal melakukan absensi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">Absensi Karyawan</h1>
        <p className="text-slate-500 font-medium tracking-wide uppercase text-xs">Pencatatan Kehadiran Harian Terpadu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {checking ? (
            <div className="bg-white p-12 rounded-[2rem] border border-slate-200 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Sinkronisasi Data...</p>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
               <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">WAKTU LOKAL</p>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{format(new Date(), 'HH:mm')} <span className="text-xl font-bold text-slate-300">WIB</span></h2>
                  </div>
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 group-hover:text-red-100 group-hover:scale-110 transition-all">
                    <UserCheck className="w-10 h-10" />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {alreadyAbsent ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-10 bg-green-50 rounded-[2rem] border border-green-100 flex flex-col items-center text-center space-y-6"
                    >
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-200 animate-bounce-slow">
                        <CheckCircle2 className="w-12 h-12" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-green-900 tracking-tight">Presensi Berhasil!</h3>
                        <p className="text-green-700 font-medium mt-1 leading-relaxed max-w-xs mx-auto text-sm">Terima kasih atas kedisiplinan Anda hari ini. Selamat menunaikan tugas!</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="actions"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-8"
                    >
                      <div className="p-5 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4 text-red-700 text-xs font-bold leading-relaxed">
                        <AlertTriangle className="w-6 h-6 shrink-0 opacity-50" />
                        Peringatan: Lakukan absensi hanya jika sudah berada di area sekolah sesuai sistem GPS atau titik kumpul.
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <button
                          onClick={() => handleAbsen('present')}
                          disabled={loading}
                          className="flex flex-col items-center justify-center gap-4 bg-red-600 hover:bg-red-700 text-white p-10 rounded-[2rem] transition-all shadow-2xl shadow-red-500/30 group active:scale-95 disabled:opacity-50"
                        >
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                             <UserCheck className="w-8 h-8" />
                          </div>
                          <span className="font-black text-xl tracking-tighter uppercase">Kirim Kehadiran</span>
                        </button>
                        
                        <div className="grid grid-rows-2 gap-5">
                          <button
                             onClick={() => handleAbsen('sick')}
                             disabled={loading}
                             className="flex items-center justify-center gap-3 bg-white border-2 border-amber-200 text-amber-700 hover:bg-amber-50 rounded-[1.5rem] font-black uppercase text-xs tracking-widest transition-all disabled:opacity-50 hover:border-amber-400"
                          >
                             Sakit / Izin
                          </button>
                          <button
                             onClick={() => handleAbsen('absent')}
                             disabled={loading}
                             className="flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-500 hover:bg-slate-50 rounded-[1.5rem] font-black uppercase text-xs tracking-widest transition-all disabled:opacity-50"
                          >
                             Informasi Alpa
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
               </div>
               <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-red-500/5 rounded-full blur-[60px] pointer-events-none"></div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-full relative overflow-hidden shadow-2xl shadow-slate-900/20">
            <h3 className="text-sm font-black flex items-center gap-3 mb-8 text-red-500 tracking-[0.2em] uppercase">
              <Clock className="w-5 h-5 flex-shrink-0" /> Riwayat Terakhir
            </h3>
            <div className="space-y-4 relative z-10">
              {history.length > 0 ? history.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                  <div>
                    <p className="text-sm font-black text-slate-100 tracking-tight">{format(new Date(item.date), 'EEEE, dd MMM', { locale: id })}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mt-1 tracking-widest">{format(new Date(item.time), 'HH:mm')} WIB</p>
                  </div>
                  <span className={cn(
                    "text-[9px] font-black uppercase px-3 py-1.5 rounded-full border tracking-widest shadow-sm",
                    item.status === 'present' 
                      ? "bg-green-500/10 text-green-400 border-green-500/30" 
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  )}>
                    {item.status}
                  </span>
                </div>
              )) : (
                <div className="text-center py-20 opacity-30">
                   <Clock className="w-12 h-12 mx-auto mb-4" />
                   <p className="text-xs font-bold uppercase tracking-widest italic">Belum ada data</p>
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsensiKaryawan;
