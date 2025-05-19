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
import { useState } from "react"

interface VehicleSheetProps { 
  name: string
  brand: string
  model: string
  year: number
  imageUrl: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (vehicleData: { name: string; brand: string; model: string; year: number }) => void
}

export function VehicleSheet({ 
  name: initialName, 
  brand: initialBrand, 
  model: initialModel, 
  year: initialYear,
  open, 
  onOpenChange,
  onSave 
}: VehicleSheetProps) {
  const [name, setName] = useState(initialName)
  const [brand, setBrand] = useState(initialBrand)
  const [model, setModel] = useState(initialModel)
  const [year, setYear] = useState(initialYear)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSave) {
      onSave({ name, brand, model, year })
    }
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Modifier le véhicule</SheetTitle>
            <SheetDescription>
              Modifiez les informations de votre véhicule
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 p-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">
                Marque
              </Label>
              <Input 
                id="brand" 
                value={brand} 
                onChange={(e) => setBrand(e.target.value)}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Modèle
              </Label>
              <Input 
                id="model" 
                value={model} 
                onChange={(e) => setModel(e.target.value)}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">
                Année
              </Label>
              <Input 
                id="year" 
                type="number"
                value={year} 
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="col-span-3" 
              />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Enregistrer les modifications</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
