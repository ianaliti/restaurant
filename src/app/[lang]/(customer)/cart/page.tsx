'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, use } from "react";
import { LazyMessage as Message } from "@/components/ui/LazyComponents";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useDictionary } from "@/components/i18n/DictionaryProvider";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

export default function CartPage({
  params,
}: {
  params: Promise<{ lang: 'fr' | 'en' }>;
}) {
  const { lang } = use(params);
  const { user } = useAuth();
  const { items, updateQuantity, removeItem, clearCart, createOrder, totalPrice } = useCart();
  const router = useRouter();
  const dict = useDictionary();

  const [showSuccess, setShowSuccess] = useState(false);
  const [warningMessage, setWarningMessage] = useState(false);

  const addPlat = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const deletePlat = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) updateQuantity(id, Math.max(0, item.quantity - 1));
  };

  const handleCreateOrder = async () => {
    if (!user?.id || user.role !== 'customer') {
      setWarningMessage(true);
      return;
    }
    try {
      await createOrder(user.id);
      setShowSuccess(true);
    } catch (error) {
      console.error('Order failed:', error);
    }
  };

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Button variant="secondary" onClick={() => router.back()} aria-label={dict.common.back}><ArrowLeft /></Button>
      <h1 className="text-2xl font-bold mb-6">{dict.cart.title}</h1>
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{dict.cart.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item, idx) => (
            <Card key={`${item.id}-${idx}`} className="p-4">
              <CardContent className="p-0 grid grid-cols-[96px_1fr_auto] items-center gap-4">
                <div className="relative w-24 h-24 overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={`Image de ${item.name}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <div className="mt-2 inline-flex items-center gap-2" role="group" aria-label={`${dict.common.actionsFor} ${item.name}`}>
                    <Button variant="secondary" size="sm" onClick={() => deletePlat(item.id)} aria-label={`${dict.common.decreaseQuantity} ${item.name}`}>-</Button>
                    <span className="text-sm font-medium w-6 text-center" aria-label={`${dict.cart.quantity}: ${item.quantity}`}>{item.quantity}</span>
                    <Button variant="secondary" size="sm" onClick={() => addPlat(item.id)} aria-label={`${dict.common.increaseQuantity} ${item.name}`}>+</Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => removeItem(item.id)} aria-label={`${dict.cart.remove} ${item.name}`}>
                      {dict.cart.remove}
                    </Button>
                  </div>
                </div>
                <div className="text-right font-semibold">{`$${(item.price * item.quantity).toFixed(2)}`}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8 flex items-center justify-between">
          <p className="text-lg font-semibold">{dict.cart.total}: {`$${totalPrice.toFixed(2)}`}</p>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="h-12 rounded-3xl px-6" onClick={clearCart} aria-label={dict.cart.clear}>
              {dict.cart.clear}
            </Button>
            <Button className="h-12 rounded-3xl px-8" onClick={handleCreateOrder} aria-label={dict.cart.createOrder}>
              {dict.cart.checkout}
            </Button>
          </div>
        </div>
      )}

      {showSuccess && (
        <Message type="success" message={dict.cart.orderSuccess} onClose={() => setShowSuccess(false)} />
      )}

      {warningMessage && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-sm flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="warning-title"
          aria-describedby="warning-description"
        >
          <div className="bg-white rounded p-6 max-w-md w-11/12 shadow-2xl">
            <h3 id="warning-title" className="text-xl font-bold mb-3">{dict.messages.warning}</h3>
            <p id="warning-description" className="mb-5">{dict.cart.loginRequired}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setWarningMessage(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                {dict.common.cancel}
              </button>
              <button
                onClick={() => { setWarningMessage(false); router.push(`/${lang}/login`); }}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {dict.cart.login}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
