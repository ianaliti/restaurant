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

  const statusColors: Record<string, string> = {
    PENDING:    'bg-yellow-100 text-yellow-800',
    CONFIRMED:  'bg-blue-100 text-blue-800',
    PREPARING:  'bg-purple-100 text-purple-800',
    READY:      'bg-teal-100 text-teal-800',
    DELIVERED:  'bg-green-100 text-green-800',
    CANCELLED:  'bg-red-100 text-red-800',
  };

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
                className='rounded-xl bg-white shadow-xs border px-4 py-4'
              >
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>{dict.orders.order} #{o.id.slice(0, 8)}</span>
                  {o.status && (
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {(dict.orders.status as Record<string, string>)[o.status] ?? o.status}
                    </span>
                  )}
                </div>
                <div className='flex items-center justify-between mt-2'>
                  <time className='text-sm text-muted-foreground' dateTime={o.date}>
                    {new Date(o.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </time>
                  <span className='text-sm font-semibold text-primary'>
                    {typeof o.total === 'number' ? `${o.total.toFixed(2)} €` : '—'}
                  </span>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </ProtectedRoute>
  );
}
