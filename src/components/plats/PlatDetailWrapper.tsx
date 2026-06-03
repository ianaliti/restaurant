'use client';

import { PlatDetail } from './PlatDetail';
import type { PlatData } from '@/types/restaurants.type';

interface PlatDetailWrapperProps {
  serverResult: { plat: PlatData; restaurantId: string } | null;
  id: string;
  lang: 'fr' | 'en';
}

export function PlatDetailWrapper({ serverResult, lang }: PlatDetailWrapperProps) {
  if (!serverResult) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Plat introuvable</p>
      </div>
    );
  }

  const platWithRestaurant = {
    ...serverResult.plat,
    restaurantId: serverResult.restaurantId,
  };

  return <PlatDetail plat={platWithRestaurant} lang={lang} />;
}
