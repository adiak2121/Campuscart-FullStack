import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

type CheckoutForm = {
  pickupPoint: string;
  pickupSlot: string;
  note: string;
};

const initialState: CheckoutForm = {
  pickupPoint: 'Main Cafeteria',
  pickupSlot: '12:30 PM - 1:00 PM',
  note: ''
};

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, totals, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>(initialState);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setMessage('Add some items before placing an order.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/orders', {
        buyerName: user?.name,
        buyerEmail: user?.email,
        pickupPoint: form.pickupPoint,
        pickupSlot: form.pickupSlot,
        note: form.note,
        totalAmount: totals.total,
        items: cartItems.map(item => ({
          listingId: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          sellerName: item.sellerName,
          imageUrl: item.imageUrl
        }))
      });
      clearCart();
      setMessage('Order placed successfully.');
      setTimeout(() => navigate('/orders'), 700);
    } catch (error) {
      console.error('Failed to place order', error);
      setMessage('Could not place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8">
      <div className="mx-auto grid w-[min(1180px,calc(100%-28px))] gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <form className="grid gap-4 rounded-[26px] border border-slate-200 bg-white p-6 shadow-soft" onSubmit={submitOrder}>
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-ssn-500">Pickup checkout</p>
            <h2 className="text-5xl font-bold text-ssn-700 sm:text-4xl">Confirm your order</h2>
          </div>

          <div className="grid gap-1 rounded-2xl bg-ssn-50 p-4 text-ssn-700">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>

          <select className="rounded-2xl border border-slate-200 px-4 py-4 outline-none" value={form.pickupPoint} onChange={e => setForm({ ...form, pickupPoint: e.target.value })}>
            <option>Main Cafeteria</option><option>Library Gate</option><option>Hostel Lobby</option><option>Admin Block</option>
          </select>

          <select className="rounded-2xl border border-slate-200 px-4 py-4 outline-none" value={form.pickupSlot} onChange={e => setForm({ ...form, pickupSlot: e.target.value })}>
            <option>12:30 PM - 1:00 PM</option><option>1:00 PM - 1:30 PM</option><option>4:30 PM - 5:00 PM</option><option>5:00 PM - 5:30 PM</option>
          </select>

          <textarea className="rounded-2xl border border-slate-200 px-4 py-4 outline-none" rows={4} placeholder="Add an optional note for the seller..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
          {message && <p className="text-green-700">{message}</p>}
          <button className="rounded-2xl bg-gradient-to-r from-ssn-600 to-ssn-500 px-5 py-4 font-bold text-white shadow-soft" type="submit" disabled={loading}>
            {loading ? 'Placing order...' : 'Place order'}
          </button>
        </form>

        <aside className="h-fit rounded-[26px] border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-2xl font-bold text-ssn-700">Checkout summary</h3>
          <div className="mt-4 flex justify-between border-b border-slate-200 py-3"><span className="text-slate-500">Items</span><strong>{totals.itemCount}</strong></div>
          <div className="flex justify-between border-b border-slate-200 py-3"><span className="text-slate-500">Subtotal</span><strong>₹{totals.subtotal}</strong></div>
          <div className="flex justify-between border-b border-slate-200 py-3"><span className="text-slate-500">Platform fee</span><strong>₹{totals.platformFee}</strong></div>
          <div className="flex justify-between py-3 text-lg"><span>Total</span><strong>₹{totals.total}</strong></div>
          <p className="mt-4 text-slate-500">All orders are saved in MongoDB and shown on the Orders page.</p>
        </aside>
      </div>
    </section>
  );
}
