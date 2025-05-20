import React from 'react'
import VehicleCard from '@/components/VehicleCard'
import CreateVehicleDialog from '@/components/vehicles/CreateVehicleDialog';
import { cookies } from 'next/headers'

interface Vehicle {
  id: number
  brand: string
  model: string
  registrationNumber: string
  vin: string
  firstRegistrationDate: string
  mileage: number
  drivers: string[]
  users: string[]
}

export default async function VehiclePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('BEARER')

  const response = await fetch('http://localhost:8000/api/users/1/vehicles', {
    headers: {
      'Authorization': `Bearer ${token?.value}`,
    },
  })

  const vehicles: Vehicle[] = await response.json()

  return (
    <div className='flex flex-col gap-4'>
      <CreateVehicleDialog />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} {...vehicle} />
        ))}
      </div>
    </div>
  )
}
