'use client';

import { useState, useMemo } from 'react';
import CardComponent from '@/components/card/CardComponent';
import Link from 'next/link';
import { SearchInput } from '@/components/ui/SearchInput';
import { useDictionary } from '@/components/i18n/DictionaryProvider';
import { useRestaurantStore } from '@/app/store/restaurantStore';
import type { RestaurantData } from '@/app/store/restaurantStore';

interface RestaurantsListProps {
  restaurants: RestaurantData[];
  lang: 'fr' | 'en';
}

export function RestaurantsList({ restaurants, lang }: RestaurantsListProps) {
  const dict = useDictionary();
  const [searchQuery, setSearchQuery] = useState('');
  const getAllRestaurants = useRestaurantStore((state) => state.getAllRestaurants);
  
  const userRestaurants = useMemo(() => {
    return getAllRestaurants();
  }, [getAllRestaurants]);

  const displayRestaurants = useMemo(() => {
    const allRestaurants = [...restaurants, ...userRestaurants];
    const uniqueRestaurants = allRestaurants.filter((resto, index, self) =>
      index === self.findIndex((r) => r.id === resto.id)
    );

    const restaurantsForDisplay = uniqueRestaurants.map((resto) => ({
      id: resto.id,
      userId: resto.userId,
      name: resto.name,
      address: `${resto.address}, ${resto.codePostal} ${resto.city}`,
      image: resto.image || '/default-restaurant.jpg',
    }));

    if (!searchQuery.trim()) {
      return restaurantsForDisplay;
    }

    const query = searchQuery.toLowerCase().trim();
    return restaurantsForDisplay.filter((resto) =>
      resto.name.toLowerCase().includes(query) ||
      resto.address.toLowerCase().includes(query)
    );
  }, [restaurants, userRestaurants, searchQuery]);

  return (
    <>
      <SearchInput
        id="restaurant-search"
        placeholder={dict.common?.searchRestaurant || (lang === 'en' ? 'Search for a restaurant' : 'Rechercher un restaurant')}
        value={searchQuery}
        onChange={setSearchQuery}
        ariaLabel={dict.common?.searchRestaurant || (lang === 'en' ? 'Search for a restaurant' : 'Rechercher un restaurant')}
      />
      <div className="w-full" role="region" aria-label={dict.restaurants?.title || (lang === 'en' ? 'Restaurants' : 'Restaurants')}>
        {displayRestaurants.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              {searchQuery.trim() 
                ? (dict.restaurants?.noResults?.replace('{{query}}', searchQuery) || (lang === 'en' ? `No restaurants found for "${searchQuery}"` : `Aucun restaurant trouvé pour "${searchQuery}"`))
                : (dict.restaurants?.noRestaurants || (lang === 'en' ? 'No restaurants available at the moment.' : 'Aucun restaurant disponible pour le moment.'))}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {displayRestaurants.map((resto) => (
              <Link href={`/${lang}/restaurants/${resto.id}`} key={resto.id}>
                <CardComponent
                  name={resto.name}
                  id={resto.id}
                  address={resto.address}
                  image={resto.image}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

