'use client';

import { useState, useMemo, useEffect } from 'react';
import CardComponent from '@/components/card/CardComponent';
import Link from 'next/link';
import { SearchInput } from '@/components/ui/SearchInput';
import { useDictionary } from '@/components/i18n/DictionaryProvider';
import { usePlatStore } from '@/app/store/platStore';
import { findByUserId } from '@/types/utils.type';
import type { PlatData } from '@/app/store/platStore';

interface RestaurantPlatsListProps {
  plats: PlatData[];
  restaurantUserId: string;
  lang: 'fr' | 'en';
}

export function RestaurantPlatsList({ plats, restaurantUserId, lang }: RestaurantPlatsListProps) {
  const dict = useDictionary();
  const [searchQuery, setSearchQuery] = useState('');
  const userPlats = usePlatStore((state) => state.plats);

  const restaurantPlats = useMemo(() => {
    const allPlats = [...plats, ...userPlats];
    const allRestaurantPlats = findByUserId(allPlats, restaurantUserId)
      .map(plat => ({
        id: Number(plat.id) || parseInt(plat.id, 10) || 0,
        name: plat.name,
        price: plat.price,
        image: plat.image,
      }));

    if (!searchQuery.trim()) {
      return allRestaurantPlats;
    }

    const query = searchQuery.toLowerCase().trim();
    return allRestaurantPlats.filter((plat) =>
      plat.name.toLowerCase().includes(query)
    );
  }, [plats, userPlats, restaurantUserId, searchQuery]);

  return (
    <>
      <SearchInput
        id="plat-search"
        placeholder={dict.common.searchPlat}
        value={searchQuery}
        onChange={setSearchQuery}
        ariaLabel={dict.common.searchPlat}
      />
      {restaurantPlats.length === 0 ? (
        <div className='text-center py-12' role="status" aria-live="polite">
          <p className='text-muted-foreground'>
            {searchQuery.trim() 
              ? dict.restaurants.noPlatResults.replace('{{query}}', searchQuery)
              : dict.restaurants.noPlats}
          </p>
        </div>
      ) : (
        <section aria-label={dict.restaurants.platsAvailable} className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {restaurantPlats.map((plat) => (
            <Link href={`/${lang}/plat/${plat.id}`} key={plat.id} aria-label={`${dict.restaurants.viewDetails} ${plat.name}`}>
              <CardComponent
                name={plat.name}
                id={plat.id}
                image={plat.image}
              />
            </Link>
          ))}
        </section>
      )}
    </>
  );
}

