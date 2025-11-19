'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/app/store/authStore";
import { getAllOrders } from "@/app/store/orderStore";
import { usePlatStore } from "@/app/store/platStore";
import { Order } from '@/types/restaurants.type';

export default function CommandesPage() {
  const { user } = useAuthStore();
  const getPlatsByUserId = usePlatStore(state => state.getPlatsByUserId);
  const [restaurateurOrders, setRestaurateurOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadRestaurateurOrders();
    }
    const interval = setInterval(() => {
      if (user?.id) {
        loadRestaurateurOrders();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const loadRestaurateurOrders = () => {
    if (!user?.id) return;

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
          <h1 className='text-2xl font-semibold'>Commandes</h1>
          <p className='text-muted-foreground mt-1'>
            Historique des commandes contenant vos plats
          </p>
        </div>

        {restaurateurOrders.length === 0 ? (
          <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
            <p className='text-muted-foreground'>Aucune commande pour le moment.</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {restaurateurOrders.map((order) => {
              const orderItems = getOrderItemsForRestaurateur(order);
              const orderTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              
              return (
                <div key={order.id} className='bg-white rounded-lg shadow-sm p-6'>
                  <div className='flex items-center justify-between mb-4 pb-4 border-b'>
                    <div>
                      <h3 className='text-lg font-semibold'>Commande #{order.id}</h3>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(order.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-lg font-semibold text-primary'>
                        €{orderTotal.toFixed(2)}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {orderItems.length} plat{orderItems.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    {orderItems.map((item) => (
                      <div key={item.id} className='flex items-center justify-between py-2 border-b last:border-0'>
                        <div className='flex-1'>
                          <p className='font-medium'>{item.name}</p>
                          <p className='text-sm text-muted-foreground'>
                            Quantité: {item.quantity} × €{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-semibold'>
                            €{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
