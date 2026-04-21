import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../types';

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('guru');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegistering) {
        // Feature: Auto-promote VERY first user to admin in SQL is harder, 
        // so we just rely on the form for this demo or manual SQL update.
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || 'New User',
              role: role,
            }
          }
        });
        if (signUpError) throw signUpError;
        alert("Pendaftaran berhasil! Silahkan cek email atau langsung login jika email verification dimatikan di Supabase.");
        setIsRegistering(false);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate('/app');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan. Silahkan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-200"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100">
             <LogIn className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{isRegistering ? 'Daftar Akun' : 'Selamat Datang'}</h1>
          <p className="text-slate-500 mt-2">
            {isRegistering 
              ? 'Pendaftaran akun Guru/Staff SMK Prima Unggul.' 
              : 'Silahkan login ke Sistem Absensi SMK Prima Unggul.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {isRegistering && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all"
                  placeholder="Masukkan nama..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1">Role / Jabatan</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all"
                >
                   <option value="admin">Admin (Testing)</option>
                  <option value="guru">Guru</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all"
              placeholder="nama@email.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-2 mt-4 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                {isRegistering ? 'Daftar Sekarang' : 'Masuk ke Aplikasi'}
                <LogIn className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm font-bold text-red-600 hover:underline"
          >
            {isRegistering ? 'Sudah punya akun? Login di sini' : 'Belum punya akun? Daftar Guru/Staff'}
          </button>
        </div>

        <p className="text-center text-slate-400 text-[10px] mt-8 uppercase tracking-widest font-bold">
          SUPABASE BACKEND • SMK PRIMA UNGGUL
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
