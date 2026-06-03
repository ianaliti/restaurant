import { apiFetch } from '@/lib/api/apiClient';
import type { Order, CartItem } from '@/types/restaurants.type';

interface BackendOrderItem {
  id: string;
  orderId: string;
  dishId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface BackendOrder {
  id: string;
  userId: string;
  restaurantId: string;
  status: string;
  totalPrice: number;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
  items: BackendOrderItem[];
}

interface CreateOrderPayload {
  restaurantId: string;
  deliveryAddress: string;
  items: { dishId: string; quantity: number }[];
}

function mapOrder(raw: BackendOrder, cartItems?: CartItem[]): Order {
  return {
    id: raw.id,
    userId: raw.userId,
    restaurantId: raw.restaurantId,
    date: raw.createdAt,
    total: raw.totalPrice,
    status: raw.status,
    deliveryAddress: raw.deliveryAddress,
    items: cartItems ?? raw.items.map((item) => ({
      id: item.dishId,
      name: '',
      price: item.unitPrice,
      image: null,
      description: null,
      category: '',
      isAvailable: true,
      quantity: item.quantity,
      restaurantId: raw.restaurantId,
    })),
  };
}

export async function createOrderService(
  cartItems: CartItem[],
  deliveryAddress = 'To be completed'
): Promise<Order> {
  if (!cartItems.length) throw new Error('Cart is empty');

  const restaurantId = cartItems[0].restaurantId;
  const payload: CreateOrderPayload = {
    restaurantId,
    deliveryAddress,
    items: cartItems
      .filter((i) => i.restaurantId === restaurantId)
      .map((i) => ({ dishId: i.id, quantity: i.quantity })),
  };

  const res = await apiFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create order');
  }

  const raw: BackendOrder = await res.json();
  return mapOrder(raw, cartItems);
}

export async function getMyOrdersService(): Promise<Order[]> {
  const res = await apiFetch('/api/users/me/orders');
  if (!res.ok) throw new Error('Failed to fetch orders');
  const raw: BackendOrder[] = await res.json();
  return raw.map((o) => mapOrder(o));
}

export async function getOrderByIdService(id: string): Promise<Order> {
  const res = await apiFetch(`/api/orders/${id}`);
  if (!res.ok) throw new Error('Order not found');
  const raw: BackendOrder = await res.json();
  return mapOrder(raw);
}

export async function cancelOrderService(id: string): Promise<void> {
  const res = await apiFetch(`/api/orders/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to cancel order');
  }
}

export async function getRestaurantOrdersService(): Promise<Order[]> {
  const res = await apiFetch('/api/restaurants/me/orders');
  if (!res.ok) throw new Error('Failed to fetch restaurant orders');
  const raw: BackendOrder[] = await res.json();
  return raw.map((o) => mapOrder(o));
}

export async function updateOrderStatusService(
  id: string,
  status: string
): Promise<Order> {
  const res = await apiFetch(`/api/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update order status');
  }
  const raw: BackendOrder = await res.json();
  return mapOrder(raw);
}
