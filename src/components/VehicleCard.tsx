"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { VehicleSheet } from './vehicles/VehicleSheet';
import { useSearchParams, useRouter } from 'next/navigation';

interface VehicleCardProps {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  imageUrl: string;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  id,
  name,
  brand,
  model,
  year,
  imageUrl,
}) => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const vehicleId = searchParams.get('vehicleId');
    
    if(vehicleId && vehicleId === id) {
      setOpen(true);
    }
  }, [searchParams, id]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('vehicleId');
      router.replace(`/vehicles`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={`${brand} ${model}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <p className="text-gray-600">{brand} {model}</p>
        <p className="text-gray-500">Année: {year}</p>
        <button onClick={() => setOpen(true)} className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300">
          Voir les détails
        </button>
      </div>
      <VehicleSheet 
        open={open} 
        onOpenChange={handleOpenChange}
        name={name} 
        brand={brand} 
        model={model} 
        year={year} 
        imageUrl={imageUrl} 
      />
    </div>
  );
};

export default VehicleCard; 