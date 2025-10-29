import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className='w-full bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm'>
        <div className='max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6'>
          <Link href='/restaurants' className='text-lg font-semibold tracking-tight'>Restaurants</Link>
          <div className='flex items-center gap-6 text-sm'>
            <Link className='hover:text-primary transition-colors' href='/cart'>Panier</Link>
            <Link className='hover:text-primary transition-colors' href='/commands'>Commandes</Link>
            <Link className='hover:text-primary transition-colors' href='/profile'>Mon Profil</Link>
          </div>
        </div>
    </nav>
  )
}

export default Navbar