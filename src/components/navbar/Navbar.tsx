import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className='w-full h-16 bg-white shadow-md flex items-center px-8'>
        <ul>
            <Link href='/restaurants'>Restaurants</Link>
            <Link href='/cart'>Panier</Link>
            <Link href='/profile'>Profile</Link>
            <Link href='/commands'>Commandes</Link>
            
        </ul>
    </nav>
  )
}

export default Navbar