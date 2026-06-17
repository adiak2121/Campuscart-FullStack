import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { AuthResponse } from '../types';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post<AuthResponse>('/admin/login', { email, password });
      localStorage.setItem('campuscart-admin', JSON.stringify(response.data));
      navigate('/admin');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-100 to-blue-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-slate-800">Admin Login</h1>
        <p className="mb-6 text-slate-500">CampusCart Admin Panel</p>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </section>
  );
}
