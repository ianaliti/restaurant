'use client'
import { use } from 'react'
import { notFound } from 'next/navigation';
import data from '@/mock-data/data';
import CardComponent from '@/components/card/CardComponent';
import Link from 'next/link';
 
export default function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const idNumber = Number(id);

const restaurant = data.find((resto) => resto.id === idNumber);

  if (!restaurant) return notFound();

  console.log(restaurant);
 
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <p className='text-2xl sm:text-3xl font-bold'>{restaurant.name}</p>
        <p className='text-muted-foreground max-w-3xl'>{restaurant.description}</p>
      </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {
                restaurant.dishes.map((dish) => (
                    <Link href={`/dish/${dish.id}`} key={dish.id}>
                        <CardComponent
                            key={dish.id}
                            name={dish.name}
                            id={dish.id}
                            description={dish.description}
                            image={dish.image}
                        />
                    </Link>
                ))
            
            }
        </div>
    </div>
  )
}

