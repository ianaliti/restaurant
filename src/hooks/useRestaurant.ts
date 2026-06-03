'use client';

import { useCallback, useEffect, useState } from 'react';
import type { RestaurantData } from '@/types/restaurants.type';
import {
  getRestaurantByIdService,
  getRestaurantsService,
  getMyRestaurantService,
  updateMyRestaurantService,
} from '@/services/restaurant.service';

/** Fetch all restaurants (public list) */
export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRestaurantsService()
      .then(setRestaurants)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { restaurants, isLoading, error };
}

/** Fetch a single restaurant by id */
export function useRestaurant(id: string) {
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getRestaurantByIdService(id)
      .then(setRestaurant)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { restaurant, isLoading, error };
}

/** For restaurateurs: fetch and manage their own restaurant */
export function useMyRestaurant() {
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyRestaurantService()
      .then(setRestaurant)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const update = useCallback(
    async (data: Partial<Pick<RestaurantData, 'name' | 'address' | 'codePostal' | 'city' | 'image' | 'email' | 'description' | 'phone' | 'website' | 'cuisine'>>) => {
      const updated = await updateMyRestaurantService(data);
      setRestaurant(updated);
      return updated;
    },
    []
  );

  return { restaurant, isLoading, error, update };
}
