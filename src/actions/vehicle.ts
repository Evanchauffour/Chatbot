"use server"

import { cookies } from "next/headers"

interface VehicleData {
  brand: string
  model: string
  registrationNumber: string
  vin: string
  firstRegistrationDate: string
  mileage: number
}

export async function createVehicle(data: VehicleData) {
  const cookieStore = await cookies()
  const token = cookieStore.get('BEARER')
  
  const response = await fetch('http://localhost:8000/api/vehicles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/ld+json',
      'Authorization': `Bearer ${token?.value}`,
    },
    body: JSON.stringify({
      brand: data.brand,
      model: data.model,
      registrationNumber: data.registrationNumber,
      vin: data.vin,
      firstRegistrationDate: new Date(data.firstRegistrationDate).toISOString(),
      mileage: Number(data.mileage),
      drivers: ["/api/drivers/1"],
    }),
  });
  
  const json = await response.json();

  if (!response.ok) {
    throw new Error('Failed to create vehicle');
  }

  return json;
}

export async function updateVehicle(data: VehicleData, id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('BEARER')

  const response = await fetch(`http://localhost:8000/api/vehicles/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/merge-patch+json',
      'Accept': 'application/ld+json',
      'Authorization': `Bearer ${token?.value}`,
    },
    body: JSON.stringify({
      brand: data.brand,
      model: data.model,
      registrationNumber: data.registrationNumber,
      vin: data.vin,
      firstRegistrationDate: new Date(data.firstRegistrationDate).toISOString(),
      mileage: Number(data.mileage),
    }),
  })  
  
  if (!response.ok) {
    throw new Error('Failed to update vehicle');
  }

  return response.json();
}

