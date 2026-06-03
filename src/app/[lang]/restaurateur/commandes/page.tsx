'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useDictionary } from "@/components/i18n/DictionaryProvider";
import { usePathname } from "next/navigation";
import { useRestaurantOrders } from "@/hooks/useOrder";
import { useRestaurantWebSocket } from "@/hooks/useRestaurantWebSocket";
import { getOrderByIdService } from "@/services/order.service";
import { Toast } from "@/components/ui/Toast";
import { useState, useCallback } from "react";

export default function CommandesPage() {
  const dict = useDictionary();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'fr';
  const { orders, setOrders, isLoading } = useRestaurantOrders();
  const [toast, setToast] = useState<string | null>(null);

  const handleNewOrder = useCallback(async (orderId: string) => {
    try {
      const order = await getOrderByIdService(orderId);
      setOrders((prev) => [order, ...prev]);
      setToast(`Nouvelle commande reçue ! #${orderId.slice(0, 8)}`);
    } catch {
      // silently ignore if fetch fails
    }
  }, [setOrders]);

  useRestaurantWebSocket(handleNewOrder);

  return (
    <>
    <ProtectedRoute requiredRole={['restaurateur', 'admin']}>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
        <div className='mb-6'>
          <h1 className='text-2xl font-semibold'>{dict.restaurateur.orders}</h1>
          <p className='text-muted-foreground mt-1'>{dict.restaurateur.orderHistory}</p>
        </div>

        {isLoading ? (
          <div className='bg-white rounded-lg shadow-sm p-8 text-center' role="status" aria-live="polite">
            <p className='text-muted-foreground'>Chargement...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className='bg-white rounded-lg shadow-sm p-8 text-center' role="status" aria-live="polite">
            <p className='text-muted-foreground'>{dict.restaurateur.noOrders}</p>
          </div>
        ) : (
          <section aria-label="Liste des commandes" className='space-y-4'>
            {orders.map((order) => (
              <article
                key={order.id}
                className='bg-white rounded-lg shadow-sm p-6'
                aria-label={`Commande ${order.id}`}
              >
                <div className='flex items-center justify-between mb-4 pb-4 border-b'>
                  <div>
                    <h3 className='text-lg font-semibold'>{dict.orders.order} #{order.id.slice(0, 8)}</h3>
                    <time className='text-sm text-muted-foreground' dateTime={order.date}>
                      {new Date(order.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </time>
                  </div>
                  <p className='text-lg font-semibold text-primary'>€{order.total.toFixed(2)}</p>
                </div>

                {order.items.length > 0 && (
                  <div className='space-y-2' role="list">
                    {order.items.map((item) => (
                      <div key={item.id} className='flex items-center justify-between py-2 border-b last:border-0' role="listitem">
                        <div>
                          <p className='font-medium'>{item.name}</p>
                          <p className='text-sm text-muted-foreground'>{dict.cart.quantity}: {item.quantity} × €{item.price.toFixed(2)}</p>
                        </div>
                        <p className='font-semibold'>€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </ProtectedRoute>
    {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}
