import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import type { UserProfile } from '../types';

type LoginForm = {
  name: string;
  email: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState<LoginForm>({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    try {
      setLoading(true);
      const response = await api.post<UserProfile>('/auth/login', form);
      login(response.data);
      navigate('/');
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Only SSN student email addresses are allowed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(11,78,173,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(44,116,255,0.18),transparent_22%),linear-gradient(180deg,#f9fcff_0%,#edf5ff_100%)] p-6">
      <div className="w-full max-w-5xl rounded-[32px] border border-white/70 bg-white/95 p-8 shadow-[0_26px_60px_rgba(11,78,173,0.16)]">
        <div className="mb-8 flex flex-col items-start gap-5 md:flex-row md:items-center">
          <img src="/assets/ssn-logo.png" alt="SSN Logo" className="w-32 object-contain" />
          <div>
            <h1 className="text-5xl font-bold text-ssn-700">SSN CampusCart</h1>
            <p className="mt-2 text-xl text-slate-500">Buy and sell within your campus community.</p>
          </div>
        </div>

        <div className="mb-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <strong className="mb-2 block text-ssn-700">Campus-only access</strong>
            <span className="text-slate-500">Validates @ssn.edu.in emails</span>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <strong className="mb-2 block text-ssn-700">Balanced categories</strong>
            <span className="text-slate-500">Food, books, clothing, accessories and more</span>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <strong className="mb-2 block text-ssn-700">Seller trust badges</strong>
            <span className="text-slate-500">Quick trust cues for student buyers</span>
          </div>
        </div>

        <form className="grid gap-4" onSubmit={submitForm}>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none"
            placeholder="Your name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none"
            type="email"
            placeholder="yourname@ssn.edu.in"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          {message && <p className="text-red-600">{message}</p>}
          <button
            className="rounded-2xl bg-gradient-to-r from-ssn-600 to-ssn-500 px-5 py-4 font-bold text-white shadow-soft"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Checking access...' : 'Enter Marketplace'}
          </button>
        </form>
      </div>
    </section>
  );
}
