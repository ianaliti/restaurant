"use client";
import { use, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/app/store/cartStore";
import { usePlatStore } from "@/app/store/platStore";
import { useRestaurantStore } from "@/app/store/restaurantStore";
import { useAuthStore } from "@/app/store/authStore";
import Link from "next/link";
import { Plat } from "@/types/restaurants.type";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Toast } from "@/components/ui/Toast";
import { mockRestaurants, mockPlats } from "@/mock-data/data";
import { useDictionary } from "@/components/i18n/DictionaryProvider";

export default function PlatDetailPage({ 
  params 
}: { 
  params: Promise<{ lang: 'fr' | 'en'; id: string }> 
}) {
  const { lang, id } = use(params);
  const idNumber = Number(id);

  const dict = useDictionary();
  const userPlats = usePlatStore((state) => state.plats);
  const userRestaurants = useRestaurantStore((state) => state.restaurants);
  
  const allPlatsFromStore = useMemo(() => [...mockPlats, ...userPlats], [userPlats]);
  const allRestaurants = useMemo(() => [...mockRestaurants, ...userRestaurants], [userRestaurants]);

  const allPlats: (Plat & { restaurantId: number })[] = useMemo(() => {
    const platsWithRestaurantId: (Plat & { restaurantId: number })[] = [];

    allPlatsFromStore.forEach((platData) => {
      const restaurant = allRestaurants.find((r) => r.userId === platData.userId);
      if (restaurant) {
        const platNumericId =
          Number(platData.id) || parseInt(platData.id, 10) || 0;

        platsWithRestaurantId.push({
          id: platNumericId,
          name: platData.name,
          price: platData.price,
          image: platData.image,
          restaurantId: restaurant.id,
        });
      }
    });

    return platsWithRestaurantId;
  }, [allPlatsFromStore, allRestaurants]);

  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  const plat: (Plat & { restaurantId: number }) | undefined = allPlats.find(
    (p) => p.id === idNumber
  );

  if (!plat) return notFound();

  const handleAddToCart = () => {
    const userId = user?.id || "guest";
    addItem(plat, userId);
    setShowToast(true);
  };

  return (
    <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Button variant="secondary" onClick={() => router.back()} aria-label={dict.common.back}>
        <ArrowLeft />
      </Button>
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
    </main>
  );
}
