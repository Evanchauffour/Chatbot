// components/steps/VehicleSelectionStep.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import dayjs from "dayjs";
import type { Vehicle } from "@/types/chatbot";

type VehicleSelectionStepProps = {
  vehicles: Vehicle[];
  selectVehicle: (vehicleId: string) => void;
  onAddVehicle: () => void;
};

export default function VehicleSelectionStep({
  vehicles,
  selectVehicle,
  onAddVehicle,
}: VehicleSelectionStepProps) {
  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center w-full">
        <h3 className="font-medium">Sélectionnez votre véhicule</h3>
        <Button variant="outline" size="sm" onClick={onAddVehicle}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un véhicule
        </Button>
      </div>
      <div className="space-y-2">
        {vehicles.map((vehicle) => (
          <Card
            key={vehicle.id}
            className={`p-4 cursor-pointer transition-colors ${
              vehicle.selected ? "border-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => selectVehicle(vehicle.id)}
          >
            <div className="flex items-center gap-2">
              <Checkbox checked={vehicle.selected} />
              <div>
                <p className="font-medium">
                  {vehicle.brand} {vehicle.model}
                </p>
                <p className="text-sm text-gray-500">
                  {dayjs(vehicle.firstRegistrationDate).format("DD/MM/YYYY")} –{" "}
                  {vehicle.mileage} km
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
