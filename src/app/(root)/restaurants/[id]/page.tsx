'use client'
import { use } from 'react'
import { notFound } from 'next/navigation';
import data from '@/mock-data/data.js';
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
    <div className='flex flex-col gap-4 p-8'>
      <p>{restaurant.name}</p>
        <p>{restaurant.description}</p>
         <div className="grid grid-cols-4 gap-6 w-full">
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

