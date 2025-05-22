"use server"

import { cookies } from "next/headers"

interface DriverData {
  firstName: string
  lastName: string
  phoneNumber: string
}

export async function createDriver(data: DriverData) {
  const cookieStore = await cookies()
  const token = cookieStore.get('BEARER')
  
  const response = await fetch('http://localhost:8000/api/drivers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/ld+json',
      'Authorization': `Bearer ${token?.value}`,
    },
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      user: "/api/users/1",
    }),
  });  
  
  
  if (!response.ok) {
    throw new Error('Failed to create driver');
  }

  return response.json();
} 