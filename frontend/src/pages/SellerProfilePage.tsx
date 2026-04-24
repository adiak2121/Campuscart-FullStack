import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import type { Listing } from '../types';

type SellerInfo = {
  name: string;
  email: string;
  role: string;
};

export default function SellerProfilePage() {
  const { email } = useParams<{ email: string }>();
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) return;
    fetchSellerProfile();
  }, [email]);

  const fetchSellerProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/seller/${encodeURIComponent(email!)}`);
      if (!response.ok) {
        setError('Seller not found.');
        return;
      }
      const data = await response.json();
      setSeller(data.seller);
      setListings(data.listings);
    } catch (err) {
      setError('Failed to load seller profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-slate-500 text-lg">Loading seller profile...</p>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-red-500 text-lg">{error || 'Seller not found.'}</p>
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="mx-auto w-[min(1180px,calc(100%-28px))]">

        {/* Seller Info Card */}
        <div className="mb-8 rounded-[26px] border border-slate-200 bg-white p-8 shadow-soft">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-ssn-500">Seller Profile</p>
          <h2 className="text-4xl font-bold text-slate-900">{seller.name}</h2>
          <p className="mt-2 text-lg text-slate-500">{seller.email}</p>
          <span className="mt-3 inline-block rounded-full bg-ssn-100 px-4 py-1 text-sm font-semibold text-ssn-700">
            {seller.role}
          </span>
          <p className="mt-4 text-slate-600 font-medium">
            {listings.length} listing{listings.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Seller Listings */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-800">Listings by {seller.name}</h3>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-[26px] border border-slate-200 bg-white p-10 text-center shadow-soft">
            <h3 className="text-2xl font-bold text-slate-900">No listings yet</h3>
            <p className="mt-2 text-slate-500">This seller hasn't posted any listings.</p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {listings.map(item => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
