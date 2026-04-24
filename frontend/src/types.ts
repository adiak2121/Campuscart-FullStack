export type UserProfile = {
  name: string;
  email: string;
  role: string;
};

export type Listing = {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  sellerName: string;
  sellerEmail: string;
  sellerBadge: string;
  rating: number;
  pickupLocation: string;
  pickupSlot: string;
  dailySpecial: boolean;
  featured: boolean;
  createdAt?: string;
};

export type CartItem = Listing & {
  quantity: number;
};

export type OrderItem = {
  listingId: string;
  title: string;
  quantity: number;
  price: number;
  sellerName: string;
  imageUrl: string;
};

export type Order = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  pickupPoint: string;
  pickupSlot: string;
  note: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
};
