import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  GraduationCap, 
  ClipboardList, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

export const Sidebar = () => {
  const { profile, isAdmin, isGuru, isStaff } = useAuth();
  
  const navItems = [
    {
      label: 'Dashboard',
      path: '/app',
      icon: LayoutDashboard,
      roles: ['admin', 'guru', 'staff']
    },
    {
      label: 'Absensi Karyawan',
      path: '/app/absensi-karyawan',
      icon: UserCheck,
      roles: ['admin', 'guru', 'staff']
    },
    {
      label: 'Absensi Siswa',
      path: '/app/absensi-siswa',
      icon: GraduationCap,
      roles: ['admin', 'guru']
    },
    {
      label: 'Data Siswa',
      path: '/app/data-siswa',
      icon: Users,
      roles: ['admin']
    },
    {
      label: 'Rekap Absensi',
      path: '/app/rekap',
      icon: ClipboardList,
      roles: ['admin', 'guru']
    },
    {
      label: 'User Management',
      path: '/app/users',
      icon: Settings,
      roles: ['admin']
    }
  ];

  return (
    <div className="h-screen w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 hidden lg:flex">
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
             <span className="text-white font-black text-xl">P</span>
          </div>
          <div>
             <h1 className="text-lg font-black text-slate-900 leading-none">SMK Prima</h1>
             <p className="text-red-600 text-[10px] font-black uppercase tracking-widest mt-0.5">Unggul</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Menu Utama</p>
        {navItems.filter(item => item.roles.includes(profile?.role || '')).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm tracking-tight",
              isActive 
                ? "bg-red-600 text-white shadow-xl shadow-red-500/20 translate-x-2" 
                : "text-slate-500 hover:bg-red-50 hover:text-red-600"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-red-600")} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Akun Aktif</p>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-red-600 font-bold">
                {profile?.name?.charAt(0) || 'U'}
             </div>
             <div className="min-w-0">
                <p className="font-black text-slate-900 text-xs truncate">{profile?.name || 'User'}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{profile?.role}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Header = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2 lg:hidden">
         <h1 className="text-lg font-bold text-brand-600">SMK Prima Unggul</h1>
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold">{profile?.name}</p>
          <p className="text-xs text-slate-500">{profile?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 rounded-lg transition-all font-medium text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
