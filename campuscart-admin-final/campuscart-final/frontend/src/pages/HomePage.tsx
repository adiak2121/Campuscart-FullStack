import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import ListingCard from '../components/ListingCard';
import type { Listing } from '../types';

type ShowcaseCard = {
  title: string;
  subtitle: string;
  imageUrl: string;
  anchor: string;
};

function CategorySection({
  id,
  kicker,
  title,
  items
}: {
  id: string;
  kicker: string;
  title: string;
  items: Listing[];
}) {
  return (
    <section className="py-8">
      <div className="mx-auto w-[min(1180px,calc(100%-28px))]">
        <div className="mb-6">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-ssn-500">{kicker}</p>
          <h2 className="text-5xl font-bold text-ssn-700 sm:text-4xl" id={id}>{title}</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {items.map(item => <ListingCard key={item.id} listing={item} />)}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);

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

  const byCategory = useMemo(() => {
    const pick = (category: string) => listings.filter(item => item.category === category).slice(0, 3);
    return {
      Food: pick('Food'),
      Stationery: pick('Stationery'),
      Textbooks: pick('Textbooks'),
      Clothing: pick('Clothing'),
      Accessories: pick('Accessories')
    };
  }, [listings]);

  const showcaseCards: ShowcaseCard[] = [
    {
      title: 'Food',
      subtitle: 'Lunch boxes, snacks, and student specials',
      imageUrl: byCategory.Food[0]?.imageUrl || '',
      anchor: 'food-section'
    },
    {
      title: 'Stationery',
      subtitle: 'Useful items for daily class life',
      imageUrl: byCategory.Stationery[0]?.imageUrl || '',
      anchor: 'stationery-section'
    },
    {
      title: 'Textbooks',
      subtitle: 'Affordable second-hand academic books',
      imageUrl: byCategory.Textbooks[0]?.imageUrl || '',
      anchor: 'textbook-section'
    },
    {
      title: 'Clothing',
      subtitle: 'Campus fits and thrift-style student wear',
      imageUrl: byCategory.Clothing[0]?.imageUrl || '',
      anchor: 'clothing-section'
    },
    {
      title: 'Accessories',
      subtitle: 'Small handmade and everyday add-ons',
      imageUrl: byCategory.Accessories[0]?.imageUrl || '',
      anchor: 'accessories-section'
    }
  ];

  return (
    <>
      <section className="py-11">
        <div className="mx-auto grid w-[min(1180px,calc(100%-28px))] gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-ssn-500">
              SSN-inspired student marketplace
            </p>
            <h1 className="text-[82px] font-bold leading-[0.98] text-ssn-700 lg:text-[72px] md:text-[58px] sm:text-[42px]">
              Campus buying and selling made cleaner, smarter, and more student-friendly.
            </h1>
            <p className="mt-5 max-w-3xl text-[20px] leading-10 text-slate-500 sm:text-lg sm:leading-8">
              Discover homemade food, stationery, textbooks, clothing, and accessories in one polished
              campus marketplace built around trust, pickup simplicity, and a strong UI.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link className="rounded-2xl bg-gradient-to-r from-ssn-600 to-ssn-500 px-6 py-4 font-bold text-white shadow-soft" to="/marketplace">
                Explore marketplace
              </Link>
              <Link className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-bold text-ssn-700" to="/sell">
                Create a listing
              </Link>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-soft">
                <strong className="mb-2 block text-3xl font-bold text-ssn-700 sm:text-xl">Campus-only login</strong>
                <span className="text-[20px] leading-8 text-slate-500 sm:text-base">Only @ssn.edu.in students can access the platform</span>
              </div>
              <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-soft">
                <strong className="mb-2 block text-3xl font-bold text-ssn-700 sm:text-xl">Pickup slots</strong>
                <span className="text-[20px] leading-8 text-slate-500 sm:text-base">Simple collection at fixed campus points</span>
              </div>
              <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-soft">
                <strong className="mb-2 block text-3xl font-bold text-ssn-700 sm:text-xl">Seller badges</strong>
                <span className="text-[20px] leading-8 text-slate-500 sm:text-base">Quick trust cues for buyers</span>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {showcaseCards.map((card, index) => (
              <a
                key={card.title}
                href={`#${card.anchor}`}
                className={`overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft ${
                  index === 4 ? 'md:col-span-2' : ''
                }`}
              >
                <div
                  className="h-40 bg-cover bg-center md:h-32"
                  style={{ backgroundImage: `url(${card.imageUrl})` }}
                />
                <div className="p-5">
                  <strong className="block text-3xl font-bold text-ssn-700 sm:text-xl">{card.title}</strong>
                  <span className="mt-2 block text-[20px] leading-8 text-slate-500 sm:text-base">{card.subtitle}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CategorySection id="food-section" kicker="Fresh and student-made" title="Food" items={byCategory.Food} />
      <CategorySection id="stationery-section" kicker="Useful everyday study items" title="Stationery" items={byCategory.Stationery} />
      <CategorySection id="textbook-section" kicker="Affordable academic essentials" title="Textbooks" items={byCategory.Textbooks} />
      <CategorySection id="clothing-section" kicker="Campus fashion and thrift finds" title="Clothing" items={byCategory.Clothing} />
      <CategorySection id="accessories-section" kicker="Small add-ons and handmade picks" title="Accessories" items={byCategory.Accessories} />
    </>
  );
}
