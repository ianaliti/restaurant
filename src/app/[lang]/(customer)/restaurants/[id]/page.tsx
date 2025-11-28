'use client'
import { use, useMemo, useState } from 'react'
import { notFound } from 'next/navigation';
import CardComponent from '@/components/card/CardComponent';
import Link from 'next/link';
import { useRestaurantStore } from '@/app/store/restaurantStore';
import { usePlatStore } from '@/app/store/platStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { mockRestaurants, mockPlats } from '@/mock-data/data';
import { SearchInput } from '@/components/ui/SearchInput';
import { useDictionary } from '@/components/i18n/DictionaryProvider';
 
export default function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ lang: 'fr' | 'en'; id: string }>
}) {
  const { lang, id } = use(params);
  const idNumber = Number(id);
  const [searchQuery, setSearchQuery] = useState("");
  const dict = useDictionary();
  
  const userRestaurants = useRestaurantStore(state => state.restaurants);
  const userPlats = usePlatStore(state => state.plats);
  
  const allRestaurants = useMemo(() => [...mockRestaurants, ...userRestaurants], [userRestaurants]);
  const allPlats = useMemo(() => [...mockPlats, ...userPlats], [userPlats]);

  const router = useRouter();

  const restaurant = useMemo(() => {
    return allRestaurants.find((resto) => resto.id === idNumber);
  }, [allRestaurants, idNumber]);

  if (!restaurant) return notFound();

  const restaurantPlats = useMemo(() => {
    const allRestaurantPlats = allPlats
      .filter(p => p.userId === restaurant.userId)
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
  }, [allPlats, restaurant.userId, searchQuery]);
 
  return (
    <main id="main-content" className='max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6'>
      <Button variant="secondary" onClick={() => router.back()} className='w-15' aria-label={dict.common.back}><ArrowLeft /></Button>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl sm:text-3xl font-bold'>{restaurant.name}</h1>
        <p className='text-muted-foreground max-w-3xl' aria-label={`${dict.restaurants.address}: ${restaurant.address}, ${restaurant.codePostal} ${restaurant.city}`}>
          {restaurant.address}, {restaurant.codePostal} {restaurant.city}
        </p>
      </div>
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
    </main>
  )
}
