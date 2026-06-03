'use client';

import { useState, useMemo } from 'react';
import CardComponent from '@/components/card/CardComponent';
import Link from 'next/link';
import { SearchInput } from '@/components/ui/SearchInput';
import { useDictionary } from '@/components/i18n/DictionaryProvider';
import type { RestaurantData } from '@/types/restaurants.type';

interface RestaurantsListProps {
  restaurants: RestaurantData[];
  lang: 'fr' | 'en';
}

export function RestaurantsList({ restaurants, lang }: RestaurantsListProps) {
  const dict = useDictionary();
  const [searchQuery, setSearchQuery] = useState('');

  const displayRestaurants = useMemo(() => {
    if (!searchQuery.trim()) return restaurants;
    const query = searchQuery.toLowerCase().trim();
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.address.toLowerCase().includes(query) ||
        r.city.toLowerCase().includes(query)
    );
  }, [restaurants, searchQuery]);

  return (
    <>
      <SearchInput
        id="restaurant-search"
        placeholder={dict.common?.searchRestaurant || (lang === 'en' ? 'Search for a restaurant' : 'Rechercher un restaurant')}
        value={searchQuery}
        onChange={setSearchQuery}
        ariaLabel={dict.common?.searchRestaurant || ''}
      />
      <div className="w-full" role="region" aria-label={dict.restaurants?.title || 'Restaurants'}>
        {displayRestaurants.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              {searchQuery.trim()
                ? dict.restaurants?.noResults?.replace('{{query}}', searchQuery)
                : dict.restaurants?.noRestaurants}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {displayRestaurants.map((resto) => (
              <Link href={`/${lang}/restaurants/${resto.id}`} key={resto.id}>
                <CardComponent
                  name={resto.name}
                  id={resto.id}
                  address={`${resto.address}, ${resto.codePostal} ${resto.city}`}
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
