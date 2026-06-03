'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { CartItem, Order, Plat } from '@/types/restaurants.type';
import { createOrderService } from '@/services/order.service';

const CART_KEY = 'cart-storage';

interface CartContextValue {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  addItem: (item: Plat & { restaurantId: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (userId: string) => Promise<Order>;
}

const CartContext = createContext<CartContextValue | null>(null);

function readCartFromStorage(userId: string | null): CartItem[] {
  if (typeof window === 'undefined' || !userId) return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, CartItem[]>;
    return parsed[userId] ?? [];
  } catch {
    return [];
  }
}

function writeCartToStorage(userId: string | null, items: CartItem[]): void {
  if (typeof window === 'undefined' || !userId) return;
  try {
    const raw = localStorage.getItem(CART_KEY);
    const all: Record<string, CartItem[]> = raw ? JSON.parse(raw) : {};
    all[userId] = items;
    localStorage.setItem(CART_KEY, JSON.stringify(all));
  } catch {
    // storage write failed — non-fatal
  }
}

export function CartProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | null;
}) {
  // Start empty — populated from localStorage in useEffect to avoid hydration mismatch
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCartFromStorage(userId));
  }, [userId]);

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (userId !== undefined) {
      writeCartToStorage(userId, items);
    }
  }, [items, userId]);

  const addItem = useCallback((item: Plat & { restaurantId: string }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const createOrder = useCallback(
    async (userId: string): Promise<Order> => {
      console.log('[CartProvider] createOrder - userId:', userId, 'items:', items);
      const order = await createOrderService(items);
      console.log('[CartProvider] createOrder - success:', order);
      clearCart();
      return { ...order, userId };
    },
    [items, clearCart]
  );

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalPrice,
        totalItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
