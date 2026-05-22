import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="relative inline-flex mb-4">
            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary-500 animate-spin"></div>
            <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-r-4 border-l-4 border-primary-300 animate-ping opacity-25"></div>
          </div>
          <p className="text-slate-400 text-sm font-medium animate-pulse">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
