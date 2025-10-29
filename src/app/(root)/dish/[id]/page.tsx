"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import data from "@/mock-data/data.js";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/app/store/cartStore";
import Link from "next/link";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const idNumber = Number(id);
  const allDishes = data.flatMap((resto) => resto.dishes);

  const addItem = useCartStore(state => state.addToCartList);

  const dish = allDishes.find((d) => d.id === idNumber);

  if (!dish) return notFound();

  return (
    <div className="flex flex-col gap-4 p-8 justify-center">
      <div className="flex items-center w-md justify-center">
        <Image
          src={dish.image}
          alt={`${dish.name} Image`}
          width={500}
          height={200}
          objectFit="cover"
        />
      </div>

      <div>
        <p>{dish.name}</p>
        <p>Price: ${dish.price.toFixed(2)}</p>
        <p>{dish.description}</p>
      </div>

      <Button onClick={() => addItem(dish)}>
        <Link href="/cart">
        Add to Cart
        </Link>
        </Button>
    </div>
  );
}
