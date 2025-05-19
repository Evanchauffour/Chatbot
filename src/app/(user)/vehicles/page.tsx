import React from 'react'
import VehicleCard from '@/components/VehicleCard'
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Sample data - In a real application, this would come from an API or database
const sampleVehicles = [
  {
    id: '1',
    name: 'Berline Premium',
    brand: 'Mercedes',
    model: 'Classe E',
    year: 2023,
    imageUrl: '/voiture.png',
  },
  {
    id: '2',
    name: 'SUV Familial',
    brand: 'BMW',
    model: 'X5',
    year: 2023,
    imageUrl: '/voiture.png',
  },
  {
    id: '3',
    name: 'Citadine Électrique',
    brand: 'Renault',
    model: 'Zoe',
    year: 2023,
    imageUrl: '/voiture.png',
  },
];

export default function VehiclePage() {
  return (
    <div className='flex flex-col gap-4'>
      <Button className='w-fit'><Plus className='w-4 h-4 mr-2' /> Ajouter un véhicule</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} {...vehicle} />
        ))}
      </div>
    </div>
  )
}
