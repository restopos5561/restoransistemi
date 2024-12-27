import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Masalar from '../pages/Masalar';
import Urunler from '../pages/Urunler';
import HizliSatis from '../pages/HizliSatis';
import PaketSiparis from '../pages/PaketSiparis';
import Mutfak from '../pages/Mutfak';
import Stoklar from '../pages/Stoklar';
import Cariler from '../pages/Cariler';
import Raporlar from '../pages/Raporlar';
import Ayarlar from '../pages/Ayarlar';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/masalar" element={<ProtectedRoute><Masalar /></ProtectedRoute>} />
        <Route path="/urunler" element={<ProtectedRoute><Urunler /></ProtectedRoute>} />
        <Route path="/hizli-satis" element={
          <ProtectedRoute requiredRoles={['admin', 'mudur', 'kasiyer']}>
            <HizliSatis />
          </ProtectedRoute>
        } />
        <Route path="/paket-siparis" element={
          <ProtectedRoute requiredRoles={['admin', 'mudur', 'kasiyer']}>
            <PaketSiparis />
          </ProtectedRoute>
        } />
        <Route path="/mutfak" element={
          <ProtectedRoute requiredRoles={['admin', 'mudur', 'asci']}>
            <Mutfak />
          </ProtectedRoute>
        } />
        <Route path="/stoklar" element={
          <ProtectedRoute requiredRoles={['admin', 'mudur']}>
            <Stoklar />
          </ProtectedRoute>
        } />
        <Route path="/cariler" element={
          <ProtectedRoute requiredRoles={['admin', 'mudur']}>
            <Cariler />
          </ProtectedRoute>
        } />
        <Route path="/raporlar" element={
          <ProtectedRoute requiredRoles={['admin', 'mudur']}>
            <Raporlar />
          </ProtectedRoute>
        } />
        <Route path="/ayarlar" element={
          <ProtectedRoute requiredRoles={['admin']}>
            <Ayarlar />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 