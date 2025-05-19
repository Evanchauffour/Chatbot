"use client"

import React from 'react'
import UserButton from './UserButton'

export default function Header () {

  return (
    <header className='flex items-center justify-between px-12 py-6'>
      <div className='flex items-center gap-8'>
        <nav>
          <ul className="flex gap-8">
            <li>
              <a href="/home" className="text-base">Accueil</a>
            </li>
          </ul>
        </nav>
      </div>
      <UserButton />
    </header>
  )
}