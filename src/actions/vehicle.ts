"use server"

interface VehicleData {
  brand: string
  model: string
  registrationNumber: string
  vin: string
  firstRegistrationDate: string
  mileage: number
}

export async function createVehicle(data: VehicleData) {
  const response = await fetch('http://localhost:8000/api/vehicles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/ld+json',
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
