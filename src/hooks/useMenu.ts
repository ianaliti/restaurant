'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Plat } from '@/types/restaurants.type';
import {
  createDishService,
  deleteDishService,
  getDishesByRestaurantService,
  updateDishService,
} from '@/services/dish.service';

/** Fetch dishes for a given restaurant (public) */
export function useMenu(restaurantId: string) {
  const [dishes, setDishes] = useState<Plat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) return;
    setIsLoading(true);
    getDishesByRestaurantService(restaurantId)
      .then(setDishes)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [restaurantId]);

  return { dishes, isLoading, error };
}

/** For restaurateurs: full CRUD on their own menu */
export function useMyMenu(restaurantId: string) {
  const [dishes, setDishes] = useState<Plat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) return;
    setIsLoading(true);
    getDishesByRestaurantService(restaurantId)
      .then(setDishes)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [restaurantId]);

  const addDish = useCallback(async (data: Omit<Plat, 'id'> & { category?: string; description?: string }) => {
    const created = await createDishService(data);
    setDishes((prev) => [...prev, created]);
    return created;
  }, []);

  const editDish = useCallback(async (id: string, data: Partial<Omit<Plat, 'id'>>) => {
    const updated = await updateDishService(id, data);
    setDishes((prev) => prev.map((d) => (d.id === id ? updated : d)));
    return updated;
  }, []);

  const removeDish = useCallback(async (id: string) => {
    await deleteDishService(id);
    setDishes((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return { dishes, isLoading, error, addDish, editDish, removeDish };
}
