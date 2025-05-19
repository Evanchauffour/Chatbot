import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { useForm, ControllerRenderProps } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { createVehicle } from '@/actions/vehicle'

interface FormValues {
  brand: string
  model: string
  registrationNumber: string
  vin: string
  firstRegistrationDate: string
  mileage: number
}

interface CreateVehicleDialogProps {  
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateVehicleDialog({ open, onOpenChange }: CreateVehicleDialogProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      brand: '',
      model: '',
      registrationNumber: '',
      vin: '',
      firstRegistrationDate: '',
      mileage: 0,
    },
  })

  const handleConfirm = async (data: FormValues) => {
    console.log(data);
    
    try {
      const response = await createVehicle(data)
      console.log(response)
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating vehicle:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un véhicule</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleConfirm)} className="space-y-4">
            <FormField
              control={form.control}
              name="brand"
              render={({ field }: { field: ControllerRenderProps<FormValues, 'brand'> }) => (
                <FormItem>
                  <FormLabel>Marque</FormLabel>
                  <FormControl>
                    <Input placeholder="Mercedes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }: { field: ControllerRenderProps<FormValues, 'model'> }) => (
                <FormItem>
                  <FormLabel>Modèle</FormLabel>
                  <FormControl>
                    <Input placeholder="Classe E" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }: { field: ControllerRenderProps<FormValues, 'registrationNumber'> }) => (
                <FormItem>
                  <FormLabel>Numéro d&apos;immatriculation</FormLabel>
                  <FormControl>
                    <Input placeholder="AD230BR" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vin"
              render={({ field }: { field: ControllerRenderProps<FormValues, 'vin'> }) => (
                <FormItem>
                  <FormLabel>Numéro de série (VIN)</FormLabel>
                  <FormControl>
                    <Input placeholder="1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstRegistrationDate"
              render={({ field }: { field: ControllerRenderProps<FormValues, 'firstRegistrationDate'> }) => (
                <FormItem>
                  <FormLabel>Date de première immatriculation</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mileage"
              render={({ field }: { field: ControllerRenderProps<FormValues, 'mileage'> }) => (
                <FormItem>
                  <FormLabel>Kilométrage</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
