"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import React, { useCallback, useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'
import DriversDialog from './DriversDialog'
import { Card } from '../ui/card'
import { deleteVehicleDriver, updateVehicleDrivers } from '@/actions/vehicle'
import useDriversStore from '@/store/drivers.store'

interface DriversDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDriverSelect?: (driverId: string) => void,
  id: string
}

interface Driver {
  "@id": string
  id: string
  firstName: string
  lastName: string
}

export default function ManageDriversDialog({ open, onOpenChange, id }: DriversDialogProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [drivers, setDrivers] = useState<Driver[]>([])
  const driversSelected = useDriversStore((state) => state.drivers)

  const getDrivers = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/vehicle/${id}/drivers`, {
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
  }, [id])

  useEffect(() => {
    if (open) {
      getDrivers()
    }
  }, [getDrivers, open])

  const handleDeleteDriver = async (driverId: string) => {
    await deleteVehicleDriver(id, driverId)
    getDrivers()
  }

  const handleUpdateDrivers = async () => {
    const finalDrivers = [...drivers.map((driver) => driver.id), ...driversSelected.map((driver) => driver.id)]
    await updateVehicleDrivers(id, finalDrivers)
    getDrivers()
    setIsCreating(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gérer les conducteurs</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label>Sélectionner un conducteur existant</Label>
            <div className="grid gap-2">
              {drivers.map((driver) => (
                <Card
                  key={driver.id}
                  className="flex flex-row justify-between py-2 px-4"
                >
                  {driver.firstName} {driver.lastName}
                  <button onClick={() => handleDeleteDriver(driver.id)}><Trash className='w-4 h-4' /></button>
                </Card>
              ))}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-px flex-1 bg-gray-200' />
            <span className='text-sm text-gray-500'>ou</span>
            <div className='h-px flex-1 bg-gray-200' />
          </div>
          <Button variant="outline" onClick={() => setIsCreating(true)}>Créer un nouveau conducteur</Button>
        </div>
      </DialogContent>
      <DriversDialog open={isCreating} onOpenChange={setIsCreating} onSubmit={() => {handleUpdateDrivers()}} vehicleId={id} />
    </Dialog>
  )
}
