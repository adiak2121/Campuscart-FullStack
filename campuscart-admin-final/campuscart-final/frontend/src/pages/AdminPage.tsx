import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import type { Listing, Order } from '../types';
import { useNavigate } from "react-router-dom";

type Tab = 'overview' | 'sellers' | 'buyers' | 'listings' | 'orders';


const STATUS_OPTIONS = ['Placed', 'Confirmed', 'Ready for Pickup', 'Completed', 'Cancelled'];

const statColor: Record<string, string> = {
  Placed: 'bg-blue-50 text-blue-700 border-blue-200',
  Confirmed: 'bg-amber-50 text-amber-700 border-amber-200',
  'Ready for Pickup': 'bg-purple-50 text-purple-700 border-purple-200',
  Completed: 'bg-green-50 text-green-700 border-green-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const categoryColor: Record<string, string> = {
  Food: 'bg-orange-50 text-orange-700',
  Stationery: 'bg-blue-50 text-blue-700',
  Textbooks: 'bg-green-50 text-green-700',
  Clothing: 'bg-pink-50 text-pink-700',
  Accessories: 'bg-purple-50 text-purple-700',
};

type SellerSummary = {
  email: string;
  name: string;
  badge: string;
  listings: Listing[];
  avgRating: number;
  categories: string[];
};

type BuyerSummary = {
  email: string;
  name: string;
  orders: Order[];
  totalSpent: number;
  orderCount: number;
};

function StatCard({ label, value, sub, accent = false }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-[26px] border p-5 shadow-soft ${accent ? 'border-ssn-200 bg-gradient-to-br from-ssn-700 to-ssn-500 text-white' : 'border-slate-200 bg-white'}`}>
      <p className={`text-xs font-extrabold uppercase tracking-[0.15em] ${accent ? 'text-ssn-100' : 'text-ssn-500'}`}>{label}</p>
      <p className={`mt-2 text-4xl font-bold ${accent ? 'text-white' : 'text-ssn-700'}`}>{value}</p>
      {sub && <p className={`mt-1 text-xs ${accent ? 'text-ssn-200' : 'text-slate-400'}`}>{sub}</p>}
    </div>
  );
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-xs font-semibold text-slate-600 truncate">{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${pct}%`, transition: 'width 0.6s ease' }} />
      </div>
      <span className="w-7 text-right text-xs font-bold text-ssn-700">{value}</span>
    </div>
  );
}

/* ── Name selector dropdown ─────────────────────────────────────── */
function NameSelector({
  label,
  placeholder,
  names,
  selected,
  onSelect,
  accentColor,
}: {
  label: string;
  placeholder: string;
  names: { value: string; label: string; sub?: string }[];
  selected: string;
  onSelect: (v: string) => void;
  accentColor: 'blue' | 'purple';
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = names.filter(
    n =>
      n.label.toLowerCase().includes(search.toLowerCase()) ||
      (n.sub || '').toLowerCase().includes(search.toLowerCase())
  );

  const selectedItem = names.find(n => n.value === selected);

  const accent = accentColor === 'blue'
    ? { ring: 'ring-ssn-400', bg: 'bg-ssn-700', text: 'text-white', hover: 'hover:bg-ssn-50', selectedBg: 'bg-ssn-50', selectedText: 'text-ssn-800', badge: 'bg-ssn-100 text-ssn-700' }
    : { ring: 'ring-purple-400', bg: 'bg-purple-700', text: 'text-white', hover: 'hover:bg-purple-50', selectedBg: 'bg-purple-50', selectedText: 'text-purple-800', badge: 'bg-purple-100 text-purple-700' };

  return (
    <div className="relative">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.15em] text-slate-500">{label}</p>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition focus:outline-none ${
          selected
            ? `border-2 ${accentColor === 'blue' ? 'border-ssn-300 bg-ssn-50' : 'border-purple-300 bg-purple-50'}`
            : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
      >
        <div className="min-w-0">
          {selectedItem ? (
            <div>
              <span className="block font-bold text-slate-900 truncate">{selectedItem.label}</span>
              {selectedItem.sub && <span className="block text-xs text-slate-500 truncate">{selectedItem.sub}</span>}
            </div>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </div>
        <span className="shrink-0 text-slate-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className="p-3 border-b border-slate-100">
            <input
              autoFocus
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1.5">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-slate-400">No results found.</li>
            )}
            {filtered.map(n => (
              <li key={n.value}>
                <button
                  onClick={() => { onSelect(n.value); setOpen(false); setSearch(''); }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                    selected === n.value ? `${accent.selectedBg} ${accent.selectedText}` : `text-slate-800 ${accent.hover}`
                  }`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${accent.bg} ${accent.text} text-sm font-black`}>
                    {n.label.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{n.label}</p>
                    {n.sub && <p className="text-xs text-slate-500 truncate">{n.sub}</p>}
                  </div>
                  {selected === n.value && <span className="shrink-0 text-xs font-bold">✓</span>}
                </button>
              </li>
            ))}
          </ul>
          {selected && (
            <div className="border-t border-slate-100 p-2">
              <button
                onClick={() => { onSelect(''); setOpen(false); setSearch(''); }}
                className="w-full rounded-xl py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main AdminPage ─────────────────────────────────────────────── */
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview');

  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [listingSearch, setListingSearch] = useState('');
  const [listingCategory, setListingCategory] = useState('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('ALL');

  const [selectedSellerEmail, setSelectedSellerEmail] = useState('');
  const [selectedBuyerEmail, setSelectedBuyerEmail] = useState('');

  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' }>({ msg: '', type: 'success' });

  const navigate = useNavigate();

  const logoutAdmin = () => {
    localStorage.removeItem("campuscart-admin");
    navigate("/admin/login");
  };

  useEffect(() => {
    Promise.all([loadListings(), loadOrders()]).finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
  };

  const admin = JSON.parse(localStorage.getItem("campuscart-admin") || "{}");

const loadListings = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/admin/listings", {
      headers: {
        "X-Admin-Email": admin.email,
      },
    });
    const data = await res.json();
    setListings(data);
  } catch {}
};

const loadOrders = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/admin/orders", {
      headers: {
        "X-Admin-Email": admin.email,
      },
    });
    const data = await res.json();
    setOrders(data);
  } catch {}
};

  const deleteListing = async (id: string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    setLoadingDelete(id);
    try {
      await api.delete(`/admin/listings/${id}`);
      setListings(prev => prev.filter(l => l.id !== id));
      showToast('Listing removed successfully.');
    } catch { showToast('Failed to delete listing.', 'error'); }
    finally { setLoadingDelete(null); }
  };

    const updateStatus = async (orderId: string, status: string) => {
  setLoadingStatus(orderId);

  console.log("ADMIN:", admin); // ✅ ADD
  console.log("UPDATING:", orderId, status); // ✅ ADD

  try {
    const res = await fetch(
      `http://localhost:8080/api/admin/order/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Email": admin.email,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.log("ERROR:", text); // ✅ ADD
      throw new Error(text);
    }

    const updated = await res.json();

    setOrders(prev =>
      prev.map(o => (o.id === orderId ? updated : o))
    );

    showToast(`Order updated to "${status}".`);
  } catch (err) {
    console.log("FAILED:", err); // ✅ ADD
    showToast("Failed to update order status.", "error");
  } finally {
    setLoadingStatus(null);
  }
};

  // ── DERIVED DATA ──────────────────────────────────────────────────────────

  const totalRevenue = useMemo(
    () => orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.totalAmount, 0),
    [orders]
  );

  const categories = useMemo(() => ['ALL', ...new Set(listings.map(l => l.category))], [listings]);

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    listings.forEach(l => { map[l.category] = (map[l.category] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [listings]);

  const statusBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [orders]);

  const sellerSummaries = useMemo<SellerSummary[]>(() => {
    const map: Record<string, SellerSummary> = {};
    listings.forEach(l => {
      if (!map[l.sellerEmail]) {
        map[l.sellerEmail] = { email: l.sellerEmail, name: l.sellerName, badge: l.sellerBadge, listings: [], avgRating: 0, categories: [] };
      }
      map[l.sellerEmail].listings.push(l);
    });
    return Object.values(map).map(s => ({
      ...s,
      avgRating: s.listings.reduce((acc, l) => acc + l.rating, 0) / s.listings.length,
      categories: [...new Set(s.listings.map(l => l.category))],
    })).sort((a, b) => b.listings.length - a.listings.length);
  }, [listings]);

  const buyerSummaries = useMemo<BuyerSummary[]>(() => {
    const map: Record<string, BuyerSummary> = {};
    orders.forEach(o => {
      if (!map[o.buyerEmail]) {
        map[o.buyerEmail] = { email: o.buyerEmail, name: o.buyerName, orders: [], totalSpent: 0, orderCount: 0 };
      }
      map[o.buyerEmail].orders.push(o);
    });
    return Object.values(map).map(b => ({
      ...b,
      orderCount: b.orders.length,
      totalSpent: b.orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.totalAmount, 0),
    })).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filteredListings = useMemo(() => listings.filter(l => {
    const q = listingSearch.toLowerCase();
    return (l.title.toLowerCase().includes(q) || l.sellerName.toLowerCase().includes(q) || l.sellerEmail.toLowerCase().includes(q))
      && (listingCategory === 'ALL' || l.category === listingCategory);
  }), [listings, listingSearch, listingCategory]);

  const filteredOrders = useMemo(() => orders.filter(o => {
    const q = orderSearch.toLowerCase();
    return (o.buyerName.toLowerCase().includes(q) || o.buyerEmail.toLowerCase().includes(q))
      && (orderStatus === 'ALL' || o.status === orderStatus);
  }), [orders, orderSearch, orderStatus]);

  const sellerDetail = useMemo(() =>
    selectedSellerEmail ? sellerSummaries.find(s => s.email === selectedSellerEmail) ?? null : null,
    [selectedSellerEmail, sellerSummaries]
  );

  const buyerDetail = useMemo(() =>
    selectedBuyerEmail ? buyerSummaries.find(b => b.email === selectedBuyerEmail) ?? null : null,
    [selectedBuyerEmail, buyerSummaries]
  );

  const maxCategoryCount = Math.max(...categoryBreakdown.map(([, v]) => v), 1);
  const maxStatusCount = Math.max(...statusBreakdown.map(([, v]) => v), 1);

  const tabCls = (t: Tab) =>
    `rounded-full px-5 py-2.5 font-semibold transition text-sm ${tab === t
      ? 'bg-ssn-700 text-white shadow-md'
      : 'border border-slate-200 bg-white text-ssn-700 hover:bg-ssn-50'}`;

  if (loading) {
    return (
      <section className="py-16 text-center">
        <div className="mx-auto w-[min(1180px,calc(100%-28px))]">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-ssn-200 border-t-ssn-700" />
          <p className="mt-4 font-semibold text-slate-500">Loading admin dashboard…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="mx-auto w-[min(1180px,calc(100%-28px))]">

        {/* Toast */}
        {toast.msg && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-6 py-4 font-semibold text-white shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-all ${toast.type === 'error' ? 'bg-red-600' : 'bg-ssn-700'}`}>
            <span>{toast.type === 'error' ? '✕' : '✓'}</span>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🛡️</span>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-ssn-500">Admin panel</p>
          </div>
          <h2 className="text-5xl font-bold text-ssn-700 sm:text-4xl">Admin Dashboard</h2>
          <p className="mt-2 text-slate-500">Full visibility and control over all marketplace activity.</p>
          <button
            onClick={logoutAdmin}
            className="rounded-xl bg-red-500 px-4 py-2 text-white font-bold"
          >
            Logout Admin
          </button>
        </div>

        {/* Stats row */}
        <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total listings" value={listings.length} sub={`across ${categoryBreakdown.length} categories`} />
          <StatCard label="Total orders" value={orders.length} sub={`${orders.filter(o => o.status === 'Completed').length} completed`} />
          <StatCard label="Unique sellers" value={sellerSummaries.length} sub="active on platform" />
          <StatCard label="Platform revenue" value={`₹${totalRevenue.toLocaleString()}`} sub="excluding cancelled" accent />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button className={tabCls('overview')} onClick={() => setTab('overview')}>📊 Overview</button>
          <button className={tabCls('sellers')} onClick={() => setTab('sellers')}>
            🏪 Sellers ({sellerSummaries.length})
          </button>
          <button className={tabCls('buyers')} onClick={() => setTab('buyers')}>
            🛒 Buyers ({buyerSummaries.length})
          </button>
          <button className={tabCls('listings')} onClick={() => setTab('listings')}>
            📦 Listings ({listings.length})
          </button>
          <button className={tabCls('orders')} onClick={() => setTab('orders')}>
            📋 Orders ({orders.length})
          </button>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-soft">
              <h3 className="mb-5 text-lg font-bold text-ssn-700">Listings by category</h3>
              <div className="space-y-3">
                {categoryBreakdown.map(([cat, count]) => (
                  <MiniBar key={cat} label={cat} value={count} max={maxCategoryCount} color="bg-ssn-500" />
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {categoryBreakdown.map(([cat, count]) => (
                  <span key={cat} className={`rounded-full px-3 py-1 text-xs font-bold ${categoryColor[cat] || 'bg-slate-50 text-slate-700'}`}>
                    {cat}: {count}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-soft">
              <h3 className="mb-5 text-lg font-bold text-ssn-700">Orders by status</h3>
              <div className="space-y-3">
                {statusBreakdown.map(([status, count]) => (
                  <MiniBar key={status} label={status} value={count} max={maxStatusCount} color="bg-purple-400" />
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {statusBreakdown.map(([status, count]) => (
                  <span key={status} className={`rounded-full border px-3 py-1 text-xs font-bold ${statColor[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                    {status}: {count}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-soft">
              <h3 className="mb-5 text-lg font-bold text-ssn-700">Top sellers by listing count</h3>
              <div className="space-y-3">
                {sellerSummaries.slice(0, 5).map((s, i) => (
                  <div key={s.email} className="flex items-center gap-3">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-300 text-white' : i === 2 ? 'bg-amber-700 text-white' : 'bg-ssn-50 text-ssn-700'}`}>
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-800">{s.name}</p>
                      <p className="truncate text-xs text-slate-400">{s.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-ssn-700">{s.listings.length} listings</p>
                      <p className="text-xs text-slate-400">⭐ {s.avgRating.toFixed(1)} avg</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-5 w-full rounded-2xl border border-ssn-200 bg-ssn-50 py-2.5 text-sm font-semibold text-ssn-700 transition hover:bg-ssn-100" onClick={() => setTab('sellers')}>
                View all sellers →
              </button>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-soft">
              <h3 className="mb-5 text-lg font-bold text-ssn-700">Top buyers by spending</h3>
              {buyerSummaries.length === 0 ? (
                <p className="text-slate-400 text-sm">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {buyerSummaries.slice(0, 5).map((b, i) => (
                    <div key={b.email} className="flex items-center gap-3">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-300 text-white' : i === 2 ? 'bg-amber-700 text-white' : 'bg-ssn-50 text-ssn-700'}`}>
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-800">{b.name}</p>
                        <p className="truncate text-xs text-slate-400">{b.email}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-ssn-700">₹{b.totalSpent.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">{b.orderCount} order{b.orderCount !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className="mt-5 w-full rounded-2xl border border-ssn-200 bg-ssn-50 py-2.5 text-sm font-semibold text-ssn-700 transition hover:bg-ssn-100" onClick={() => setTab('buyers')}>
                View all buyers →
              </button>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-soft lg:col-span-2">
              <h3 className="mb-5 text-lg font-bold text-ssn-700">Recent orders</h3>
              {orders.length === 0 ? (
                <p className="text-slate-400 text-sm">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left">
                        <th className="pb-3 pr-4 text-xs font-extrabold uppercase tracking-wider text-ssn-500">Buyer</th>
                        <th className="pb-3 pr-4 text-xs font-extrabold uppercase tracking-wider text-ssn-500">Items</th>
                        <th className="pb-3 pr-4 text-xs font-extrabold uppercase tracking-wider text-ssn-500">Amount</th>
                        <th className="pb-3 text-xs font-extrabold uppercase tracking-wider text-ssn-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 6).map(o => (
                        <tr key={o.id} className="border-b border-slate-50 hover:bg-ssn-50/40 transition">
                          <td className="py-3 pr-4">
                            <p className="font-semibold text-slate-900">{o.buyerName}</p>
                            <p className="text-xs text-slate-400">{o.buyerEmail}</p>
                          </td>
                          <td className="py-3 pr-4 text-slate-500">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                          <td className="py-3 pr-4 font-bold text-ssn-700">₹{o.totalAmount.toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${statColor[o.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SELLERS TAB ── */}
        {tab === 'sellers' && (
          <>
            {/* Name selector */}
            <div className="mb-6 rounded-[26px] border-2 border-ssn-100 bg-gradient-to-br from-ssn-50 to-white p-6 shadow-soft">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ssn-700 text-lg text-white">🏪</span>
                <div>
                  <h3 className="text-lg font-bold text-ssn-700">View Seller's Listings &amp; Purchases</h3>
                  <p className="text-sm text-slate-500">Select a seller by name to see all their listings and activity</p>
                </div>
              </div>
              <div className="max-w-md">
                <NameSelector
                  label="Select seller"
                  placeholder="Choose a seller to view their profile..."
                  names={sellerSummaries.map(s => ({ value: s.email, label: s.name, sub: `${s.email} · ${s.listings.length} listing${s.listings.length !== 1 ? 's' : ''}` }))}
                  selected={selectedSellerEmail}
                  onSelect={setSelectedSellerEmail}
                  accentColor="blue"
                />
              </div>
            </div>

            {/* Seller detail panel */}
            {sellerDetail ? (
              <div className="mb-8 rounded-[26px] border-2 border-ssn-200 bg-white p-6 shadow-[0_4px_24px_rgba(11,78,173,0.10)]">
                {/* Profile header */}
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ssn-700 text-2xl font-black text-white">
                      {sellerDetail.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-ssn-700">{sellerDetail.name}</h3>
                      <p className="text-sm text-slate-500">{sellerDetail.email}</p>
                      <span className="mt-1 inline-block rounded-full bg-ssn-100 px-3 py-0.5 text-xs font-bold text-ssn-700">{sellerDetail.badge}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedSellerEmail('')} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                    ✕ Close
                  </button>
                </div>

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-ssn-100 bg-ssn-50 p-4 text-center">
                    <p className="text-xs font-bold text-ssn-500 uppercase tracking-wider">Total Listings</p>
                    <p className="mt-1 text-3xl font-bold text-ssn-700">{sellerDetail.listings.length}</p>
                  </div>
                  <div className="rounded-2xl border border-ssn-100 bg-ssn-50 p-4 text-center">
                    <p className="text-xs font-bold text-ssn-500 uppercase tracking-wider">Avg Rating</p>
                    <p className="mt-1 text-3xl font-bold text-ssn-700">⭐ {sellerDetail.avgRating.toFixed(2)}</p>
                  </div>
                  <div className="rounded-2xl border border-ssn-100 bg-ssn-50 p-4 text-center">
                    <p className="text-xs font-bold text-ssn-500 uppercase tracking-wider">Categories</p>
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {sellerDetail.categories.map(c => (
                        <span key={c} className={`rounded-full px-2 py-0.5 text-xs font-bold ${categoryColor[c] || 'bg-slate-50 text-slate-700'}`}>{c}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Listings */}
                <div>
                  <h4 className="mb-4 text-base font-bold text-ssn-700">All Listings by {sellerDetail.name}</h4>
                  {sellerDetail.listings.length === 0 ? (
                    <p className="text-slate-400 text-sm">No listings yet.</p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {sellerDetail.listings.map(l => (
                        <div key={l.id} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-soft hover:shadow-md transition">
                          <div className="relative h-36 overflow-hidden bg-slate-100">
                            <img src={l.imageUrl} alt={l.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                            <div className="absolute top-2 right-2 flex flex-col gap-1">
                              {l.dailySpecial && <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">Special</span>}
                              {l.featured && <span className="rounded-full bg-purple-500 px-2 py-0.5 text-xs font-bold text-white">Featured</span>}
                            </div>
                          </div>
                          <div className="p-3">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${categoryColor[l.category] || 'bg-slate-50 text-slate-700'}`}>{l.category}</span>
                            <p className="mt-1.5 font-bold text-slate-900 leading-tight">{l.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">{l.description}</p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-lg font-bold text-ssn-700">₹{l.price}</span>
                              <span className="text-xs text-slate-400">⭐ {l.rating.toFixed(1)}</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-400">{l.pickupLocation} · {l.pickupSlot}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-8 rounded-[26px] border border-dashed border-ssn-200 bg-ssn-50/40 py-14 text-center">
                <span className="text-5xl">🏪</span>
                <p className="mt-3 font-bold text-ssn-700 text-lg">Select a seller above</p>
                <p className="text-slate-400 text-sm mt-1">Choose a name from the dropdown to view their listings</p>
              </div>
            )}

            {/* All sellers grid */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-ssn-700">All Sellers — Quick View</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sellerSummaries.map((s, i) => (
                  <button
                    key={s.email}
                    onClick={() => setSelectedSellerEmail(selectedSellerEmail === s.email ? '' : s.email)}
                    className={`rounded-[22px] border p-5 text-left shadow-soft transition hover:shadow-md ${selectedSellerEmail === s.email ? 'border-ssn-400 bg-ssn-50' : 'border-slate-200 bg-white hover:border-ssn-200'}`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ssn-700 text-sm font-black text-white">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="rounded-full bg-ssn-50 px-3 py-0.5 text-xs font-bold text-ssn-700 border border-ssn-100">
                        #{i + 1} · {s.listings.length} listing{s.listings.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-400 truncate">{s.email}</p>
                    <p className="mt-1 text-xs font-semibold text-ssn-500">{s.badge}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.categories.map(c => (
                        <span key={c} className={`rounded-full px-2 py-0.5 text-xs font-bold ${categoryColor[c] || 'bg-slate-50 text-slate-600'}`}>{c}</span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-500">⭐ {s.avgRating.toFixed(1)} avg</span>
                      <span className="font-semibold text-ssn-600">{selectedSellerEmail === s.email ? '▲ collapse' : '▼ view'}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── BUYERS TAB ── */}
        {tab === 'buyers' && (
          <>
            {/* Name selector */}
            <div className="mb-6 rounded-[26px] border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 shadow-soft">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-700 text-lg text-white">🛒</span>
                <div>
                  <h3 className="text-lg font-bold text-purple-700">View Buyer's Purchase History</h3>
                  <p className="text-sm text-slate-500">Select a buyer by name to see all their orders and spending</p>
                </div>
              </div>
              <div className="max-w-md">
                <NameSelector
                  label="Select buyer"
                  placeholder="Choose a buyer to view their history..."
                  names={buyerSummaries.map(b => ({ value: b.email, label: b.name, sub: `${b.email} · ${b.orderCount} order${b.orderCount !== 1 ? 's' : ''} · ₹${b.totalSpent.toLocaleString()} spent` }))}
                  selected={selectedBuyerEmail}
                  onSelect={setSelectedBuyerEmail}
                  accentColor="purple"
                />
              </div>
            </div>

            {/* Buyer detail panel */}
            {buyerDetail ? (
              <div className="mb-8 rounded-[26px] border-2 border-purple-200 bg-white p-6 shadow-[0_4px_24px_rgba(88,28,220,0.08)]">
                {/* Profile header */}
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-700 text-2xl font-black text-white">
                      {buyerDetail.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-purple-700">{buyerDetail.name}</h3>
                      <p className="text-sm text-slate-500">{buyerDetail.email}</p>
                      <span className="mt-1 inline-block rounded-full bg-purple-100 px-3 py-0.5 text-xs font-bold text-purple-700">Buyer</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedBuyerEmail('')} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                    ✕ Close
                  </button>
                </div>

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 text-center">
                    <p className="text-xs font-bold text-purple-500 uppercase tracking-wider">Total Orders</p>
                    <p className="mt-1 text-3xl font-bold text-purple-700">{buyerDetail.orderCount}</p>
                  </div>
                  <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 text-center">
                    <p className="text-xs font-bold text-purple-500 uppercase tracking-wider">Total Spent</p>
                    <p className="mt-1 text-3xl font-bold text-purple-700">₹{buyerDetail.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 text-center">
                    <p className="text-xs font-bold text-purple-500 uppercase tracking-wider">Completed</p>
                    <p className="mt-1 text-3xl font-bold text-purple-700">{buyerDetail.orders.filter(o => o.status === 'Completed').length}</p>
                  </div>
                </div>

                {/* Full order history */}
                <div>
                  <h4 className="mb-4 text-base font-bold text-purple-700">Complete Purchase History — {buyerDetail.name}</h4>
                  {buyerDetail.orders.length === 0 ? (
                    <p className="text-slate-400 text-sm">No orders yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {buyerDetail.orders.map((o, idx) => (
                        <div key={o.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order #{idx + 1}</p>
                              <p className="font-semibold text-slate-800 mt-0.5">{o.pickupPoint} · {o.pickupSlot}</p>
                              {o.note && <p className="text-xs text-slate-400 mt-0.5">Note: {o.note}</p>}
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-ssn-700">₹{o.totalAmount.toLocaleString()}</p>
                              <span className={`mt-1 inline-block rounded-full border px-3 py-0.5 text-xs font-bold ${statColor[o.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>{o.status}</span>
                            </div>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 border-t border-slate-200 pt-3">
                            {o.items.map((item, iidx) => (
                              <div key={`${o.id}-${iidx}`} className="flex gap-3 rounded-xl border border-slate-100 bg-white p-3">
                                <img src={item.imageUrl} alt={item.title} className="h-12 w-12 flex-shrink-0 rounded-lg object-cover" />
                                <div className="min-w-0">
                                  <p className="font-semibold text-slate-900 text-sm leading-tight truncate">{item.title}</p>
                                  <p className="text-xs text-slate-500 truncate">by {item.sellerName}</p>
                                  <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                                  <p className="mt-0.5 font-bold text-ssn-700 text-sm">₹{item.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-8 rounded-[26px] border border-dashed border-purple-200 bg-purple-50/40 py-14 text-center">
                <span className="text-5xl">🛒</span>
                <p className="mt-3 font-bold text-purple-700 text-lg">Select a buyer above</p>
                <p className="text-slate-400 text-sm mt-1">Choose a name from the dropdown to view their purchase history</p>
              </div>
            )}

            {/* All buyers grid */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-ssn-700">All Buyers — Quick View</h3>
              {buyerSummaries.length === 0 ? (
                <div className="rounded-[26px] border border-slate-200 bg-white p-10 text-center shadow-soft">
                  <p className="text-slate-400">No buyers yet — orders will appear here.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {buyerSummaries.map((b, i) => (
                    <button
                      key={b.email}
                      onClick={() => setSelectedBuyerEmail(selectedBuyerEmail === b.email ? '' : b.email)}
                      className={`rounded-[22px] border p-5 text-left shadow-soft transition hover:shadow-md ${selectedBuyerEmail === b.email ? 'border-purple-400 bg-purple-50' : 'border-slate-200 bg-white hover:border-purple-200'}`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-700 text-sm font-black text-white">
                          {b.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="rounded-full bg-purple-50 px-3 py-0.5 text-xs font-bold text-purple-700 border border-purple-100">
                          #{i + 1} · {b.orderCount} order{b.orderCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="font-bold text-slate-900">{b.name}</p>
                      <p className="text-xs text-slate-400 truncate">{b.email}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-bold text-purple-700">₹{b.totalSpent.toLocaleString()} spent</span>
                        <span className="text-xs font-semibold text-purple-500">{selectedBuyerEmail === b.email ? '▲ collapse' : '▼ view'}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── LISTINGS TAB ── */}
        {tab === 'listings' && (
          <>
            <div className="mb-5 grid gap-4 rounded-[26px] border border-slate-200 bg-white p-4 shadow-soft sm:grid-cols-[1fr_auto]">
              <input
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                placeholder="Search by title, seller name or email..."
                value={listingSearch}
                onChange={e => setListingSearch(e.target.value)}
              />
              <select
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                value={listingCategory}
                onChange={e => setListingCategory(e.target.value)}
              >
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-ssn-50">
                      <th className="px-4 py-4 text-left font-extrabold uppercase tracking-wider text-ssn-700 text-xs">Item</th>
                      <th className="px-4 py-4 text-left font-extrabold uppercase tracking-wider text-ssn-700 text-xs">Category</th>
                      <th className="px-4 py-4 text-left font-extrabold uppercase tracking-wider text-ssn-700 text-xs">Seller</th>
                      <th className="px-4 py-4 text-left font-extrabold uppercase tracking-wider text-ssn-700 text-xs">Price</th>
                      <th className="px-4 py-4 text-left font-extrabold uppercase tracking-wider text-ssn-700 text-xs">Pickup</th>
                      <th className="px-4 py-4 text-left font-extrabold uppercase tracking-wider text-ssn-700 text-xs">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredListings.map((listing, i) => (
                      <tr key={listing.id} className={`border-b border-slate-50 ${i % 2 === 0 ? '' : 'bg-slate-50/50'} hover:bg-ssn-50/40 transition`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={listing.imageUrl} alt={listing.title} className="h-10 w-10 rounded-xl object-cover flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-slate-900 leading-tight">{listing.title}</p>
                              <p className="text-xs text-slate-400">⭐ {listing.rating.toFixed(1)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${categoryColor[listing.category] || 'bg-ssn-50 text-ssn-700'}`}>{listing.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800">{listing.sellerName}</p>
                          <p className="text-xs text-slate-400">{listing.sellerEmail}</p>
                        </td>
                        <td className="px-4 py-3 font-bold text-ssn-700">₹{listing.price}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          <p>{listing.pickupLocation}</p>
                          <p>{listing.pickupSlot}</p>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => deleteListing(listing.id)}
                            disabled={loadingDelete === listing.id}
                            className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {loadingDelete === listing.id ? 'Removing...' : 'Remove'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredListings.length === 0 && (
                  <div className="py-12 text-center text-slate-400">No listings match your search.</div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <>
            <div className="mb-5 grid gap-4 rounded-[26px] border border-slate-200 bg-white p-4 shadow-soft sm:grid-cols-[1fr_auto]">
              <input
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                placeholder="Search by buyer name or email..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
              />
              <select
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                value={orderStatus}
                onChange={e => setOrderStatus(e.target.value)}
              >
                <option value="ALL">All statuses</option>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid gap-4">
              {filteredOrders.map(order => (
                <article key={order.id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-ssn-500">Order</p>
                      <h3 className="mt-1 text-xl font-bold text-slate-900">{order.buyerName}</h3>
                      <p className="text-sm text-slate-500">{order.buyerEmail}</p>
                      <p className="mt-1 text-sm text-slate-500">{order.pickupPoint} · {order.pickupSlot}</p>
                      {order.note && <p className="mt-1 text-sm text-slate-400">Note: {order.note}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <p className="text-2xl font-bold text-ssn-700">₹{order.totalAmount.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statColor[order.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                          {order.status}
                        </span>
                        <select
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ssn-700 outline-none hover:bg-ssn-50 transition disabled:opacity-50"
                          value={order.status}
                          disabled={loadingStatus === order.id}
                          onChange={e => updateStatus(order.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                    {order.items.map((item, idx) => (
                      <div key={`${order.id}-${idx}`} className="flex gap-3 rounded-2xl border border-slate-100 p-3">
                        <img src={item.imageUrl} alt={item.title} className="h-14 w-14 flex-shrink-0 rounded-xl object-cover" />
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.sellerName}</p>
                          <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                          <p className="mt-0.5 font-bold text-ssn-700 text-sm">₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
              {filteredOrders.length === 0 && (
                <div className="rounded-[26px] border border-slate-200 bg-white p-10 text-center shadow-soft">
                  <p className="font-bold text-slate-900">No orders match your search.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
