import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import type { Order } from '../types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get<Order[]>('/orders');
      setOrders(response.data.filter(order => order.buyerEmail === user?.email));
    } catch (error) {
      console.error('Failed to load orders', error);
    }
  };

  return (
    <section className="py-8">
      <div className="mx-auto w-[min(1180px,calc(100%-28px))]">
        <div className="mb-6">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-ssn-500">Student activity</p>
          <h2 className="text-5xl font-bold text-ssn-700 sm:text-4xl">Your orders</h2>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-[26px] border border-slate-200 bg-white p-10 text-center shadow-soft">
            <h3 className="text-3xl font-bold text-slate-900">No orders yet</h3>
            <p className="mt-2 text-slate-500">Place an order from the campus marketplace and it will show up here.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {orders.map(order => (
              <article key={order.id} className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-soft">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{order.buyerName}</h3>
                    <p className="mt-1 text-slate-500">{order.pickupPoint} · {order.pickupSlot}</p>
                  </div>
                  <span className="h-fit rounded-full bg-ssn-50 px-4 py-2 font-bold text-ssn-700">{order.status}</span>
                </div>

                <div className="mt-4 flex justify-between border-b border-slate-200 py-3"><span className="text-slate-500">Total</span><strong>₹{order.totalAmount}</strong></div>
                {order.note && <p className="mt-3 text-slate-500">Note: {order.note}</p>}

                <div className="mt-5 grid gap-4">
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-${index}`} className="grid gap-4 rounded-3xl border border-slate-200 p-4 sm:grid-cols-[120px_1fr]">
                      <img src={item.imageUrl} alt={item.title} className="h-[120px] w-full rounded-2xl object-cover sm:w-[120px]" />
                      <div>
                        <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
                        <p className="mt-1 text-slate-500">{item.sellerName}</p>
                        <p className="mt-1 text-slate-500">Qty: {item.quantity}</p>
                        <strong className="mt-2 block text-2xl text-ssn-700">₹{item.price}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
