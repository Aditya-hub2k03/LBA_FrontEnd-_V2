import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: ReactNode;
  whiteList?: string[];
}

export const RequireAuth = ({ children, whiteList = [] }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const isWhitelisted = whiteList.some((path) => {
    if (path.endsWith('/*')) {
      return location.pathname.startsWith(path.slice(0, -2));
    }
    return location.pathname === path;
  });

  if (!user && !isWhitelisted) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
