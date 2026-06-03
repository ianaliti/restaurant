'use client';

import { RestaurantPlatsList } from './RestaurantPlatsList';
import { BackButton } from '@/components/ui/BackButton';
import type { RestaurantData, PlatData } from '@/types/restaurants.type';

interface RestaurantDetailProps {
  restaurant: RestaurantData | null;
  plats: PlatData[];
  lang: 'fr' | 'en';
  dict: Record<string, unknown>;
}

export function RestaurantDetail({ restaurant, plats, lang }: RestaurantDetailProps) {
  if (!restaurant) return null;

  return (
    <main id="main-content" className='max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6'>
      <BackButton lang={lang} />
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl sm:text-3xl font-bold'>{restaurant.name}</h1>
        <p className='text-muted-foreground'>
          {restaurant.address}, {restaurant.codePostal} {restaurant.city}
        </p>
        {restaurant.cuisine && (
          <p className='text-sm font-medium text-primary'>{restaurant.cuisine}</p>
        )}
        {restaurant.description && (
          <p className='text-sm text-muted-foreground max-w-3xl'>{restaurant.description}</p>
        )}
        <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
          {restaurant.phone && <span>{restaurant.phone}</span>}
          {restaurant.website && (
            <a
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              className='hover:text-primary underline'
            >
              {restaurant.website}
            </a>
          )}
        </div>
      </div>
      <RestaurantPlatsList plats={plats} lang={lang} />
    </main>
  );
}
