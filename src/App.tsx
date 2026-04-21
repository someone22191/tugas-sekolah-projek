import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar, Header } from './components/Navigation';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AbsensiKaryawan from './pages/AbsensiKaryawan';
import AbsensiSiswa from './pages/AbsensiSiswa';
import DataSiswa from './pages/DataSiswa';
import Rekap from './pages/Rekap';
import UserManagement from './pages/UserManagement';

const ProtectedRoute = ({ roles }: { roles?: string[] }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (roles && profile && !roles.includes(profile.role)) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
};

const AppLayout = () => {
  return (
    <div className="flex bg-slate-50 h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 lg:p-10">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Protected App Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="absensi-karyawan" element={<AbsensiKaryawan />} />
              
              {/* Guru & Admin */}
              <Route element={<ProtectedRoute roles={['admin', 'guru']} />}>
                <Route path="absensi-siswa" element={<AbsensiSiswa />} />
                <Route path="rekap" element={<Rekap />} />
              </Route>

              {/* Admin Only */}
              <Route element={<ProtectedRoute roles={['admin']} />}>
                <Route path="data-siswa" element={<DataSiswa />} />
                <Route path="users" element={<UserManagement />} />
              </Route>
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
