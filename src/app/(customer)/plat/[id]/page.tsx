"use client";
import { use, useMemo } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/app/store/cartStore";
import { usePlatStore } from "@/app/store/platStore";
import { useRestaurantStore } from "@/app/store/restaurantStore";
import Link from "next/link";
import { Plat } from "@/types/restaurants.type";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const idNumber = Number(id);
  
  const allPlatsFromStore = usePlatStore(state => state.getAllPlats());
  const restaurants = useRestaurantStore(state => state.getAllRestaurants());

  const allPlats: (Plat & { restaurantId: number })[] = useMemo(() => {
    const platsWithRestaurantId: (Plat & { restaurantId: number })[] = [];
    
    allPlatsFromStore.forEach((platData) => {
      const restaurant = restaurants.find(r => r.userId === platData.userId);
      if (restaurant) {
        const platNumericId = Number(platData.id) || parseInt(platData.id, 10) || 0;
        
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
  }, [allPlatsFromStore, restaurants]);

  const addItem = useCartStore((state) => state.addItem);

  const plat: (Plat & { restaurantId: number }) | undefined = allPlats.find(
    (p) => p.id === idNumber
  );

  if (!plat) return notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-sm">
          <Image
            src={plat.image}
            alt={`${plat.name} Image`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-2xl font-bold">{plat.name}</p>
          <p className="text-primary font-semibold">{`$${plat.price.toFixed(
            2
          )}`}</p>
          <Button
            className="mt-2 h-12 rounded-3xl"
            onClick={() => addItem(plat)}
          >
            <Link href="/cart">Ajouter au panier</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
