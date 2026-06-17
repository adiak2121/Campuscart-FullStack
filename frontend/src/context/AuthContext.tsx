import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse, UserProfile } from '../types';

type AuthContextType = {
  user: UserProfile | null;
  token: string | null;
  login: (auth: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
  const savedAuth = localStorage.getItem('campuscart-auth');

  if (savedAuth) {
    const auth = JSON.parse(savedAuth);

    if (auth.user && auth.token) {
      setUser(auth.user);
      setToken(auth.token);
      return;
    }
  }

  const savedUser = localStorage.getItem('campuscart-user');
  if (savedUser) {
    setUser(JSON.parse(savedUser) as UserProfile);
  }
}, []);

  const login = (auth: AuthResponse) => {
  const loggedInUser: UserProfile = {
    name: auth.name,
    email: auth.email,
    role: auth.role
  };

  setUser(loggedInUser);
  setToken(auth.token);

  localStorage.setItem(
    'campuscart-auth',
    JSON.stringify({
      token: auth.token,
      user: loggedInUser
    })
  );

  localStorage.setItem('campuscart-user', JSON.stringify(loggedInUser));
};
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campuscart-auth');
    localStorage.removeItem('campuscart-user');
  };

  const value = useMemo(
    () => ({ user, token, login, logout, isAuthenticated: !!user && !!token }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
