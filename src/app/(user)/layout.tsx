import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import NavBar from '@/components/NavBar'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('BEARER')

  if (!token) {
    redirect('/signin')
  }

  return (
    <div className='flex h-screen'>
      <NavBar />
      <main className='mx-12 py-4 flex-1'>
        {children}
      </main>
    </div>
  )
}
