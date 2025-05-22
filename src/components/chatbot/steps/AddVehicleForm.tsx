// components/steps/AddVehicleForm.tsx
"use client";

import { useState, FormEvent, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
type VehicleData = {
  brand: string;
  model: string;
  registrationNumber: string;
  vin: string;
  firstRegistrationDate: string;
  mileage: number;
  drivers: string[];
};
type AddVehicleFormProps = {
  onSubmit: (data: VehicleData) => Promise<void>;
  onCancel: () => void;
};

export default function AddVehicleForm({
  onSubmit,
  onCancel,
}: AddVehicleFormProps) {
  const [formData, setFormData] = useState<VehicleData>({
    brand: "",
    model: "",
    registrationNumber: "",
    vin: "",
    firstRegistrationDate: "",
    mileage: 0,
    drivers: [],
  });
  const [isPending, startTransition] = useTransition();

  const handleChange = <K extends keyof VehicleData>(
    field: K,
    value: VehicleData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => onSubmit(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-4 space-y-4 max-w-[80%] bg-green-50 border-green-200">
        <h3 className="font-medium">Ajouter un véhicule</h3>
        <div className="space-y-2">
          <input
            className="w-full p-2 border rounded"
            placeholder="Marque"
            value={formData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            required
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Modèle"
            value={formData.model}
            onChange={(e) => handleChange("model", e.target.value)}
            required
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="N° d’immatriculation"
            value={formData.registrationNumber}
            onChange={(e) => handleChange("registrationNumber", e.target.value)}
            required
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="VIN"
            value={formData.vin}
            onChange={(e) => handleChange("vin", e.target.value)}
            required
          />
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={formData.firstRegistrationDate}
            onChange={(e) =>
              handleChange("firstRegistrationDate", e.target.value)
            }
            required
          />
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Kilométrage"
            value={formData.mileage}
            onChange={(e) => handleChange("mileage", Number(e.target.value))}
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "En cours…" : "Enregistrer"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
