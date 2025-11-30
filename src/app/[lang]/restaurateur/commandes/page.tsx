'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/app/store/authStore";
import { getAllOrders } from "@/app/store/orderStore";
import { usePlatStore } from "@/app/store/platStore";
import { Order } from '@/types/restaurants.type';
import { useDictionary } from "@/components/i18n/DictionaryProvider";
import { usePathname } from "next/navigation";

export default function CommandesPage() {
  const { user } = useAuthStore();
  const dict = useDictionary();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'fr';
  const getPlatsByUserId = usePlatStore(state => state.getPlatsByUserId);
  const [restaurateurOrders, setRestaurateurOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const loadOrders = () => {
      const allOrders = getAllOrders();
      
      const restaurateurPlats = getPlatsByUserId(user.id);
      const platIds = new Set(restaurateurPlats.map(p => {
        const numId = Number(p.id);
        return isNaN(numId) ? null : numId;
      }).filter(id => id !== null) as number[]);
      
      const platNames = new Set(restaurateurPlats.map(p => p.name.toLowerCase()));

      const filteredOrders = allOrders.filter(order => {
        return order.items.some(item => 
          platIds.has(item.id) || platNames.has(item.name.toLowerCase())
        );
      });

      filteredOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setRestaurateurOrders(filteredOrders);
    };

    loadOrders();
    const interval = setInterval(loadOrders, 1000);
    return () => clearInterval(interval);
  }, [user?.id, getPlatsByUserId]);

  const getOrderItemsForRestaurateur = (order: Order) => {
    if (!user?.id) return [];
    
    const restaurateurPlats = getPlatsByUserId(user.id);
    const platIds = new Set(restaurateurPlats.map(p => {
      const numId = Number(p.id);
      return isNaN(numId) ? null : numId;
    }).filter(id => id !== null) as number[]);
    
    return order.items.filter(item => platIds.has(item.id));
  };

  return (
    <ProtectedRoute requiredRole={['restaurateur', 'admin']}>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
        <div className='mb-6'>
          <h1 className='text-2xl font-semibold'>{dict.restaurateur.orders}</h1>
          <p className='text-muted-foreground mt-1'>
            {dict.restaurateur.orderHistory}
          </p>
        </div>

        {restaurateurOrders.length === 0 ? (
          <div className='bg-white rounded-lg shadow-sm p-8 text-center' role="status" aria-live="polite">
            <p className='text-muted-foreground'>{dict.restaurateur.noOrders}</p>
          </div>
        ) : (
          <section aria-label="Liste des commandes" className='space-y-4'>
            {restaurateurOrders.map((order) => {
              const orderItems = getOrderItemsForRestaurateur(order);
              const orderTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              
              return (
                <article 
                  key={order.id} 
                  className='bg-white rounded-lg shadow-sm p-6'
                  aria-label={`Commande ${order.id} du ${new Date(order.date).toLocaleDateString('fr-FR')}`}
                >
                  <div className='flex items-center justify-between mb-4 pb-4 border-b'>
                    <div>
                      <h3 className='text-lg font-semibold'>{dict.orders.order} #{order.id}</h3>
                      <time 
                        className='text-sm text-muted-foreground'
                        dateTime={order.date}
                      >
                        {new Date(order.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>
                    <div className='text-right'>
                      <p className='text-lg font-semibold text-primary' aria-label={`${dict.cart.total}: ${orderTotal.toFixed(2)}€`}>
                        €{orderTotal.toFixed(2)}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {orderItems.length} {orderItems.length > 1 ? dict.restaurateur.plats : dict.restaurateur.plats.slice(0, -1)}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-2' role="list" aria-label="Articles de la commande">
                    {orderItems.map((item) => (
                      <div key={item.id} className='flex items-center justify-between py-2 border-b last:border-0' role="listitem">
                        <div className='flex-1'>
                          <p className='font-medium'>{item.name}</p>
                          <p className='text-sm text-muted-foreground'>
                            {dict.cart.quantity}: {item.quantity} × €{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-semibold' aria-label={`${dict.cart.total}: ${(item.price * item.quantity).toFixed(2)}€`}>
                            €{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </ProtectedRoute>
  );
}
