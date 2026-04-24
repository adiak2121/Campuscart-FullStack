import { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

type SellForm = {
  title: string;
  category: string;
  description: string;
  price: string;
  imageUrl: string;
  pickupLocation: string;
  pickupSlot: string;
  dailySpecial: boolean;
};

const initialState: SellForm = {
  title: '',
  category: 'Food',
  description: '',
  price: '',
  imageUrl: '',
  pickupLocation: 'Main Cafeteria',
  pickupSlot: '12:30 PM - 1:00 PM',
  dailySpecial: false
};

export default function SellPage() {
  const { user } = useAuth();
  const [form, setForm] = useState<SellForm>(initialState);
  const [message, setMessage] = useState('');

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/listings', {
        ...form,
        price: Number(form.price),
        sellerName: user?.name,
        sellerEmail: user?.email
      });
      setMessage('Listing created successfully and added to the marketplace.');
      setForm(initialState);
    } catch (error) {
      console.error('Failed to create listing', error);
      setMessage('Could not create listing. Please try again.');
    }
  };

  return (
    <section className="py-8">
      <div className="mx-auto w-[min(1180px,calc(100%-28px))]">
        <div className="mb-6">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-ssn-500">Student seller space</p>
          <h2 className="text-5xl font-bold text-ssn-700 sm:text-4xl">Create your listing</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <form className="grid gap-4 rounded-[26px] border border-slate-200 bg-white p-6 shadow-soft" onSubmit={submitForm}>
            <input className="rounded-2xl border border-slate-200 px-4 py-4 outline-none" placeholder="Listing title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <select className="rounded-2xl border border-slate-200 px-4 py-4 outline-none" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option>Food</option>
              <option>Stationery</option>
              <option>Textbooks</option>
              <option>Clothing</option>
              <option>Accessories</option>
            </select>
            <textarea className="rounded-2xl border border-slate-200 px-4 py-4 outline-none" placeholder="Describe what you're selling..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={5} required />
            <input className="rounded-2xl border border-slate-200 px-4 py-4 outline-none" type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            <input className="rounded-2xl border border-slate-200 px-4 py-4 outline-none" placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} required />
            <select className="rounded-2xl border border-slate-200 px-4 py-4 outline-none" value={form.pickupLocation} onChange={e => setForm({ ...form, pickupLocation: e.target.value })}>
              <option>Main Cafeteria</option><option>Library Gate</option><option>Hostel Lobby</option><option>Admin Block</option>
            </select>
            <select className="rounded-2xl border border-slate-200 px-4 py-4 outline-none" value={form.pickupSlot} onChange={e => setForm({ ...form, pickupSlot: e.target.value })}>
              <option>12:30 PM - 1:00 PM</option><option>1:00 PM - 1:30 PM</option><option>4:30 PM - 5:00 PM</option><option>5:00 PM - 5:30 PM</option>
            </select>
            <label className="flex items-center gap-3"><input type="checkbox" checked={form.dailySpecial} onChange={e => setForm({ ...form, dailySpecial: e.target.checked })} />Mark as today's special</label>
            {message && <p className="text-green-700">{message}</p>}
            <button className="rounded-2xl bg-gradient-to-r from-ssn-600 to-ssn-500 px-5 py-4 font-bold text-white shadow-soft" type="submit">Publish listing</button>
          </form>

          <aside className="grid gap-4">
            <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-soft">
              <h3 className="text-2xl font-bold text-ssn-700">Easy feature add-ons</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-500">
                <li>Wishlist or save for later</li>
                <li>Recently added badge</li>
                <li>Order status updates</li>
                <li>Simple seller profile</li>
              </ul>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-soft">
              <h3 className="text-2xl font-bold text-ssn-700">Already included</h3>
              <p className="mt-3 leading-8 text-slate-500">
                Campus-only login, seller badges, pickup slots, balanced categories, student selling flow, cart, checkout, and MongoDB-backed orders.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
