"use client"

import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export default function UserButton () {

  const router = useRouter()
  const logout = async () => {
    try {
      const res = await fetch(`http://localhost:4000/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        throw new Error('Échec de la déconnexion')
      }
      router.push('/')
    } catch {
      console.error('Erreur lors de la déconnexion')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem><Link href='/account'>Mon compte</Link></DropdownMenuItem>
        <DropdownMenuItem><Link href='/appointments'>Rendez-vous</Link></DropdownMenuItem>
        <DropdownMenuItem><Link href='/vehicles'>Véhicules</Link></DropdownMenuItem>
        <DropdownMenuItem><button onClick={logout}>Déconnexion</button></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
