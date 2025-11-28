'use client'

import React, { use } from 'react'
import { useOrderStore } from '@/app/store/orderStore'
import { useAuthStore } from '@/app/store/authStore'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useDictionary } from '@/components/i18n/DictionaryProvider'

export default function CommandsPage({
  params,
}: {
  params: Promise<{ lang: 'fr' | 'en' }>;
}) {
  const { lang } = use(params);
  const getOrdersByUserId = useOrderStore((state) => state.getOrdersByUserId);
  const { user } = useAuthStore();
  const dict = useDictionary();
  
  const orders = user?.id ? getOrdersByUserId(user.id) : [];

  return (
    <ProtectedRoute requiredRole="customer">
      <main id="main-content" className='max-w-3xl mx-auto px-4 sm:px-6 py-8'>
        <h1 className='text-2xl font-bold mb-6'>{dict.orders.title}</h1>
        {orders.length === 0 ? (
          <div role="status" aria-live="polite" className='text-center py-8'>
            <p className='text-muted-foreground'>{dict.orders.noOrders}</p>
          </div>
        ) : (
          <section aria-label={dict.orders.title} className='flex flex-col gap-4'>
            {orders.map((o) => (
              <article 
                key={o.id} 
                className='rounded-xl bg-white shadow-xs border px-4 py-3 flex items-center justify-between'
                aria-label={`${dict.orders.order} ${o.id} ${dict.orders.date} ${new Date(o.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')} ${dict.orders.total} ${o.total.toFixed(2)}€`}
              >
                <time className='text-sm text-muted-foreground' dateTime={o.date}>
                  {new Date(o.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}
                </time>
                <span className='text-sm'>{`${dict.orders.order} ${o.id}`}</span>
                <span className='text-sm font-semibold text-primary' aria-label={`${dict.orders.total}: ${o.total.toFixed(2)}€`}>
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
