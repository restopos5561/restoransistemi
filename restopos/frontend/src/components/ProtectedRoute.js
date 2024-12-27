import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, hasRole, user } = useAuth();

  console.log('ProtectedRoute kontrol:', {
    isAuthenticated,
    userRole: user?.rol,
    requiredRoles,
    path: window.location.pathname
  });

  if (!isAuthenticated) {
    console.log('Kullanıcı girişi yapılmamış, login sayfasına yönlendiriliyor');
    return <Navigate to="/login" />;
  }

  if (requiredRoles.length > 0) {
    const hasAccess = hasRole(requiredRoles);
    console.log('Yetki kontrolü:', { hasAccess, userRole: user?.rol, requiredRoles });
    
    if (!hasAccess) {
      console.error('Yetki hatası: Kullanıcının bu sayfaya erişim yetkisi yok', {
        userRole: user?.rol,
        requiredRoles,
        path: window.location.pathname
      });
      return <Navigate to="/unauthorized" />;
    }
  }

  return children;
};

export default ProtectedRoute; 