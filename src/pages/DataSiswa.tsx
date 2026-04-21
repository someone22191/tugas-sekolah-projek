import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Search, 
  GraduationCap,
  Loader2,
  X,
  FileText,
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Student } from '../types';

const DataSiswa = () => {
  const { isAdmin } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('Semua');
  
  const [newStudent, setNewStudent] = useState({
    nis: '',
    name: '',
    class: 'TKJ'
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      let query = supabase.from('students').select('*').order('class').order('name');
      
      if (selectedClassFilter !== 'Semua') {
        query = query.eq('class', selectedClassFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setStudents((data || []) as Student[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedClassFilter]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('students').insert({
        nis: newStudent.nis,
        name: newStudent.name,
        class: newStudent.class
      });
      if (error) throw error;
      setShowModal(false);
      setNewStudent({ nis: '', name: '', class: 'TKJ' });
      fetchStudents();
    } catch (err: any) {
      console.error(err);
      alert("Gagal menambahkan siswa: " + err.message);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm("Hapus data siswa ini?")) return;
    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.nis.includes(search)
  );

  const classes = ['Semua', 'TKJ', 'DKV', 'AK', 'BC', 'MPLB', 'BD'];

  if (!isAdmin) return <div className="p-10 text-center font-bold text-red-600 uppercase tracking-widest">Akses Ditolak.</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Manajemen Siswa</h1>
          <p className="text-slate-500 font-medium">Database terpusat SMK Prima Unggul.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-red-700 transition shadow-2xl shadow-red-500/30 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Registrasi Siswa
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-center">
           <div className="relative w-full max-w-md">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
             <input 
               type="text" 
               placeholder="Cari nama atau NIS siswa..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-medium text-slate-700"
             />
           </div>
           
           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
                 {classes.map(c => (
                   <button
                     key={c}
                     onClick={() => setSelectedClassFilter(c)}
                     className={cn(
                       "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight transition-all",
                       selectedClassFilter === c 
                         ? "bg-white text-red-600 shadow-sm border border-red-100" 
                         : "text-slate-400 hover:text-slate-600"
                     )}
                   >
                     {c}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] border-b border-slate-100">
                <th className="px-10 py-6">NIS</th>
                <th className="px-10 py-6">Nama Lengkap</th>
                <th className="px-10 py-6">Program Keahlian</th>
                <th className="px-10 py-6 text-right">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-24 text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto" />
                    <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Memuat Data...</p>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-24 text-center">
                    <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold italic text-sm">Tidak ada data siswa ditemukan.</p>
                  </td>
                </tr>
              ) : filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 group transition-colors">
                  <td className="px-10 py-6 font-mono text-xs font-black text-slate-400 tracking-tighter uppercase">{student.nis}</td>
                  <td className="px-10 py-6 font-black text-slate-800 tracking-tight text-lg">{student.name}</td>
                  <td className="px-10 py-6">
                    <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm group-hover:border-red-200 group-hover:text-red-600 transition-all">
                      {student.class}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={() => handleDelete(student.id)}
                      className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-red-600 text-white relative">
              <div className="relative z-10">
                <h3 className="text-2xl font-black tracking-tight">Kandidat Siswa</h3>
                <p className="text-red-100 text-xs font-bold uppercase tracking-widest mt-1 opacity-70">Formulir Input Peserta Didik Baru</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition shadow-inner relative z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute top-[-50%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            </div>
            <form onSubmit={handleAdd} className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nomor Induk Siswa (NIS)</label>
                  <input 
                    required
                    value={newStudent.nis}
                    onChange={(e) => setNewStudent({ ...newStudent, nis: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 outline-none transition font-bold text-slate-800"
                    placeholder="Contoh: 20240001"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nama Lengkap</label>
                  <input 
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 outline-none transition font-bold text-slate-800"
                    placeholder="Masukkan nama lengkap..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Program Studi / Jurusan</label>
                  <div className="relative">
                    <select 
                      value={newStudent.class}
                      onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 outline-none transition font-black text-slate-800 appearance-none bg-no-repeat"
                    >
                      <option value="TKJ">TKJ (Teknik Komputer Jaringan)</option>
                      <option value="DKV">DKV (Desain Komunikasi Visual)</option>
                      <option value="AK">AK (Akuntansi)</option>
                      <option value="BC">BC (Broadcasting)</option>
                      <option value="MPLB">MPLB (Manajemen Perkantoran)</option>
                      <option value="BD">BD (Bisnis Digital)</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-100 transition active:scale-95"
                >
                  Batalkan
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-red-700 shadow-xl shadow-red-500/20 transition active:scale-95"
                >
                  Daftarkan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSiswa;
