"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { VehicleSheet } from './VehicleSheet';
import { Card } from '../ui/card';

interface VehicleCardProps {
  id: number;
  brand: string;
  model: string;
  registrationNumber: string;
  vin: string;
  firstRegistrationDate: string;
  mileage: number;
  drivers: string[];
  users: string[];
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  id,
  brand,
  model,
  registrationNumber,
  vin,
  firstRegistrationDate,
  mileage,
}) => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const vehicleId = searchParams.get('vehicleId');
    
    if(vehicleId && vehicleId === id.toString()) {
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
    <Card className='p-4'>
      <div className="relative h-48 w-full">
        <Image
          src="/voiture.png"
          alt={`${brand} ${model}`}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{brand} {model}</h3>
        <p className="text-gray-600">Immatriculation: {registrationNumber}</p>
        <p className="text-gray-500">Kilométrage: {mileage} km</p>
        <p className="text-gray-500">Date de première immatriculation: {new Date(firstRegistrationDate).toLocaleDateString()}</p>
        <button onClick={() => setOpen(true)} className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300">
          Voir les détails
        </button>
      </div>
      <VehicleSheet
        open={open} 
        onOpenChange={handleOpenChange}
        id={id.toString()}
        brand={brand} 
        model={model} 
        registrationNumber={registrationNumber}
        vin={vin}
        firstRegistrationDate={firstRegistrationDate}
        mileage={mileage}
        imageUrl="/voiture.png"
      />
    </Card>
  );
};

export default VehicleCard; 