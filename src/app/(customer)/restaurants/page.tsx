'use client';

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import CardComponent from "@/components/card/CardComponent";
import Link from "next/link";
import { useRestaurantStore } from "@/app/store/restaurantStore";

const page = () => {
  const restaurants = useRestaurantStore(state => state.restaurants);

  const displayRestaurants = useMemo(() => {
    if (!restaurants || restaurants.length === 0) {
      alert('No restaurants found. Check if restaurants were created in admin panel.');
    }
    
    return restaurants.map((resto) => ({
      id: resto.id,
      userId: resto.userId,
      name: resto.name,
      address: `${resto.address}, ${resto.codePostal} ${resto.city}`,
      image: resto.image || '/default-restaurant.jpg',
    }));
  }, [restaurants]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Restaurants</h1>
      <Input className="rounded-3xl h-12" placeholder="Rechercher un restaurant" />
      <div className="w-full">
        {displayRestaurants.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Aucun restaurant disponible pour le moment.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {displayRestaurants.map((resto) => (
              <Link href={`/restaurants/${resto.id}`} key={resto.userId}>
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
    </div>
  );
};

export default page;
