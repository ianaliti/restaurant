'use client';

import { useCartStore } from "@/app/store/cartStore";
import { useOrderStore } from "@/app/store/orderStore";
import { useAuthStore } from "@/app/store/authStore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useMemo, useEffect } from "react";
import { Message } from "@/components/ui/Message";

export default function page() {
  const items = useCartStore(state => state.items || []);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const clearCart = useCartStore(state => state.clearCart);

  const createOrder = useCartStore(state => state.createOrder);
  const addOrder = useOrderStore((state) => state.addOrder);
  const { user } = useAuthStore();
  const isCustomer = user?.role === 'customer';
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [warningMessage, setWarningMessage] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalPrice = useMemo(() => {
    if (!mounted) return 0;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [items, mounted]);

  const addPlat = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      updateQuantity(id, (item.quantity || 1) + 1);
    }
  };

  const deletePlat = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      updateQuantity(id, Math.max(0, (item.quantity || 1) - 1));
    }
  };

  const handleCreateOrder = () => {
    if (!isCustomer) {
      setWarningMessage(true);
      return;
    }
    const newOrder = createOrder();
    addOrder(newOrder);  
    setShowSuccess(true);
  }

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
                <div className="mt-2 inline-flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => deletePlat(item.id)}>-</Button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <Button variant="secondary" size="sm" onClick={() => addPlat(item.id)}>+</Button>
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
          <Button className="h-12 rounded-3xl px-8" onClick={handleCreateOrder}>Payer</Button>
          {showSuccess && (
            <Message
              type="success"
              message="Order Created!"
              onClose={() => setShowSuccess(false)}
            />
          )}
          {warningMessage && (
            <Message
              type="warning"
              message="Vous devez être connecté en tant que client pour créer une commande. Veuillez vous déconnecter et vous connecter avec un compte client."
              onClose={() => setWarningMessage(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
