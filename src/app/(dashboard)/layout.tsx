import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import NavBar from '@/components/NavBar'

export default async function layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('BEARER')

  if (!token) {
    redirect('/signin')
  }
  return (
    <div className='flex h-screen'>
        <NavBar />
        <main className='flex-1 mx-12'>
            {children}
        </main>
    </div>
  )
}
