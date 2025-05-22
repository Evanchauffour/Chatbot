"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import MapComponent from '../Map'
import { createAppointment } from '@/actions/appointment'
import { useChatbotStore } from '@/store/chatbot.store'

interface Dealership {
  id: string
  name: string
  latitude: number
  longitude: number
  address: string
  city: string
  state: string
  zip: string
}

interface UserLocation {
  latitude: number
  longitude: number
}

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30"
]

export default function AppointmentStep() {
  const { operationSelected, selectedVehicle } = useChatbotStore()
  const [dealerships, setDealerships] = useState<Dealership[]>([])
  const [dealershipSelected, setDealershipSelected] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [userLocation, setUserLocation] = useState<UserLocation>({
    latitude: 0,
    longitude: 0
  })

  const getNextDays = (days: number) => {
    const dates = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  useEffect(() => {
    fetchDealership()
  }, [])

  const fetchDealership = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/nearby-dealerships', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch dealerships')
      }

      const data = await response.json()
      setDealerships(data.dealerships)
      setUserLocation({
        latitude: data.userLocation.latitude,
        longitude: data.userLocation.longitude
      })
    } catch (error) {
      console.error(error)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }).format(date)
  }
  

  const handleSubmit = async () => {
    await createAppointment({
      "appointmentDate": selectedDate.toISOString(),
      "status": "string",
      "dealership": `/api/dealerships/${dealershipSelected}`,
      "supplementaryInfos": "string",
      "carOperations": operationSelected.map((operation) => `/api/car_operations/${operation.id}`),
      "vehicle": `/api/vehicles/${selectedVehicle?.id}`
    })
  }

  return (
    <div className='flex flex-col gap-4 w-full h-[600px]'>
      <h3 className='text-lg font-medium'>Choisissez une concession</h3>
      <div className='flex gap-4 w-full flex-1 overflow-hidden'>
        <aside className='h-full flex flex-col gap-2'>
          <div className='grid grid-cols-3 gap-1 pb-2'>
            {getNextDays(7).map((date, index) => (
              <Button
                key={index}
                variant={selectedDate.toDateString() === date.toDateString() ? 'default' : 'outline'}
                className='whitespace-nowrap text-xs px-2 py-1 h-8'
                onClick={() => setSelectedDate(date)}
              >
                {formatDate(date)}
              </Button>
            ))}
          </div>
          <Card className='flex flex-col gap-2 p-4 h-full overflow-y-auto'>
            {dealerships.map((dealership) => (
              <div key={dealership.id} className='flex flex-col gap-2'>
                <Button 
                  variant={dealershipSelected === dealership.id ? 'default' : 'outline'}
                  className='w-full h-fit flex-col items-start'
                  onClick={() => setDealershipSelected((state) => state === dealership.id ? '' : dealership.id)}
                >
                  <p className='text-sm font-medium'>{dealership.name}</p>
                  <p className={`text-xs ${dealershipSelected === dealership.id ? 'text-white' : 'text-gray-500'}`}>{dealership.address}, {dealership.city}</p>
                </Button>
                {dealershipSelected === dealership.id && (
                  <div className='grid grid-cols-3 gap-1 pl-2'>
                    {TIME_SLOTS.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedSlot === slot ? 'default' : 'outline'}
                        className='text-xs px-2 py-1 h-8'
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Card>
        </aside>
        <Card className='p-4 flex-1'>
          <MapComponent dealerships={dealerships} dealershipSelected={dealershipSelected} userLocation={userLocation}/>
        </Card>
      </div>
      <Button className='w-fit ml-auto' onClick={handleSubmit}>Valider</Button>
    </div>
  )
}
