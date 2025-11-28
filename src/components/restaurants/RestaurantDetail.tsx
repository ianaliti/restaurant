'use client';

import { useEffect, useState } from 'react';
import { useRestaurantStore } from '@/app/store/restaurantStore';
import { RestaurantPlatsList } from './RestaurantPlatsList';
import { BackButton } from '@/components/ui/BackButton';
import { useParams } from 'next/navigation';
import type { RestaurantData } from '@/app/store/restaurantStore';
import type { PlatData } from '@/app/store/platStore';

interface RestaurantDetailProps {
  restaurant: RestaurantData | null;
  plats: PlatData[];
  lang: 'fr' | 'en';
  dict: any;
}

export function RestaurantDetail({ restaurant: serverRestaurant, plats, lang, dict }: RestaurantDetailProps) {
  const params = useParams();
  const getAllRestaurants = useRestaurantStore((state) => state.getAllRestaurants);
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(serverRestaurant);

  useEffect(() => {
    if (!serverRestaurant && params.id) {
      const userRestaurants = getAllRestaurants();
      const idNumber = Number(params.id);
      const found = userRestaurants.find((r) => r.id === idNumber);
      if (found) {
        setRestaurant(found);
      }
    }
  }, [serverRestaurant, params.id, getAllRestaurants]);

  if (!restaurant) {
    return null;
  }

  return (
    <main id="main-content" className='max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6'>
      <BackButton lang={lang} />
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl sm:text-3xl font-bold'>{restaurant.name}</h1>
        <p className='text-muted-foreground max-w-3xl' aria-label={`${dict.restaurants.address}: ${restaurant.address}, ${restaurant.codePostal} ${restaurant.city}`}>
          {restaurant.address}, {restaurant.codePostal} {restaurant.city}
        </p>
      </div>
      <RestaurantPlatsList plats={plats} restaurantUserId={restaurant.userId} lang={lang} />
    </main>
  );
}

