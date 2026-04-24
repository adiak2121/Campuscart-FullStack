import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { Listing } from '../types';

function isNew(createdAt?: string): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 3;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);

  const toggleWishlist = async () => {
  if (!user?.email) return;

  const url = wishlisted
    ? 'http://localhost:8080/api/wishlist/remove'
    : 'http://localhost:8080/api/wishlist/add';

  const method = wishlisted ? 'DELETE' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userEmail: user.email,   // ✅ FIXED
      listingId: listing.id,
    }),
  });

  setWishlisted(prev => !prev);
};
  

  return (
    <article className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-soft">
      <div className="relative h-60 bg-slate-100">
        <img src={listing.imageUrl} alt={listing.title} className="h-full w-full object-cover" />
        {listing.dailySpecial && (
          <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-ssn-600 to-ssn-500 px-3 py-2 text-xs font-bold text-white">
            Today's Special
          </span>
        )}
        {/* NEW badge — shown if listing was added within 3 days */}
        {isNew(listing.createdAt) && (
          <span className="absolute left-4 bottom-4 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
            NEW
          </span>
        )}
        <span className="absolute right-4 top-4 rounded-full bg-slate-700 px-3 py-2 text-xs font-bold text-white">
          {listing.sellerBadge}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-ssn-700">
            {listing.category}
          </span>
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-ssn-700">
            ⭐ {listing.rating.toFixed(1)}
          </span>
        </div>

        <h3 className="mt-3 text-[30px] font-bold leading-tight text-slate-900 sm:text-2xl">
          {listing.title}
        </h3>
        <p className="mt-3 min-h-[84px] text-lg leading-8 text-slate-500 sm:text-base sm:leading-7">
          {listing.description}
        </p>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            {/* Clickable seller name navigates to seller profile */}
            <button
              className="block text-xl font-bold text-ssn-700 hover:underline sm:text-lg text-left"
              onClick={() => navigate(`/seller/${encodeURIComponent(listing.sellerEmail)}`)}
            >
              {listing.sellerName}
            </button>
            <small className="text-base text-slate-500 sm:text-sm">
              {listing.pickupLocation} · {listing.pickupSlot}
            </small>
          </div>
          <span className="text-4xl font-extrabold text-ssn-700 sm:text-3xl">₹{listing.price}</span>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            className="rounded-2xl bg-gradient-to-r from-ssn-600 to-ssn-500 px-5 py-3 font-bold text-white shadow-soft transition hover:translate-y-[-1px]"
            onClick={() => addToCart(listing)}
          >
            Add to cart
          </button>
          <button
            className={`rounded-2xl border px-4 py-3 text-xl transition hover:translate-y-[-1px] ${wishlisted ? 'border-red-300 bg-red-50 text-red-500' : 'border-slate-200 bg-white text-slate-400'}`}
            onClick={toggleWishlist}
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wishlisted ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </article>
  );
}
