import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import dayjs from 'dayjs'
import { Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'

interface AppointmentCardProps {
  dealership: {
    name: string
    address: string
    city: string
  }
  date: Date
  vehicle: {
    id: string
    brand: string
    model: string
  }
  isPast?: boolean
}

export default function AppointmentCard({ dealership, date, vehicle, isPast = false }: AppointmentCardProps) {
  return (
    <Card className={isPast ? 'opacity-50' : ''}>
      <CardHeader>
        <CardTitle className="text-xl">{dealership.name}</CardTitle>
        <div className="flex items-start text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-1" />
          <p className='flex-1'>{dealership.address}, {dealership.city}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className='flex items-center'>
            <Calendar className="w-4 h-4 mr-1" />
            <p className="text-sm text-gray-500">
              {dayjs(date).locale('fr').format('D MMMM YYYY')}
            </p>
          </div>
          <p className='text-sm'>Véhicule : <Link href={`/vehicles?vehicleId=${vehicle.id}`} className='text-blue-500'>{vehicle.brand} {vehicle.model}</Link></p>
        </div>
      </CardContent>
    </Card>
  )
}
