"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useForm } from "react-hook-form"
import { updateVehicle } from "@/actions/vehicle"
import { useState } from "react"
import ManageDriversDialog from "./ManageDriversDialog"

interface VehicleSheetProps { 
  id: string
  brand: string
  model: string
  registrationNumber: string
  vin: string
  firstRegistrationDate: string
  mileage: number
  imageUrl: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

type FormData = {
  brand: string
  model: string
  registrationNumber: string
  vin: string
  firstRegistrationDate: string
  mileage: number
  drivers: string[]
}

export function VehicleSheet({ 
  id,
  brand: initialBrand, 
  model: initialModel, 
  registrationNumber: initialRegistrationNumber,
  vin: initialVin,
  firstRegistrationDate: initialFirstRegistrationDate,
  mileage: initialMileage,
  open, 
  onOpenChange,
}: VehicleSheetProps) {
  const [driversDialogOpen, setDriversDialogOpen] = useState(false)
  const form = useForm<FormData>({
    defaultValues: {
      brand: initialBrand,
      model: initialModel,
      registrationNumber: initialRegistrationNumber,
      vin: initialVin,
      firstRegistrationDate: initialFirstRegistrationDate.split('T')[0],
      mileage: initialMileage,
    }
  })

  const handleSubmit = async (data: FormData) => {
    try {
      await updateVehicle(data, id)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update vehicle:', error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <SheetHeader>
            <SheetTitle>Modifier le véhicule</SheetTitle>
            <SheetDescription>
              Modifiez les informations de votre véhicule
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 p-4">
            <Button className='w-full' onClick={() => setDriversDialogOpen(true)}>Gérer les conducteurs</Button>
            <div className="flex flex-col gap-2">
              <Label htmlFor="brand" className="text-right">
                Marque
              </Label>
              <Input 
                id="brand" 
                {...form.register("brand")}
                className="col-span-3" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="model" className="text-right">
                Modèle
              </Label>
              <Input 
                id="model" 
                {...form.register("model")}
                className="col-span-3" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="registrationNumber" className="text-right">
                Immatriculation
              </Label>
              <Input 
                id="registrationNumber" 
                {...form.register("registrationNumber")}
                className="col-span-3" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="vin" className="text-right">
                Numéro de série (VIN)
              </Label>
              <Input 
                id="vin" 
                {...form.register("vin")}
                className="col-span-3" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstRegistrationDate" className="text-right">
                Date de première immatriculation
              </Label>
              <Input 
                id="firstRegistrationDate" 
                type="date"
                {...form.register("firstRegistrationDate")}
                className="col-span-3" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mileage" className="text-right">
                Kilométrage
              </Label>
              <Input 
                id="mileage" 
                type="number"
                {...form.register("mileage", { valueAsNumber: true })}
                className="col-span-3" 
              />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Enregistrer les modifications</Button>
          </SheetFooter>
        </form>
      </SheetContent>
      <ManageDriversDialog open={driversDialogOpen} onOpenChange={setDriversDialogOpen} id={id} />
    </Sheet>
  )
}
