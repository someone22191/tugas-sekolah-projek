import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  Trash2, 
  Mail, 
  Shield, 
  Clock, 
  Loader2,
  UserCheck,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const UserManagement = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('role')
        .order('name');
        
      if (error) throw error;
      setUsers((data || []) as UserProfile[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (uid: string) => {
    if (!window.confirm("Hapus akun user ini?")) return;
    try {
      // Direct delete in profiles (SQL triggers could mirror this if configured, 
      // but typically we'd use a service role or edge function to delete from Auth).
      // For this demo, we delete from the profile table.
      const { error } = await supabase.from('profiles').delete().eq('id', uid);
      if (error) throw error;
      fetchUsers();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAdmin) return <div className="p-10 text-center font-black text-red-600 uppercase tracking-widest">Akses Ditolak.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Kelola akses dan hak istimewa pengguna.</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-red-50 px-6 py-3 rounded-2xl border border-red-100 text-red-600">
           <UserCheck className="w-5 h-5" />
           <span className="text-xs font-black uppercase tracking-widest">{users.length} Total Account</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-6">
           <div className="relative w-full max-w-md">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
             <input 
               type="text" 
               placeholder="Cari email atau nama pengguna..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-bold text-slate-800"
             />
           </div>
           
           <div className="flex bg-white px-4 py-3 rounded-2xl border border-slate-200 text-slate-400 text-xs font-black items-center gap-3 uppercase tracking-widest">
              <Filter className="w-4 h-4" /> Filter Role
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] border-b border-slate-100">
                <th className="px-10 py-6">User Identity</th>
                <th className="px-10 py-6">Privilege / Role</th>
                <th className="px-10 py-6">Joined Date</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-24 text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto" />
                    <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Scanning User Core...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-24 text-center py-32">
                    <Shield className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold italic">User record empty.</p>
                  </td>
                </tr>
              ) : filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-red-100 group-hover:text-red-600 transition-all shadow-sm">
                         <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 tracking-tight text-lg">{u.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-70">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      u.role === 'admin' ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-200" : 
                      u.role === 'guru' ? "bg-slate-900 text-white border-slate-900" :
                      "bg-white text-slate-500 border-slate-200"
                    )}>
                      <Shield className="w-3 h-3" />
                      {u.role}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {u.created_at ? format(new Date(u.created_at), 'dd MMM yyyy') : 'No Date'}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button 
                      onClick={() => u.id && handleDeleteUser(u.id)}
                      className="w-12 h-12 flex items-center justify-center text-slate-200 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                      title="Delete User Account"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-slate-900 rounded-[2rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="max-w-xl text-center md:text-left">
              <h3 className="text-2xl font-black tracking-tight mb-2">Sinkronisasi Database</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Setiap perubahan pada role user akan langsung merefleksikan perubahan akses di seluruh komponen aplikasi. Gunakan fitur ini dengan bijak untuk menjaga integritas data.
              </p>
           </div>
           <button className="px-10 py-5 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition shadow-xl shadow-red-500/20 active:scale-95 shrink-0">
              Audit Logs System
           </button>
        </div>
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
      </div>
    </div>
  );
};

export default UserManagement;
