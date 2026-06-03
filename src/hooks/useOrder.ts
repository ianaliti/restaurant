'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Order } from '@/types/restaurants.type';
import {
  cancelOrderService,
  getMyOrdersService,
  getOrderByIdService,
  getRestaurantOrdersService,
  updateOrderStatusService,
} from '@/services/order.service';

/** Customer: fetch their own orders */
export function useMyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setIsLoading(true);
    getMyOrdersService()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(refresh, [refresh]);

  const cancel = useCallback(async (id: string) => {
    await cancelOrderService(id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }, []);

  return { orders, isLoading, error, refresh, cancel };
}

/** Fetch a single order */
export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getOrderByIdService(id)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { order, isLoading, error };
}

/** Restaurateur: manage incoming orders */
export function useRestaurantOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setIsLoading(true);
    getRestaurantOrdersService()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(refresh, [refresh]);

  const updateStatus = useCallback(async (id: string, status: string) => {
    const updated = await updateOrderStatusService(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  }, []);

  return { orders, setOrders, isLoading, error, refresh, updateStatus };
}
