import Header from '@/components/header/Header'
import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('BEARER')

  if (!token) {
    redirect('/signin')
  }

  return (
    <div className='flex flex-col gap-10'>
      <Header />
      <main className='mx-12'>
        {children}
      </main>
    </div>
  )
}
