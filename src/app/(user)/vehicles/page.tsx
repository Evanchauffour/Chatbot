import React from 'react'
import CreateVehicleDialog from '@/components/vehicles/CreateVehicleDialog';
import { cookies } from 'next/headers'
import VehicleCard from '@/components/vehicles/VehicleCard';

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

  const response = await fetch('http://localhost:8000/api/user/vehicles', {
    headers: {
      'Authorization': `Bearer ${token?.value}`,
    },
  })

  const vehicles: Vehicle[] = await response.json()

  console.log(vehicles);
  

  if(vehicles.length === 0) {
    return (
      <div className='flex flex-col items-end gap-4'>
        <p className='text-2xl font-bold'>Aucun véhicule trouvé</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-end gap-4'>
      <CreateVehicleDialog />
      <div className="grid grid-cols-3 gap-6 w-full">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} {...vehicle} />
        ))}
      </div>
    </div>
  )
}
