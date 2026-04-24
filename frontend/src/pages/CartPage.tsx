import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, increaseQty, decreaseQty, removeItem, totals } = useCart();

  return (
    <section className="py-8">
      <div className="mx-auto w-[min(1180px,calc(100%-28px))]">
        <div className="mb-6">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-ssn-500">Your selection</p>
          <h2 className="text-5xl font-bold text-ssn-700 sm:text-4xl">Campus cart</h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-[26px] border border-slate-200 bg-white p-10 text-center shadow-soft">
            <h3 className="text-3xl font-bold text-slate-900">Your cart is empty</h3>
            <p className="mt-2 text-slate-500">Add student listings and come back when you are ready to place an order.</p>
            <Link className="mt-5 inline-flex rounded-2xl bg-gradient-to-r from-ssn-600 to-ssn-500 px-5 py-3 font-bold text-white shadow-soft" to="/marketplace">
              Browse listings
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-4">
              {cartItems.map(item => (
                <div key={item.id} className="grid gap-4 rounded-[26px] border border-slate-200 bg-white p-4 shadow-soft sm:grid-cols-[120px_1fr]">
                  <img src={item.imageUrl} alt={item.title} className="h-[120px] w-full rounded-2xl object-cover sm:w-[120px]" />
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-ssn-700">{item.category}</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-slate-500">{item.sellerName} · {item.pickupLocation}</p>
                    <strong className="mt-2 block text-3xl text-ssn-700">₹{item.price}</strong>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button className="h-10 w-10 rounded-xl bg-gradient-to-r from-ssn-600 to-ssn-500 p-0 font-bold text-white" onClick={() => decreaseQty(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button className="h-10 w-10 rounded-xl bg-gradient-to-r from-ssn-600 to-ssn-500 p-0 font-bold text-white" onClick={() => increaseQty(item.id)}>+</button>
                      <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 font-semibold text-ssn-700" onClick={() => removeItem(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-[26px] border border-slate-200 bg-white p-6 shadow-soft">
              <h3 className="text-2xl font-bold text-ssn-700">Order summary</h3>
              <div className="mt-4 flex justify-between border-b border-slate-200 py-3"><span className="text-slate-500">Items</span><strong>{totals.itemCount}</strong></div>
              <div className="flex justify-between border-b border-slate-200 py-3"><span className="text-slate-500">Subtotal</span><strong>₹{totals.subtotal}</strong></div>
              <div className="flex justify-between border-b border-slate-200 py-3"><span className="text-slate-500">Platform fee</span><strong>₹{totals.platformFee}</strong></div>
              <div className="flex justify-between py-3 text-lg"><span>Total</span><strong>₹{totals.total}</strong></div>
              <Link className="mt-4 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-ssn-600 to-ssn-500 px-5 py-4 font-bold text-white shadow-soft" to="/checkout">
                Proceed to checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
