'use client';

import { useState, useMemo } from 'react';
import CardComponent from '@/components/card/CardComponent';
import Link from 'next/link';
import { SearchInput } from '@/components/ui/SearchInput';
import { useDictionary } from '@/components/i18n/DictionaryProvider';
import type { PlatData } from '@/types/restaurants.type';

interface RestaurantPlatsListProps {
  plats: PlatData[];
  lang: 'fr' | 'en';
}

export function RestaurantPlatsList({ plats, lang }: RestaurantPlatsListProps) {
  const dict = useDictionary();
  const [searchQuery, setSearchQuery] = useState('');

  const displayPlats = useMemo(() => {
    if (!searchQuery.trim()) return plats;
    const query = searchQuery.toLowerCase().trim();
    return plats.filter((p) => p.name.toLowerCase().includes(query));
  }, [plats, searchQuery]);

  return (
    <>
      <SearchInput
        id="plat-search"
        placeholder={dict.common.searchPlat}
        value={searchQuery}
        onChange={setSearchQuery}
        ariaLabel={dict.common.searchPlat}
      />
      {displayPlats.length === 0 ? (
        <div className='text-center py-12' role="status" aria-live="polite">
          <p className='text-muted-foreground'>
            {searchQuery.trim()
              ? dict.restaurants.noPlatResults.replace('{{query}}', searchQuery)
              : dict.restaurants.noPlats}
          </p>
        </div>
      ) : (
        <section aria-label={dict.restaurants.platsAvailable} className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {displayPlats.map((plat) => (
            <Link href={`/${lang}/plat/${plat.id}`} key={plat.id} aria-label={`${dict.restaurants.viewDetails} ${plat.name}`}>
              <CardComponent name={plat.name} id={plat.id} image={plat.image} />
            </Link>
          ))}
        </section>
      )}
    </>
  );
}
