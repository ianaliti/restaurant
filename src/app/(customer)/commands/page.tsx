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
      <div className='max-w-3xl mx-auto px-4 sm:px-6 py-8'>
      <h1 className='text-2xl font-bold mb-6'>Commandes</h1>
      <div className='flex flex-col gap-4'>
        {orders.length === 0 ? (
          <p className='text-muted-foreground text-center py-8'>Aucune commande pour le moment.</p>
        ) : (
          orders.map((o) => (
            <div key={o.id} className='rounded-xl bg-white shadow-xs border px-4 py-3 flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>{new Date(o.date).toLocaleDateString()}</span>
              <span className='text-sm'>{`Commande ${o.id}`}</span>
              <span className='text-sm font-semibold text-primary'>{`${o.total.toFixed(2)}€`}</span>
            </div>
          ))
        )}
      </div>
    </div>
    </ProtectedRoute>
  )
}

export default page