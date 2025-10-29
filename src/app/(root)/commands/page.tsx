import React from 'react'
import { Command } from '@/types/restaurants.type'

const orders: Command[] = [
  { id: 'CMD-20032023', total: 15.2, date: '2023-03-20' },
  { id: 'CMD-21032023', total: 12.6, date: '2023-03-21' },
  { id: 'CMD-22032023', total: 55, date: '2023-03-22' },
  { id: 'CMD-23032023', total: 6.8, date: '2023-03-23' },
]

const page: React.FC = () => {
  return (
    <div className='max-w-3xl mx-auto px-4 sm:px-6 py-8'>
      <h1 className='text-2xl font-bold mb-6'>Commandes</h1>
      <div className='flex flex-col gap-4'>
        {orders.map((o) => (
          <div key={o.id} className='rounded-xl bg-white shadow-xs border px-4 py-3 flex items-center justify-between'>
            <span className='text-sm text-muted-foreground'>{new Date(o.date).toLocaleDateString()}</span>
            <span className='text-sm'>{`Commande ${o.id}`}</span>
            <span className='text-sm font-semibold text-primary'>{`${o.total.toFixed(2)}€`}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default page