import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      const res = await fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text || 'Invalid admin credentials.');
        return;
      }
      const data = await res.json();
      localStorage.setItem('campuscart-admin', JSON.stringify(data));
      navigate('/admin');
    } catch {
      setError('Something went wrong. Please try again.');
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
