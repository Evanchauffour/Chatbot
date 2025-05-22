"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import React, { useCallback, useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { createDriver } from '@/actions/driver'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Check } from 'lucide-react'
import useDriversStore from '@/store/drivers.store'

interface DriversDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDriverSelect?: (driverId: string) => void
  onSubmit: () => void
  vehicleId?: string
}

interface Driver {
  "@id": string
  id: string
  firstName: string
  lastName: string
}

interface FormValues {
  firstName: string
  lastName: string
  phoneNumber: string
}

export default function DriversDialog({ open, onOpenChange, onDriverSelect, onSubmit, vehicleId }: DriversDialogProps) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const setDriversSelected = useDriversStore((state) => state.setDrivers)
  const driversSelected = useDriversStore((state) => state.drivers)
  const form = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
  })

  const getAllDrivers = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/user/drivers', {
        method: 'GET',
        headers: {
          'Accept': 'application/ld+json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch drivers');
      }
    
      const data = await response.json()
      setDrivers(data)
    } catch (error) {
      console.error('Error fetching drivers:', error)
    }
  }, [])

  const getDriversNotInVehicle = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/vehicle/${vehicleId}/not-drivers`, {
        method: 'GET',
        headers: {
          'Accept': 'application/ld+json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch drivers');
      }
    
      const data = await response.json()
      setDrivers(data)
    } catch (error) {
      console.error('Error fetching drivers:', error)
    }
  }, [vehicleId])

  useEffect(() => {
    if (open) {
      if (vehicleId) {
        getDriversNotInVehicle()
      } else {
        getAllDrivers()
      }
    }
  }, [getDriversNotInVehicle, getAllDrivers, open, vehicleId])

  const handleCreateDriver = async (data: FormValues) => {
    try {
      const newDriver = await createDriver(data)
      setDriversSelected([...drivers, newDriver])
      setIsCreating(false)
      form.reset()
      if (onDriverSelect) {
        onDriverSelect(newDriver.id)
      }
      setIsCreating(false)
      setDriversSelected([...driversSelected, newDriver])
      if (vehicleId) {
        getDriversNotInVehicle()
      } else {
        getAllDrivers()
      }
    } catch (error) {
      console.error('Error creating driver:', error)
    }
  }

  const selectDriver = (driver: Driver) => {
    if(driversSelected.some(d => d.id === driver.id)) {
      setDriversSelected(driversSelected.filter(d => d.id !== driver.id))
    } else {
      setDriversSelected([...driversSelected, driver])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un conducteurs</DialogTitle>
        </DialogHeader>
          {!isCreating ? (
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <Label>Sélectionner un conducteur existant</Label>
                <div className="grid gap-2">
                  {drivers.map((driver) => (
                    <Button
                      key={driver.id}
                      variant="outline"
                      className="flex justify-between"
                      onClick={() => selectDriver(driver)}
                    >
                      {driver.firstName} {driver.lastName}
                      {driversSelected.some(d => d.id === driver.id) && <Check className='w-4 h-4' />}
                    </Button>
                  ))}
                </div>
                <Button variant="default" onClick={() => onSubmit()}>Valider</Button>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-px flex-1 bg-gray-200' />
                <span className='text-sm text-gray-500'>ou</span>
                <div className='h-px flex-1 bg-gray-200' />
              </div>
              <Button variant="outline" onClick={() => setIsCreating(true)}>Créer un nouveau conducteur</Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateDriver)} className='space-y-4'>
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de téléphone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Créer</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
      </DialogContent>
    </Dialog>
  )
}
