import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  ClipboardList, 
  Calendar, 
  Filter, 
  Download,
  Users,
  GraduationCap,
  Loader2,
  FileText
} from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '../lib/utils';

const Rekap = () => {
  const { isAdmin, isGuru } = useAuth();
  const [activeTab, setActiveTab] = useState<'karyawan' | 'siswa'>(isAdmin ? 'karyawan' : 'siswa');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));

  const fetchRekap = async () => {
    setLoading(true);
    try {
      const startDate = format(startOfMonth(new Date(month)), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(new Date(month)), 'yyyy-MM-dd');
      
      const table = activeTab === 'karyawan' ? 'attendance_employees' : 'attendance_students';
      let query = supabase
        .from(table)
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });
      
      const { data: records, error } = await query;
      if (error) throw error;
      
      // If student tab, we may want to join with student names or just rely on IDs for this simple demo
      setData(records || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRekap();
  }, [activeTab, month]);

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Rekapitulasi Absensi</h1>
          <p className="text-slate-500 font-medium">Laporan kehadiran terintegrasi SMK Prima Unggul.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-[1.5rem] border border-slate-200 shadow-sm group">
           <Calendar className="w-5 h-5 text-red-600 ml-2 group-hover:scale-110 transition-transform" />
           <input 
             type="month" 
             value={month}
             onChange={(e) => setMonth(e.target.value)}
             className="border-none bg-transparent font-black text-slate-700 outline-none pr-4 text-sm uppercase tracking-wider"
           />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* SIDE BAR DASHBOARD STYLE FOR REKAP TABS */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50 p-8 flex flex-col gap-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pilih Kategori Lap.</p>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('karyawan')}
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                activeTab === 'karyawan' ? "bg-red-600 text-white shadow-xl shadow-red-500/20" : "text-slate-500 hover:bg-white hover:shadow-sm"
              )}
            >
              <Users className="w-5 h-5" />
              Presensi Karyawan
            </button>
          )}
          {(isAdmin || isGuru) && (
            <button
              onClick={() => setActiveTab('siswa')}
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                activeTab === 'siswa' ? "bg-red-600 text-white shadow-xl shadow-red-500/20" : "text-slate-500 hover:bg-white hover:shadow-sm"
              )}
            >
              <GraduationCap className="w-5 h-5" />
              Presensi Siswa
            </button>
          )}

          <div className="mt-10 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-red-600" />
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">Summary</h4>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
               Laporan dihasilkan secara otomatis dari basis data Cloud Supabase.
             </p>
          </div>
        </div>

        <div className="flex-1 p-10 flex flex-col">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  Log {activeTab === 'karyawan' ? 'Karyawan' : 'Siswa'}
                </h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Periode: {format(new Date(month), 'MMMM yyyy', { locale: id })}</p>
              </div>
              <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] hover:bg-red-600 transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 group">
                 <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                 PDF.EXPORT
              </button>
           </div>

           <div className="overflow-x-auto rounded-[2rem] border border-slate-100 flex-1 min-h-[400px]">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100">
                   <th className="px-8 py-6">Hari/Tgl</th>
                   <th className="px-8 py-6">Nama Subjek</th>
                   {activeTab === 'karyawan' ? (
                     <th className="px-8 py-6">Pukul</th>
                   ) : (
                     <th className="px-8 py-6">Kelas</th>
                   )}
                   <th className="px-8 py-6">Keterangan</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {loading ? (
                   <tr>
                    <td colSpan={4} className="p-24 text-center">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto text-red-600" />
                      <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Menarik Data Cloud...</p>
                    </td>
                   </tr>
                 ) : data.length === 0 ? (
                   <tr>
                    <td colSpan={4} className="p-24 text-center">
                      <ClipboardList className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold italic">Rekaman tidak ditemukan pada periode ini.</p>
                    </td>
                   </tr>
                 ) : data.map((item) => (
                   <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                     <td className="px-8 py-6 font-black text-slate-500 text-xs tracking-tighter uppercase whitespace-nowrap">
                       {format(new Date(item.date), 'EEEE, dd MMM', { locale: id })}
                     </td>
                     <td className="px-8 py-6 font-black text-slate-900 tracking-tight">{item.user_name || 'ID: ' + item.student_id.slice(0,8)}</td>
                     <td className="px-8 py-6 text-xs font-black text-slate-400 font-mono tracking-widest">
                       {active_tab_info(item, activeTab)}
                     </td>
                     <td className="px-8 py-6">
                        <span className={cn(
                          "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm",
                          item.status === 'present' ? "bg-green-50 text-green-700 border-green-100" :
                          item.status === 'late' ? "bg-amber-50 text-amber-700 border-amber-100" :
                          item.status === 'sick' ? "bg-blue-50 text-blue-700 border-blue-100" :
                          "bg-red-50 text-red-700 border-red-100"
                        )}>
                          {item.status}
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );

  function active_tab_info(item: any, tab: string) {
    if (tab === 'karyawan') {
      return format(new Date(item.time), 'HH:mm') + ' WIB';
    }
    return item.class;
  }
};

export default Rekap;
