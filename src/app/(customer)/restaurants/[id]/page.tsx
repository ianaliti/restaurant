'use client'
import { use, useMemo } from 'react'
import { notFound } from 'next/navigation';
import CardComponent from '@/components/card/CardComponent';
import Link from 'next/link';
import { useRestaurantStore } from '@/app/store/restaurantStore';
import { usePlatStore } from '@/app/store/platStore';
 
export default function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const idNumber = Number(id);
  
  const restaurants = useRestaurantStore(state => state.getAllRestaurants());
  const allPlats = usePlatStore(state => state.getAllPlats());

  const restaurant = useMemo(() => {
    return restaurants.find((resto) => resto.id === idNumber);
  }, [restaurants, idNumber]);

  if (!restaurant) return notFound();

  const restaurantPlats = useMemo(() => {
    return allPlats
      .filter(p => p.userId === restaurant.userId)
      .map(plat => ({
        id: Number(plat.id) || parseInt(plat.id, 10) || 0,
        name: plat.name,
        price: plat.price,
        image: plat.image,
      }));
  }, [allPlats, restaurant.userId]);
 
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <p className='text-2xl sm:text-3xl font-bold'>{restaurant.name}</p>
        <p className='text-muted-foreground max-w-3xl'>
          {restaurant.address}, {restaurant.codePostal} {restaurant.city}
        </p>
      </div>
      {restaurantPlats.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>Aucun plat disponible pour ce restaurant.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {restaurantPlats.map((plat) => (
            <Link href={`/plat/${plat.id}`} key={plat.id}>
              <CardComponent
                name={plat.name}
                id={plat.id}
                image={plat.image}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

