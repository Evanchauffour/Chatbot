import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('BEARER')

  if (token) {
    redirect('/')
  }
  return (
    <div>
        {children}
    </div>
  )
}
