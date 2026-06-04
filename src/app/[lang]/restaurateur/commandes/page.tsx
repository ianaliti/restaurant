'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useDictionary } from "@/components/i18n/DictionaryProvider";
import { usePathname } from "next/navigation";
import { useRestaurantOrders } from "@/hooks/useOrder";
import { useRestaurantWebSocket } from "@/hooks/useRestaurantWebSocket";
import { getOrderByIdService } from "@/services/order.service";
import { Toast } from "@/components/ui/Toast";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

const STATUS_COLORS: Record<string, string> = {
  PENDING:   'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  READY:     'bg-teal-100 text-teal-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const NEXT_STATUS: Record<string, string> = {
  PENDING:   'CONFIRMED',
  CONFIRMED: 'PREPARING',
  PREPARING: 'READY',
  READY:     'DELIVERED',
};

export default function CommandesPage() {
  const dict = useDictionary();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'fr';
  const { orders, setOrders, isLoading, updateStatus } = useRestaurantOrders();
  const [toast, setToast] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const handleAdvance = async (orderId: string, next: string) => {
    setUpdatingId(orderId);
    try {
      await updateStatus(orderId, next);
    } catch {
      setToast('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusLabels = (dict.orders as any).status as Record<string, string>;
  const nextLabels   = (dict.orders as any).nextStatus as Record<string, string>;

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
            {orders.map((order) => {
              const next = NEXT_STATUS[order.status ?? ''];
              const isUpdating = updatingId === order.id;

              return (
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
                    <div className='flex items-center gap-3'>
                      {order.status && (
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {statusLabels?.[order.status] ?? order.status}
                        </span>
                      )}
                      <p className='text-lg font-semibold text-primary'>€{order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  {order.items.length > 0 && (
                    <div className='space-y-2 mb-4' role="list">
                      {order.items.map((item) => (
                        <div key={item.id} className='flex items-center justify-between py-2 border-b last:border-0' role="listitem">
                          <div>
                            <p className='font-medium'>{item.name || `Plat #${item.id.slice(0, 6)}`}</p>
                            <p className='text-sm text-muted-foreground'>{dict.cart.quantity}: {item.quantity} × €{item.price.toFixed(2)}</p>
                          </div>
                          <p className='font-semibold'>€{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {next && (
                    <div className='flex justify-end'>
                      <Button
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleAdvance(order.id, next)}
                      >
                        {isUpdating ? '…' : nextLabels?.[order.status ?? ''] ?? next}
                      </Button>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    </ProtectedRoute>
    {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}
