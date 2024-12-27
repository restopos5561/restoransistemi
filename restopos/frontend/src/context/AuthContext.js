import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini al
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Giriş başarısız');
      }

      console.log('Login response:', data);
      console.log('User data:', data.user);
      const userRoleName = getRoleName(data.user.rol);
      console.log('User role:', userRoleName);

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuth = () => {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
  };

  const getRoleName = (rolId) => {
    const rolMap = {
      1: 'admin',
      2: 'mudur',
      3: 'kasiyer',
      4: 'garson',
      5: 'asci'
    };
    return rolMap[rolId] || null;
  };

  const hasRole = (requiredRoles) => {
    if (!user || typeof user.rol === 'undefined') {
      console.log('Rol kontrolü başarısız: Kullanıcı veya rol bilgisi eksik', { user });
      return false;
    }
    const userRoleName = getRoleName(user.rol);
    console.log('Rol kontrolü:', { userRoleName, requiredRoles });
    return requiredRoles.includes(userRoleName);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    hasRole,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 