import React from 'react'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className='bg-gray-200 h-screen flex justify-center items-center align-center' >
        <Navbar />
        {children}
    </main>
  )
}

export default Layout;