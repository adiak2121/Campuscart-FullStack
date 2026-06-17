import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Listing } from '../types';

type Totals = {
  itemCount: number;
  subtotal: number;
  platformFee: number;
  total: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (listing: Listing) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totals: Totals;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (listing: Listing) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === listing.id);
      if (existing) {
        return prev.map(item => item.id === listing.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...listing, quantity: 1 }];
    });
  };

  const increaseQty = (id: string) => setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  const decreaseQty = (id: string) => setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0));
  const removeItem = (id: string) => setCartItems(prev => prev.filter(item => item.id !== id));
  const clearCart = () => setCartItems([]);

  const totals = useMemo<Totals>(() => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const platformFee = subtotal > 0 ? 20 : 0;
    return { itemCount, subtotal, platformFee, total: subtotal + platformFee };
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, increaseQty, decreaseQty, removeItem, clearCart, totals }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used within CartProvider');
  return value;
}
