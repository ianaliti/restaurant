"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import data from "@/mock-data/data";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/app/store/cartStore";
import Link from "next/link";
import { Dish } from "@/types/restaurants.type";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const idNumber = Number(id);
  const allDishes: (Dish & { restaurantId: number })[] = data.flatMap((resto) =>
    resto.dishes.map((dish) => ({
      ...dish,
      restaurantId: resto.id,
    }))
  );

  const addItem = useCartStore((state) => state.addItem);

  const dish: (Dish & { restaurantId: number }) | undefined = allDishes.find(
    (d) => d.id === idNumber
  );

  if (!dish) return notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-sm">
          <Image
            src={dish.image}
            alt={`${dish.name} Image`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-2xl font-bold">{dish.name}</p>
          <p className="text-primary font-semibold">{`$${dish.price.toFixed(
            2
          )}`}</p>
          <p className="text-muted-foreground leading-relaxed">
            {dish.description}
          </p>
          <Button
            className="mt-2 h-12 rounded-3xl"
            onClick={() => addItem(dish)}
          >
            <Link href="/cart">Ajouter au panier</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
