'use client'

import React from 'react'
import { useOrderStore } from '@/app/store/orderStore'
import { useAuthStore } from '@/app/store/authStore'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

const page: React.FC = () => {
  const getOrdersByUserId = useOrderStore((state) => state.getOrdersByUserId);
  const { user } = useAuthStore();
  
  const orders = user?.id ? getOrdersByUserId(user.id) : [];

  return (
    <ProtectedRoute requiredRole="customer">
      <main id="main-content" className='max-w-3xl mx-auto px-4 sm:px-6 py-8'>
        <h1 className='text-2xl font-bold mb-6'>Commandes</h1>
        {orders.length === 0 ? (
          <div role="status" aria-live="polite" className='text-center py-8'>
            <p className='text-muted-foreground'>Aucune commande pour le moment.</p>
          </div>
        ) : (
          <section aria-label="Liste des commandes" className='flex flex-col gap-4'>
            {orders.map((o) => (
              <article 
                key={o.id} 
                className='rounded-xl bg-white shadow-xs border px-4 py-3 flex items-center justify-between'
                aria-label={`Commande ${o.id} du ${new Date(o.date).toLocaleDateString('fr-FR')} d'un montant de ${o.total.toFixed(2)}€`}
              >
                <time className='text-sm text-muted-foreground' dateTime={o.date}>
                  {new Date(o.date).toLocaleDateString('fr-FR')}
                </time>
                <span className='text-sm'>{`Commande ${o.id}`}</span>
                <span className='text-sm font-semibold text-primary' aria-label={`Total: ${o.total.toFixed(2)}€`}>
                  {`${o.total.toFixed(2)}€`}
                </span>
              </article>
            ))}
          </section>
        )}
      </main>
    </ProtectedRoute>
  )
}

export default page