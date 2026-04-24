import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import ListingCard from '../components/ListingCard';
import type { Listing } from '../types';

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [pickup, setPickup] = useState('ALL');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const response = await api.get<Listing[]>('/listings');
      setListings(response.data);
    } catch (error) {
      console.error('Failed to load listings', error);
    }
  };

  const categories = useMemo(() => ['ALL', ...new Set(listings.map(item => item.category))], [listings]);
  const pickupPoints = useMemo(() => ['ALL', ...new Set(listings.map(item => item.pickupLocation))], [listings]);

  const filtered = useMemo(() => {
    return listings.filter(item => {
      const matchQuery =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.sellerName.toLowerCase().includes(query.toLowerCase());
      const matchCategory = category === 'ALL' || item.category === category;
      const matchPickup = pickup === 'ALL' || item.pickupLocation === pickup;
      const matchMin = minPrice === '' || item.price >= Number(minPrice);
      const matchMax = maxPrice === '' || item.price <= Number(maxPrice);
      return matchQuery && matchCategory && matchPickup && matchMin && matchMax;
    });
  }, [listings, query, category, pickup, minPrice, maxPrice]);

  return (
    <section className="py-8">
      <div className="mx-auto w-[min(1180px,calc(100%-28px))]">
        <div className="mb-6">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-ssn-500">Campus marketplace</p>
          <h2 className="text-5xl font-bold text-ssn-700 sm:text-4xl">Browse all student listings</h2>
        </div>

        <div className="mb-6 grid gap-4 rounded-[26px] border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <input
            className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
            placeholder="Search by title, seller, or keyword..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <select className="rounded-2xl border border-slate-200 px-4 py-4 outline-none" value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(item => <option key={item}>{item}</option>)}
          </select>
          <select className="rounded-2xl border border-slate-200 px-4 py-4 outline-none" value={pickup} onChange={e => setPickup(e.target.value)}>
            {pickupPoints.map(item => <option key={item}>{item}</option>)}
          </select>
        </div>

        {/* Price Filter Row */}
        <div className="mb-6 flex gap-4 rounded-[26px] border border-slate-200 bg-white p-4 shadow-soft">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-600">Min ₹</label>
            <input
              type="number"
              className="w-32 rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              placeholder="0"
              value={minPrice}
              min={0}
              onChange={e => setMinPrice(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-600">Max ₹</label>
            <input
              type="number"
              className="w-32 rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              placeholder="Any"
              value={maxPrice}
              min={0}
              onChange={e => setMaxPrice(e.target.value)}
            />
          </div>
          {(minPrice || maxPrice) && (
            <button
              className="ml-auto rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"
              onClick={() => { setMinPrice(''); setMaxPrice(''); }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {filtered.map(item => <ListingCard key={item.id} listing={item} />)}
        </div>

        {filtered.length === 0 && (
          <div className="mt-6 rounded-[26px] border border-slate-200 bg-white p-10 text-center shadow-soft">
            <h3 className="text-3xl font-bold text-slate-900">No listings found</h3>
            <p className="mt-2 text-slate-500">Try another search term, category, or pickup point.</p>
          </div>
        )}
      </div>
    </section>
  );
}
