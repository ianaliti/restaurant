'use client';

import { useEffect, useState } from 'react';
import { usePlatStore } from '@/app/store/platStore';
import { useRestaurantStore } from '@/app/store/restaurantStore';
import { PlatDetail } from './PlatDetail';
import { useParams } from 'next/navigation';
import type { PlatData } from '@/app/store/platStore';

interface PlatDetailWrapperProps {
  serverResult: { plat: PlatData; restaurantId: number } | null;
  id: number;
  lang: 'fr' | 'en';
}

export function PlatDetailWrapper({ serverResult, id, lang }: PlatDetailWrapperProps) {
  const params = useParams();
  const userPlats = usePlatStore((state) => state.plats);
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const [platData, setPlatData] = useState<{ plat: PlatData; restaurantId: number } | null>(serverResult);

  useEffect(() => {
    if (!serverResult && params.id) {
      const idString = typeof params.id === 'string' ? params.id : params.id.toString();
      const userPlat = userPlats.find((p) => p.id === idString || Number(p.id) === Number(idString));
      
      if (userPlat) {
        const restaurant = restaurants.find((r) => r.userId === userPlat.userId);
        
        if (restaurant) {
          setPlatData({
            plat: userPlat,
            restaurantId: restaurant.id,
          });
        }
      }
    }
  }, [serverResult, params.id, userPlats, restaurants]);

  if (!platData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Plat introuvable</p>
      </div>
    );
  }

  const platWithRestaurant = {
    id: Number(platData.plat.id) || parseInt(platData.plat.id, 10) || 0,
    name: platData.plat.name,
    price: platData.plat.price,
    image: platData.plat.image,
    restaurantId: platData.restaurantId,
  };

  return <PlatDetail plat={platWithRestaurant} lang={lang} />;
}

