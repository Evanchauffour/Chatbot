"use client"

import AppointmentCard from '@/components/appointments/AppointmentCard'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const appointments = [
  {
    id: 1,
    garageName: "Garage Auto Plus",
    location: "123 Avenue de la République, 75011 Paris",
    date: new Date("2024-05-25"),
    vehicle: {
      id: '1',
      name: "Berline Premium",
      brand: "Renault",
      model: "Clio",
      year: 2020
    }
  },
  { 
    id: 2,
    garageName: "SUV Familial",
    location: "45 Rue des Lilas, 69003 Lyon",
    date: new Date("2024-06-02"),
    vehicle: {
      id: '2',
      name: "Peugeot 208",
      brand: "Peugeot",
      model: "208",
      year: 2019
    }
  },
  {
    id: 3,
    garageName: "Auto Service",
    location: "8 Boulevard Gambetta, 13001 Marseille",
    date: new Date("2024-05-18"),
    vehicle: {
      id: '3',
      name: "Citroën C3",
      brand: "Citroën",
      model: "C3",
      year: 2021
    }
  }
]

export default function AppointmentPage() {
  const [showPast, setShowPast] = useState(false)
  const today = new Date("2024-05-19")

  const filteredAppointments = appointments.filter(appointment => {
    if (showPast) return true
    return appointment.date >= today
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant={showPast ? "default" : "outline"}
          onClick={() => setShowPast(!showPast)}
        >
          {showPast ? "Masquer les rendez-vous passés" : "Afficher les rendez-vous passés"}
        </Button>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        {filteredAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            garageName={appointment.garageName}
            location={appointment.location}
            date={appointment.date}
            vehicle={appointment.vehicle}
            isPast={appointment.date < today}
          />
        ))}
      </div>
    </div>
  )
}
