'use client';

import { useCartStore } from "@/app/store/cartStore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function page() {
  const items = useCartStore(state => state.cartlist.items);
  const increment = useCartStore(state => state.incrementQuantity);
  const decrement = useCartStore(state => state.decrementQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const clearCart = useCartStore(state => state.clearCart);

  const totalPrice = items.reduce((sum, i) => sum + i.price, 0);

  console.log("Total Price:", totalPrice);

  console.log("Cart Items:", items);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Panier</h1>
      <div className="grid grid-cols-1 gap-4">
        {items.map((item, idx) => (
          <Card key={`${item.id}-${idx}`} className="p-4">
            <CardContent className="p-0 grid grid-cols-[96px_1fr_auto] items-center gap-4">
              <div className="relative w-24 h-24 overflow-hidden rounded-lg">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                <div className="mt-2 inline-flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => decrement(item.id)}>-</Button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <Button variant="secondary" size="sm" onClick={() => increment(item.id)}>+</Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => removeItem(item.id)}>Remove</Button>
                </div>
              </div>
              <div className="text-right font-semibold">{`$${(item.price * item.quantity).toFixed(2)}`}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-lg font-semibold">Total: {`$${totalPrice.toFixed(2)}`}</p>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="h-12 rounded-3xl px-6" onClick={clearCart}>Vider</Button>
          <Button className="h-12 rounded-3xl px-8">Payer</Button>
        </div>
      </div>
    </div>
  );
}
