import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const page = () => {
  return (
    <div className='max-w-lg mx-auto px-4 sm:px-6 py-8'>
        <h1 className='text-2xl font-bold mb-6'>Mon Profil</h1>
        <div className='flex flex-col gap-4'>
          <Input placeholder='Nom complet' />
          <Input placeholder='Adresse e-mail' />
        </div>
        <Button className='mt-6 h-12 rounded-3xl px-8'>Mettre à jour</Button>
    </div>
  )
}

export default page