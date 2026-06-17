import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { AuthResponse } from '../types';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const saved = localStorage.getItem('campuscart-admin');

  if (!saved) return <Navigate to="/admin/login" replace />;

  const auth = JSON.parse(saved) as AuthResponse;

  return auth?.token && auth?.role === 'ADMIN'
    ? <>{children}</>
    : <Navigate to="/admin/login" replace />;
}