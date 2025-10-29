import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const page = () => {

  return (
    <div className='w-full max-w-md bg-white rounded-2xl shadow-sm p-6 sm:p-8'>
      <h1 className='text-xl font-semibold mb-6'>Se Connecter</h1>
      <div className='flex flex-col gap-4'>
          <Input placeholder='Email' />
          <Input placeholder='Password' type='password' />
      </div>
      <Button className='mt-6 w-full h-12 rounded-3xl'>Se Connecter</Button>
    </div>
  )
}

export default page