import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const page = () => {

  return (
    <div className='flex flex-col gap-10 w-md'>
      <div className='flex flex-col gap-4'>
          <Input />
          <Input />
      </div>
        <Button>Se Connecter</Button>
    </div>
  )
}

export default page