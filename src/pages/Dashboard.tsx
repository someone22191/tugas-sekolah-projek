import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  Clock, 
  UserCheck, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const Dashboard = () => {
  const { profile, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    attendanceToday: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const today = format(new Date(), 'yyyy-MM-dd');

        // All concurrent requests
        const [usersCount, studentsCount, attendanceCount, activities] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('students').select('*', { count: 'exact', head: true }),
          supabase.from('attendance_employees').select('*', { count: 'exact', head: true }).eq('date', today),
          supabase.from('attendance_employees').select('*').order('created_at', { ascending: false }).limit(3)
        ]);

        setStats({
          totalUsers: usersCount.count || 0,
          totalStudents: studentsCount.count || 0,
          attendanceToday: attendanceCount.count || 0
        });
        setRecentActivities(activities.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Selamat datang kembali, {profile?.name}.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200">
          <Calendar className="w-5 h-5 text-red-600" />
          <span className="font-semibold text-slate-700">{format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}</span>
        </div>
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-4 grid-rows-4 gap-4 flex-1">
        {/* Total Students Card */}
        <div className="col-span-1 row-span-1 bg-white p-6 rounded-2xl border border-slate-200 border-l-4 border-l-red-600 flex flex-col justify-between hover:border-red-600 transition-all cursor-default">
           <div className="flex items-center justify-between">
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Total Siswa</p>
              <GraduationCap className="w-5 h-5 text-slate-300" />
           </div>
           <div className="flex items-end gap-2">
              <h3 className="text-4xl font-extrabold text-slate-800">{stats.totalStudents}</h3>
              <span className="text-green-500 text-[10px] font-black mb-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +{stats.totalStudents > 0 ? 'Aktif' : '0'}
              </span>
           </div>
        </div>

        {/* Attendance Percentage Card (Placeholder logic) */}
        <div className="col-span-1 row-span-1 bg-white p-6 rounded-2xl border border-slate-200 border-l-4 border-l-blue-500 flex flex-col justify-between hover:border-red-600 transition-all cursor-default">
           <div className="flex items-center justify-between">
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Kehadiran Guru</p>
              <UserCheck className="w-5 h-5 text-slate-300" />
           </div>
           <div className="flex items-end gap-2">
              <h3 className="text-4xl font-extrabold text-slate-800">98%</h3>
              <span className="text-blue-500 text-[10px] font-black mb-2 uppercase tracking-wide">Optimal</span>
           </div>
        </div>

        {/* Large Decorative Status Card */}
        <div className="col-span-2 row-span-2 bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden group">
           <div className="relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="text-xl font-bold mb-1">Status Presensi Terkini</h3>
                   <p className="text-slate-400 text-xs">Pantau progres absensi setiap jurusan hari ini.</p>
                </div>
                <Activity className="w-6 h-6 text-red-500" />
              </div>
              
              <div className="space-y-5 flex-1 justify-center flex flex-col">
                <ProgressItem label="TKJ - Teknik Komputer Jaringan" progress={94} />
                <ProgressItem label="DKV - Desain Komunikasi Visual" progress={82} />
                <ProgressItem label="AK - Akuntansi" progress={93} />
              </div>
           </div>
           <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-red-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
        </div>

        {/* User Management Quick Summary */}
        <div className="col-span-1 row-span-1 bg-white p-6 rounded-2xl border border-slate-200 hover:border-red-600 transition-all cursor-default">
           <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-4">Akses Aplikasi</p>
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shadow-sm border border-red-100">
                 <Users className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-lg font-extrabold text-slate-800">{stats.totalUsers} Akun</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Terdaftar</p>
              </div>
           </div>
        </div>

        {/* Quick Actions Card */}
        <div className="col-span-1 row-span-1 bg-white p-6 rounded-2xl border border-slate-200 hover:border-red-600 transition-all">
           <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-4">Quick Actions</p>
           <div className="space-y-2">
              <button className="w-full py-2.5 bg-red-600 text-white rounded-xl text-xs font-black shadow-lg shadow-red-500/20 hover:bg-red-700 transition-colors uppercase tracking-widest">
                 + Siswa Baru
              </button>
              <button className="w-full py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">
                 Cetak Laporan
              </button>
           </div>
        </div>

        {/* Recent Activity List */}
        <div className="col-span-2 row-span-2 bg-white rounded-2xl border border-slate-200 p-8 flex flex-col hover:border-red-600 transition-all">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                Aktivitas Absensi
              </h3>
              <span className="text-[10px] text-red-600 font-black uppercase tracking-widest underline cursor-pointer hover:text-red-700 transition-colors">Lihat Semua</span>
           </div>
           <div className="flex-1 space-y-4">
              {recentActivities.map((act, i) => (
                <div key={act.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    act.status === 'present' ? "bg-green-500 shadow-sm" : "bg-red-500 shadow-sm"
                  )}></div>
                  <div className="flex-1">
                    <p className="text-sm font-extrabold text-slate-800">{act.user_name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{act.status === 'present' ? 'Hadir' : 'Keterangan Khusus'} • {format(new Date(act.time), 'HH:mm')} WIB</p>
                  </div>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-40">
                   <AlertCircle className="w-8 h-8 mb-2" />
                   <p className="text-xs font-bold">Belum ada aktivitas hari ini</p>
                </div>
              )}
           </div>
        </div>

        {/* School Motto Branding Card */}
        <div className="col-span-2 row-span-1 bg-red-50 border border-red-100 rounded-2xl flex flex-col justify-center items-center text-center p-8 relative overflow-hidden group">
           <div className="relative z-10">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600 mb-3 shadow-sm mx-auto group-hover:scale-110 transition-transform">
                <span className="font-black text-xl">🚀</span>
              </div>
              <p className="text-sm font-black text-red-600 tracking-tight leading-snug">SMK Prima Unggul: Mencetak Generasi <br/> Berprestasi & Berakhlak Mulia</p>
              <div className="flex gap-2 justify-center mt-3">
                 {['TKJ', 'DKV', 'AK', 'BC', 'MPLB', 'BD'].map(j => (
                   <span key={j} className="text-[9px] font-black bg-white/60 px-2 py-0.5 rounded text-slate-500 uppercase tracking-tighter">
                     {j}
                   </span>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ProgressItem = ({ label, progress }: { label: string, progress: number }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-xs font-bold">
      <span className="text-slate-300 tracking-tight">{label}</span>
      <span className="text-red-400 font-black">{progress}%</span>
    </div>
    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden border border-white/5">
      <div 
        className="bg-red-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(239,68,68,0.3)]" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

export default Dashboard;
