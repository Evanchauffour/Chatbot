"use client";

// components/steps/AddVehicleForm.tsx
import { useState, FormEvent, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    mileage: NaN, // j'ai mis NaN car le 0 bloque et null passe pas pour number
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
    <div className="flex justify-center px-2 md:px-4 py-4 md:py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-5xl">
        <Card className="p-4 md:p-8 space-y-4 md:space-y-8">
          <h3 className="text-xl md:text-2xl font-semibold text-center">
            Ajouter un nouveau véhicule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {[
              {
                id: "brand",
                label: "Marque",
                type: "text",
                value: formData.brand,
                onChange: (v: string) => handleChange("brand", v),
                placeholder: "Marque",
              },
              {
                id: "model",
                label: "Modèle",
                type: "text",
                value: formData.model,
                onChange: (v: string) => handleChange("model", v),
                placeholder: "Modèle",
              },
              {
                id: "registrationNumber",
                label: "N° d'immatriculation",
                type: "text",
                value: formData.registrationNumber,
                onChange: (v: string) => handleChange("registrationNumber", v),
                placeholder: "N° d'immatriculation",
              },
              {
                id: "vin",
                label: "VIN",
                type: "text",
                value: formData.vin,
                onChange: (v: string) => handleChange("vin", v),
                placeholder: "VIN",
              },
              {
                id: "firstRegistrationDate",
                label: "Date de première immatriculation",
                type: "date",
                value: formData.firstRegistrationDate,
                onChange: (v: string) =>
                  handleChange("firstRegistrationDate", v),
                placeholder: "",
              },
              {
                id: "mileage",
                label: "Kilométrage",
                type: "number",
                value: String(formData.mileage),
                onChange: (v: string) => handleChange("mileage", Number(v)),
                placeholder: "Kilométrage",
              },
            ].map(({ id, label, type, value, onChange, placeholder }) => (
              <div key={id}>
                <Label htmlFor={id} className="text-base md:text-lg">
                  {label}
                </Label>
                <Input
                  id={id}
                  type={type}
                  value={value}
                  placeholder={placeholder}
                  onChange={(e) => onChange(e.target.value)}
                  required
                  className="w-full h-10 md:h-12 text-base md:text-lg"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 md:gap-6 pt-4 md:pt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isPending}
              className="px-4 md:px-6"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="px-4 md:px-6"
            >
              {isPending ? "En cours…" : "Enregistrer"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
