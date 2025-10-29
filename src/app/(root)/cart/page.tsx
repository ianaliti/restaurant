'use client';

import { useCartStore } from "@/app/store/cartStore";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function page() {
  const items = useCartStore(state => state.cartlist.items);

  const totalPrice = items.reduce((sum, i) => sum + i.price, 0);
  console.log("Total Price:", totalPrice);

  console.log("Cart Items:", items);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Panier</h1>
      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-[96px_1fr_auto] items-center gap-4 p-4 rounded-xl border bg-white shadow-xs">
            <div className="relative w-24 h-24 overflow-hidden rounded-lg">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate">{item.name}</p>
              <p className="text-sm text-muted-foreground truncate">{item.description}</p>
            </div>
            <div className="text-right font-semibold">{`$${item.price.toFixed(2)}`}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-lg font-semibold">Total: {`$${totalPrice.toFixed(2)}`}</p>
        <Button className="h-12 rounded-3xl px-8">Payer</Button>
      </div>
    </div>
  );
}
