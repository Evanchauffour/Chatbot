import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { Calendar, Car, House, User } from 'lucide-react'

export default function NavBar() {
  return (
    <aside className='w-64 h-full bg-gray-100 flex flex-col justify-between'>
      <nav>
        <ul className='flex flex-col'>
          <Button variant='ghost' asChild className='justify-start hover:bg-gray-200 p-6 rounded-md'>
            <Link href='/'>
              <House className='w-4 h-4 mr-2' />
              Accueil
            </Link>
          </Button>
          <Button variant='ghost' asChild className='justify-start hover:bg-gray-200 p-6 rounded-md'>
            <Link href='/appointments'>
              <Calendar className='w-4 h-4 mr-2' />
              Rendez-vous
            </Link>
          </Button>
          <Button variant='ghost' asChild className='justify-start hover:bg-gray-200 p-6 rounded-md'>
            <Link href='/vehicles'>
              <Car className='w-4 h-4 mr-2' />
              Véhicules
            </Link>
          </Button>
        </ul>
      </nav>
      <Button variant='ghost' asChild className='justify-start hover:bg-gray-200 p-6 rounded-md'>
        <Link href='/account'>
          <User className='w-4 h-4 mr-2' />
          Mon compte
        </Link>
      </Button>
    </aside>
  )
}
