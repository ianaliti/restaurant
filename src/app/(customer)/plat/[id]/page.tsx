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

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const idNumber = Number(id);

  const allPlatsFromStore = usePlatStore((state) => state.getAllPlats());
  const restaurants = useRestaurantStore((state) => state.getAllRestaurants());

  const allPlats: (Plat & { restaurantId: number })[] = useMemo(() => {
    const platsWithRestaurantId: (Plat & { restaurantId: number })[] = [];

    allPlatsFromStore.forEach((platData) => {
      const restaurant = restaurants.find((r) => r.userId === platData.userId);
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
  }, [allPlatsFromStore, restaurants]);

  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  const plat: (Plat & { restaurantId: number }) | undefined = allPlats.find(
    (p) => p.id === idNumber
  );

  if (!plat) return notFound();

  console.log(plat.image);

  const handleAddToCart = () => {
    const userId = user?.id || "guest";
    addItem(plat, userId);
    setShowToast(true);
  };

  return (
    <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Button variant="secondary" onClick={() => router.back()} aria-label="Retour à la page précédente">
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
            aria-label={`Prix: ${plat.price.toFixed(2)} dollars`}
          >
            {`$${plat.price.toFixed(2)}`}
          </p>
          <Button
            className="mt-2 h-12 rounded-3xl"
            onClick={handleAddToCart}
            aria-label={`Ajouter ${plat.name} au panier`}
          >
            Ajouter au panier
          </Button>
          <Button
            onClick={() => router.push("/cart")}
            variant="secondary"
            aria-label={`Voir la panier`}
          >
            <Link href="/cart">Voir la panier</Link>
          </Button>
        </div>
      </div>
      {showToast && (
        <Toast
          message={`${plat.name} ajouté au panier avec succès!`}
          onClose={() => setShowToast(false)}
        />
      )}
    </main>
  );
}
