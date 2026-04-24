import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const admin = localStorage.getItem('campuscart-admin');
  return admin ? <>{children}</> : <Navigate to="/admin/login" replace />;
}
