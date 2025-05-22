"use server"

import { cookies } from "next/headers"

interface AppointmentData {
  appointmentDate: string
  status: string
  dealership: string
  supplementaryInfos?: string
  carOperations: string[]
  vehicle: string
}

export async function createAppointment(data: AppointmentData) {
  const cookieStore = await cookies()
  const token = cookieStore.get('BEARER')

  const response = await fetch('http://localhost:8000/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/ld+json',
      'Authorization': `Bearer ${token?.value}`,
    },
    body: JSON.stringify({
      appointmentDate: data.appointmentDate,
      status: data.status,
      dealership: data.dealership,
      supplementaryInfos: data.supplementaryInfos,
      carOperations: data.carOperations,
      vehicle: data.vehicle
    }),
  });  
  
  const json = await response.json();

  if (!response.ok) {
    throw new Error('Failed to create appointment');
  }

  return json;
}