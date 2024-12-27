import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  ViewColumnsIcon,
  ClipboardDocumentListIcon,
  FireIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

function MainLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Masalar', path: '/masalar', icon: ViewColumnsIcon },
    { name: 'Hızlı Satış', path: '/hizli-satis', icon: FireIcon },
    { name: 'Paket Sipariş', path: '/paket-siparis', icon: ClipboardDocumentListIcon },
    { name: 'Mutfak', path: '/mutfak', icon: FireIcon },
    { name: 'Stoklar', path: '/stoklar', icon: CubeIcon },
    { name: 'Cariler', path: '/cariler', icon: ChartBarIcon },
    { name: 'Raporlar', path: '/raporlar', icon: ChartBarIcon },
    { name: 'Ayarlar', path: '/ayarlar', icon: Cog6ToothIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Kullanıcı adının baş harflerini al
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-secondary-900/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-soft z-30 transform transition-transform duration-200 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-secondary-100">
            <h1 className="text-xl font-display font-semibold text-primary-600">
              RestoPOS
            </h1>
            <button
              className="p-1 rounded-lg text-secondary-400 hover:bg-secondary-50 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-secondary-100">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {getInitials(user?.name || 'Kullanıcı')}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-secondary-900">
                  {user?.name || 'Kullanıcı'}
                </p>
                <p className="text-xs text-secondary-500">
                  {user?.role || 'Rol'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow-soft">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              className="p-1 rounded-lg text-secondary-400 hover:bg-secondary-50 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Header actions */}
            <div className="flex items-center space-x-4">
              <button className="btn btn-secondary flex items-center">
                <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
                Yardım
              </button>
              <button 
                className="btn btn-primary flex items-center"
                onClick={handleLogout}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-4">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white shadow-soft-up">
          <div className="max-w-7xl mx-auto py-4 px-4">
            <p className="text-center text-sm text-secondary-500">
              © 2024 RestoPOS. Tüm hakları saklıdır.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default MainLayout; 