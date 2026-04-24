import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { Listing } from '../types';

export default function WishlistPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allListings, setAllListings] = useState<Listing[]>([]);

  useEffect(() => {
  if (!user?.email) return;

  // get wishlist
  fetch(`http://localhost:8080/api/wishlist/${user.email}`)
    .then(res => res.json())
    .then(setItems);

  // get all listings
  fetch("http://localhost:8080/api/listings")
    .then(res => res.json())
    .then(setAllListings)
    .finally(() => setLoading(false));

}, [user]);

  const removeFromWishlist = async (listing: Listing) => {
  await fetch('http://localhost:8080/api/wishlist/remove', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userEmail: user?.email,
      listingId: listing.id,
    }),
  });

  setItems(prev => prev.filter((i: any) => i.listingId !== listing.id));
};

  if (loading) return <p className="p-8 text-center text-slate-500">Loading wishlist...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-800">My Wishlist ❤️</h1>

      {items.length === 0 ? (
        <p className="text-slate-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((w: any) => {
  const listing = allListings.find(l => l.id === w.listingId);
  if (!listing) return null;

  return (
    <article key={listing.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <img src={listing.imageUrl} alt={listing.title} className="h-48 w-full object-cover" />
      <div className="p-4">
        <p className="text-xs font-bold text-blue-600">{listing.category}</p>
        <h3 className="text-lg font-bold">{listing.title}</h3>
        <p className="text-sm text-slate-500">{listing.description}</p>
        <p className="text-xl font-bold text-blue-700">₹{listing.price}</p>

        <div className="mt-2 flex gap-2">
          <button
            className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
            onClick={() => addToCart(listing)}
          >
            Add to Cart
          </button>
          <button
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50"
            onClick={() => removeFromWishlist(listing)}
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
})}
        </div>
      )}
    </main>
  );
}
