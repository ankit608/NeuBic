import React from 'react'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
const Navbar = () => {
  return (
    <nav className="bg-gray-900/90 p-4 text-white fixed w-full top-0 left-0 z-10 backdrop-blur-sm bg-opacity-0">
      <div className="w-full mx-auto flex justify-between items-center">
     <div className="text-3xl font-extrabold bg-gradient-to-r from-green-200 to-green-700 bg-clip-text text-transparent"> NeuBic </div>


        <div className=''>
          <a href="/" className="px-3 py-2 rounded hover:bg-gray-700">Home</a>
          <a href="/about" className="px-3 py-2 rounded hover:bg-gray-700">About</a>
          <a href="/contact" className="px-3 py-2 rounded hover:bg-gray-700">Contact</a>
        </div>
         <div>
            <HoverBorderGradient children={<h1 className=' cursor-pointer'>Sign In</h1>} containerClassName="bg-green-900 p-0 px-4" className=' font-medium bg-gradient-to-r from-orange-200 to-orange-700 bg-clip-text text-transparent'></HoverBorderGradient>
         </div>
      </div>
    </nav>
  )
}


export default Navbar
