import Header from '@/components/header/Header'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className='mx-12'>
        {children}
      </main>
    </div>
  )
}
