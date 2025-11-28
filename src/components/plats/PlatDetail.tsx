'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/app/store/cartStore';
import { useAuthStore } from '@/app/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Toast } from '@/components/ui/Toast';
import { useDictionary } from '@/components/i18n/DictionaryProvider';
import type { Plat } from '@/types/restaurants.type';

interface PlatDetailProps {
  plat: Plat & { restaurantId: number };
  lang: 'fr' | 'en';
}

export function PlatDetail({ plat, lang }: PlatDetailProps) {
  const dict = useDictionary();
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    const userId = user?.id || 'guest';
    addItem(plat, userId);
    setShowToast(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-2xl shadow-sm bg-gray-100">
          <Image
            src={plat.image || '/placeholder-plat.jpg'}
            alt={`Image du plat ${plat.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{plat.name}</h1>
          <p
            className="text-primary font-semibold"
            aria-label={`${dict.common.price}: ${plat.price.toFixed(2)}`}
          >
            {`$${plat.price.toFixed(2)}`}
          </p>
          <Button
            className="mt-2 h-12 rounded-3xl"
            onClick={handleAddToCart}
            aria-label={`${dict.common.add} ${plat.name} ${dict.common.toCart}`}
          >
            {dict.common.add} {dict.common.toCart}
          </Button>
          <Button
            onClick={() => router.push(`/${lang}/cart`)}
            variant="secondary"
            aria-label={dict.common.viewCart}
          >
            <Link href={`/${lang}/cart`}>{dict.common.viewCart}</Link>
          </Button>
        </div>
      </div>
      {showToast && (
        <Toast
          message={`${plat.name} ${dict.common.addedToCartSuccess}`}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}

