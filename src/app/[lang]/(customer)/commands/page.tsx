'use client';

import React, { use } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useDictionary } from '@/components/i18n/DictionaryProvider';
import { useMyOrders } from '@/hooks/useOrder';

export default function CommandsPage({
  params,
}: {
  params: Promise<{ lang: 'fr' | 'en' }>;
}) {
  const { lang } = use(params);
  const { orders, isLoading, error } = useMyOrders();
  const dict = useDictionary();

  return (
    <ProtectedRoute requiredRole="customer">
      <main id="main-content" className='max-w-3xl mx-auto px-4 sm:px-6 py-8'>
        <h1 className='text-2xl font-bold mb-6'>{dict.orders.title}</h1>

        {error && (
          <div className='mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm' role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <div role="status" aria-live="polite" className='text-center py-8'>
            <p className='text-muted-foreground'>Chargement...</p>
          </div>
        ) : orders.length === 0 ? (
          <div role="status" aria-live="polite" className='text-center py-8'>
            <p className='text-muted-foreground'>{dict.orders.noOrders}</p>
          </div>
        ) : (
          <section aria-label={dict.orders.title} className='flex flex-col gap-4'>
            {orders.map((o) => (
                <article
                  key={o.id}
                  className='rounded-xl bg-white shadow-xs border px-4 py-3 flex items-center justify-between'
                >
                  <time className='text-sm text-muted-foreground' dateTime={o.date}>
                    {new Date(o.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}
                  </time>
                  <span className='text-sm'>{`${dict.orders.order} #${o.id.slice(0, 8)}`}</span>
                  {o.status && (
                    <span className='text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600'>
                      {o.status}
                    </span>
                  )}
                  <span className='text-sm font-semibold text-primary'>
                    {typeof o.total === 'number' ? `${o.total.toFixed(2)}€` : '—'}
                  </span>
                </article>
            ))}
          </section>
        )}
      </main>
    </ProtectedRoute>
  );
}
