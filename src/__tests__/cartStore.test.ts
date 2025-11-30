import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/app/store/cartStore';
import type { Plat } from '@/types/restaurants.type';

beforeEach(() => {
  try {
    localStorage.clear();
  } catch (e) {
    console.error(e);
  }

  useCartStore.setState({
    userCarts: {},
    currentUserId: null,
  });
});

const mockPlat: Plat & { restaurantId: number } = {
  id: 1,
  name: 'Pizza Margherita',
  price: 12.99,
  image: '/pizza.jpg',
  restaurantId: 100,
};

const mockPlat2: Plat & { restaurantId: number } = {
  id: 2,
  name: 'Burger',
  price: 9.99,
  image: '/burger.jpg',
  restaurantId: 100,
};

describe('cartStore', () => {
  it('should add item to cart', () => {
    const userId = 'user1';
    useCartStore.getState().addItem(mockPlat, userId);
    
    const items = useCartStore.getState().getItemsByUserId(userId);
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(1);
  });

  it('should increase quantity when adding same item', () => {
    const userId = 'user1';
    useCartStore.getState().addItem(mockPlat, userId);
    useCartStore.getState().addItem(mockPlat, userId);
    
    const items = useCartStore.getState().getItemsByUserId(userId);
    expect(items[0].quantity).toBe(2);
  });

  it('should remove item from cart', () => {
    const userId = 'user1';
    useCartStore.getState().addItem(mockPlat, userId);
    useCartStore.getState().addItem(mockPlat2, userId);
    
    useCartStore.getState().removeItem(1, userId);
    
    const items = useCartStore.getState().getItemsByUserId(userId);
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(2);
  });

  it('should calculate total price correctly', () => {
    const userId = 'user1';
    useCartStore.getState().addItem(mockPlat, userId);
    useCartStore.getState().addItem(mockPlat, userId);
    useCartStore.getState().addItem(mockPlat2, userId);
    
    const total = useCartStore.getState().getTotalPrice(userId);
    expect(total).toBe(12.99 * 2 + 9.99);
  });

  it('should create order and clear cart', () => {
    const userId = 'user1';
    useCartStore.getState().addItem(mockPlat, userId);
    useCartStore.getState().addItem(mockPlat2, userId);
    
    const order = useCartStore.getState().createOrder(userId);
    
    expect(order.items).toHaveLength(2);
    expect(order.total).toBe(12.99 + 9.99);
    
    const items = useCartStore.getState().getItemsByUserId(userId);
    expect(items).toHaveLength(0);
  });
});
