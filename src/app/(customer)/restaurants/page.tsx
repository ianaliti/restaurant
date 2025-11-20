'use client';

import { useMemo, useState } from "react";
import CardComponent from "@/components/card/CardComponent";
import Link from "next/link";
import { useRestaurantStore } from "@/app/store/restaurantStore";
import { mockRestaurants } from "@/mock-data/data";
import { SearchInput } from "@/components/ui/SearchInput";

const page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const userRestaurants = useRestaurantStore(state => state.restaurants);
  const allRestaurants = useMemo(() => [...mockRestaurants, ...userRestaurants], [userRestaurants]);

  const displayRestaurants = useMemo(() => {
    const restaurantsForDisplay = allRestaurants.map((resto) => ({
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
  }, [allRestaurants, searchQuery]);

  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Restaurants</h1>
      <SearchInput
        id="restaurant-search"
        placeholder="Rechercher un restaurant"
        value={searchQuery}
        onChange={setSearchQuery}
        ariaLabel="Rechercher un restaurant"
      />
      <div className="w-full" role="region" aria-label="Liste des restaurants">
        {displayRestaurants.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              {searchQuery.trim() 
                ? `Aucun restaurant trouvé pour "${searchQuery}"` 
                : 'Aucun restaurant disponible pour le moment.'}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {displayRestaurants.map((resto) => (
              <Link href={`/restaurants/${resto.id}`} key={resto.id}>
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
    </main>
  );
};

export default page;
