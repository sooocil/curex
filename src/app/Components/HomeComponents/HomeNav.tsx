import React from 'react'
import { lusitana } from '../../fonts/fonts'
import { Button } from '@/components/ui/button'

const HomeNav = () => {
  return (
    <div>
        <nav className="sticky mt-2 flex items-center h-16  bg-white text-black   font-sans" role="navigation">
            <a href="/" className={`${lusitana.className} text-blue-500 text-6xl mr-20`} >Curex</a>
            <div className=" font-serif text-2xl flex justify-center items-center align-middle gap-4">
            <a href="/" className="p-4">Home</a>
            <a href="/about" className="p-4">About</a>
            <a href="/services" className="p-4">Services</a>
            <a href="/contact" className="p-4">Contact</a>
            <Button  className='rounded-none m-2 bg-slate-500 text-white'  size={'lg'} variant={'outline'}>Sign Up</Button>
            <Button className='rounded-none m-2 bg-blue-500'  size={'lg'}>Login</Button>

            </div>
        </nav>
        
    </div>
  )
}

export default HomeNav