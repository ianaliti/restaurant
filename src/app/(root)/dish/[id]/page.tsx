'use client'
import { use } from 'react'
import { notFound } from 'next/navigation';
import data from '@/mock-data/data.js';
import Image from 'next/image';
 
export default function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const idNumber = Number(id);
  const allDishes = data.flatMap(resto => resto.dishes);


  const dish = allDishes.find(d => d.id === idNumber);

  if (!dish) return notFound();

  return (
    <div className='flex flex-col gap-4 p-8'>
      <Image 
        src={dish.image} 
        alt={`${dish.name} Image`} 
        width={500} 
        height={400}
        objectFit="cover"
      />
      <div>
        <p>{dish.name}</p>
        <p>Price: ${dish.price.toFixed(2)}</p>
        <p>{dish.description}</p>
      </div>
      
    </div>
  )
}
