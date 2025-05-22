"use server"

import { cookies } from "next/headers";

interface User {
  email: string
  roles: string[]
  title: string
  lastName: string
  firstName: string
  address: string
  phoneNumber: string
}

export async function updateUser(data: Partial<User>, id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('BEARER')

  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined && value !== '')
  );

  const response = await fetch(`http://localhost:8000/api/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/merge-patch+json',
      'Accept': 'application/ld+json',
      'Authorization': `Bearer ${token?.value}`,
    },
    body: JSON.stringify(filteredData),
  })  
  
  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return response.json();
}